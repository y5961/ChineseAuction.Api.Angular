using ChineseAuctionAPI.Data;
using ChineseAuctionAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace ChineseAuctionAPI.Repositories
{
    public class OrderRepo : IOrderRepo
    {
        private readonly SaleContextDB _context;


        public OrderRepo(SaleContextDB context)
        {
            _context = context;

        }

        public async Task AddOrUpdateGiftInOrderAsync(int userId, int IdGift, int amount)
        {
            // 1. שליפת ההזמנה כולל החבילות והמתנות שכבר קיימות בה
            var order = await _context.OrdersOrders
                .Include(o => o.OrdersGift)
                .Include(o => o.OrdersPackage) // חשוב! כדי לדעת כמה כרטיסים יש לו
                .FirstOrDefaultAsync(o => o.IdUser == userId && o.Status == OrderStatus.Draft);

            if (order == null) throw new Exception("עליך לבחור חבילה לפני בחירת מתנות");

            // 2. חישוב סך הכרטיסים המגיעים לו מהחבילות (לפי השדות בדגם שלך)
            // אני משתמש ב-AmountRegular, שנהי לפי הצורך ל-AmountPremium אם זו מתנת פרימיום
            var totalTicketsAllowed = await _context.OrdersPackage
                .Where(op => op.OrderId == order.IdOrder)
                .Join(_context.Packages, op => op.IdPackage, p => p.IdPackage, (op, p) => p.AmountRegular * op.Quantity)
                .SumAsync();

            // 3. חישוב כמה כרטיסים הוא כבר ניצל (סכום ה-Amount של המתנות)
            var currentUsedTickets = order.OrdersGift.Sum(og => og.Amount);

            // בדיקה אם המתנה החדשה תחרוג מהמותר
            var existingGift = order.OrdersGift.FirstOrDefault(og => og.IdGift == IdGift);
            int extraRequested = amount - (existingGift?.Amount ?? 0);

            if (currentUsedTickets + extraRequested > totalTicketsAllowed)
            {
                // זריקת שגיאה שתחזור ל-Angular ותקפיץ את ההודעה
                throw new InvalidOperationException("INSUFFICIENT_TICKETS");
            }

            // 4. לוגיקת ההוספה הקיימת שלך...
            if (existingGift != null)
            {
                existingGift.Amount = amount;
            }
            else
            {
                order.OrdersGift.Add(new OrdersGift { IdGift = IdGift, Amount = amount, IdOrder = order.IdOrder });
            }

            await _context.SaveChangesAsync();
        }
        public async Task<int> GetRemainingTicketsAsync(int userId)
        {
            var order = await _context.OrdersOrders
                .Include(o => o.OrdersGift)
                .Include(o => o.OrdersPackage)
                .FirstOrDefaultAsync(o => o.IdUser == userId && o.Status == OrderStatus.Draft);

            if (order == null) return 0;

            var total = order.OrdersPackage.Sum(op => _context.Packages.Find(op.IdPackage).AmountRegular * op.Quantity);
            var used = order.OrdersGift.Sum(og => og.Amount);

            return total - used;
        }
 
        public async Task<bool?> CompleteOrder(int orderId)
        {
            var order = await _context.OrdersOrders.FindAsync(orderId);
            if (order == null)
                return null;

            order.Status = OrderStatus.Completed;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Order> CreateDraftOrderAsync(int userId)
        {
            var draftOrder = new Order
            {
                IdUser = userId,
                Status = OrderStatus.Draft,
                OrderDate = DateTime.UtcNow,
                OrdersGift = new List<OrdersGift>()
            };

            _context.OrdersOrders.Add(draftOrder);
            await _context.SaveChangesAsync();
            return draftOrder;
        }

        public async Task<bool> DeleteAsync(int orderId, int giftId, int amount)
        {
            var gift = await _context.Gifts.FindAsync(giftId);
            var order = await _context.OrdersOrders
                .Include(o => o.OrdersGift)
                .FirstOrDefaultAsync(o => o.IdOrder == orderId);

            if (order == null)
                throw new Exception("Order not found");

            var orderGift = order.OrdersGift
                .FirstOrDefault(go => go.IdGift == giftId);

            if (orderGift == null)
                throw new Exception("Gift not found in order");

            orderGift.Amount -= amount;
            order.Price = order.Price - gift.Price * amount;

            if (orderGift.Amount <= 0)
            {
                _context.OrdersGift.Remove(orderGift);
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public Task<Order?> GetByIdWithGiftsAsync(int orderId)
        {
            return _context.OrdersOrders
                .Include(o => o.OrdersGift)
                .ThenInclude(go => go.Gift)
                .FirstOrDefaultAsync(o => o.IdOrder == orderId);
        }

   
      
        public async Task<IEnumerable<Order>> GetAllOrder(int userId)
        {
            return await _context.OrdersOrders
                .Where(o => o.IdUser == userId)
                .Include(o => o.OrdersGift)
                    .ThenInclude(og => og.Gift)
                        .ThenInclude(g => g.Category)
                .ToListAsync();
        }
        public async Task<Order?> GetDraftOrderByUserAsync(int userId)
        {
            return await _context.OrdersOrders
                .Include(o => o.OrdersGift)
                .ThenInclude(go => go.Gift)
                .FirstOrDefaultAsync(o => o.IdUser == userId && o.Status == OrderStatus.Draft);
        }
        public async Task AddOrUpdatePackageInOrderAsync(int userId, int packageId, int amount)
        {
            // 1. מציאת הזמנת טיוטה או יצירת חדשה
            var order = await GetDraftOrderByUserAsync(userId) ?? await CreateDraftOrderAsync(userId);

            var package = await _context.Packages.FindAsync(packageId);
            if (package == null) throw new Exception("Package not found");

            // 2. חיפוש אם החבילה כבר קיימת בהזמנה
            var orderPackage = await _context.OrdersPackage
                .FirstOrDefaultAsync(op => op.OrderId == order.IdOrder && op.IdPackage == packageId);

            if (orderPackage != null)
            {
                if (amount <= 0)
                {
                    // הסרת המחיר היחסי לפני המחיקה
                    order.Price -= package.Price * orderPackage.Quantity;
                    _context.OrdersPackage.Remove(orderPackage);
                }
                else
                {
                    // תיקון: עדכון המחיר לפי ההפרש בין הכמות הישנה לחדשה
                    int difference = amount - orderPackage.Quantity;
                    order.Price += package.Price * difference;

                    // תיקון קריטי: השמה ישירה של הכמות
                    orderPackage.Quantity = amount;
                }
            }
            else if (amount > 0)
            {
                // הוספה חדשה - כאן amount הוא הכמות ההתחלתית (בד"כ 1)
                var newOrderPackage = new OrdersPackage
                {
                    OrderId = order.IdOrder,
                    IdPackage = packageId,
                    Quantity = amount,
                    PriceAtPurchase = package.Price
                };
                _context.OrdersPackage.Add(newOrderPackage);
                order.Price += package.Price * amount;
            }

            await _context.SaveChangesAsync();
        }
      
    }
}