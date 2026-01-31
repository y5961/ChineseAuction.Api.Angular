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

        //public async Task AddOrUpdateGiftInOrderAsync(int orderId, int giftId, int amount)
        //{
        //    var gift = await _context.Gifts.FindAsync(giftId);
        //    var order = await _context.OrdersOrders
        //        .Include(o => o.OrdersGift)
        //        .FirstOrDefaultAsync(o => o.IdOrder == orderId);

        //    if (order == null)
        //        throw new Exception("Order not found");

        //    var orderGift = order.OrdersGift
        //        .FirstOrDefault(go => go.IdGift == giftId);

        //    if (orderGift != null)
        //    {
        //        // Update existing gift amount
        //        orderGift.Amount = amount;
        //        _context.OrdersGift.Update(orderGift);
        //    }
        //    else
        //    {
        //        // Add new gift to order
        //        orderGift = new OrdersGift
        //        {
        //            IdOrder = orderId,
        //            IdGift = giftId,
        //            Amount = amount,
        //        };
        //        _context.OrdersGift.Add(orderGift);
        //    }

        //    order.Price = order.Price + gift.Price * amount;
        //    await _context.SaveChangesAsync();
        //}
        //public async Task AddOrUpdateGiftInOrderAsync(int userId, int IdGift, int amount)
        //{
        //    var ord = await _context.OrdersOrders
        //        .Include(o => o.OrdersGift)
        //        .FirstOrDefaultAsync(o => o.IdUser == userId && o.Status == OrderStatus.Draft);

        //    if (ord == null)
        //        throw new InvalidOperationException("לא ניתן להוסיף מוצרים להזמנה סגורה או שאינה קיימת.");

        //    var order = await _context.OrdersOrders
        //   .Include(o => o.OrdersGift)
        //    .FirstOrDefaultAsync(o => o.IdUser == userId && o.Status == OrderStatus.Draft);
        //    if (order == null)
        //    {
        //        order = new Order
        //        {
        //            IdUser = userId,
        //            Price = 0,
        //            OrderDate = DateTime.Now,
        //            Status = OrderStatus.Draft
        //        };
        //        _context.OrdersOrders.Add(order);
        //        await _context.SaveChangesAsync();
        //    }

        //    var existing = ord.OrdersGift?.FirstOrDefault(go => go.IdGift == IdGift);
        //}
        public async Task AddOrUpdateGiftInOrderAsync(int userId, int IdGift, int amount)
        {
            // 1. חיפוש הזמנה קיימת בטיוטה
            var order = await _context.OrdersOrders
                .Include(o => o.OrdersGift)
                .FirstOrDefaultAsync(o => o.IdUser == userId && o.Status == OrderStatus.Draft);

            // 2. אם לא קיימת, יוצרים אחת חדשה
            if (order == null)
            {
                order = new Order
                {
                    IdUser = userId,
                    Price = 0,
                    OrderDate = DateTime.Now,
                    Status = OrderStatus.Draft,
                    OrdersGift = new List<OrdersGift>()
                };
               
                _context.OrdersOrders.Add(order);
                await _context.SaveChangesAsync();
            }

            // 3. הוספה או עדכון של המתנה בתוך ה-order שמצאנו/יצרנו
            var existingGift = order.OrdersGift.FirstOrDefault(og => og.IdGift == IdGift);
            if (existingGift != null)
            {
                existingGift.Amount = amount;
            }
            else
            {
                order.OrdersGift.Add(new OrdersGift
                {
                    IdGift = IdGift,
                    Amount = amount,
                    IdOrder = order.IdOrder
                });
            }

            await _context.SaveChangesAsync();
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

        //public async Task<IEnumerable<Order?>> GetAllOrder(int userId)
        //{
        //    return await _context.OrdersOrders
        //        .Where(o => o.IdUser == userId)
        //        .ToListAsync();
        //}
      
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
        // בתוך מחלקת OrderRepo
        //public async Task AddOrUpdatePackageInOrderAsync(int userId, int packageId, int amount)
        //{
        //    // 1. מציאת הזמנת טיוטה או יצירת חדשה
        //    var order = await GetDraftOrderByUserAsync(userId) ?? await CreateDraftOrderAsync(userId);

        //    var package = await _context.Packages.FindAsync(packageId);
        //    if (package == null) throw new Exception("Package not found");

        //    // 2. חיפוש אם החבילה כבר קיימת בהזמנה
        //    var orderPackage = await _context.OrdersPackage
        //        .FirstOrDefaultAsync(op => op.OrderId == order.IdOrder && op.IdPackage == packageId);

        //    if (orderPackage != null)
        //    {
        //        // עדכון כמות (מונע ירידה מתחת ל-0)
        //        orderPackage.Quantity += amount;

        //        if (orderPackage.Quantity <= 0)
        //        {
        //            _context.OrdersPackage.Remove(orderPackage);
        //            order.Price -= package.Price * (orderPackage.Quantity - amount); // עדכון מחיר בהסרה
        //        }
        //        else
        //        {
        //            order.Price += package.Price * amount;
        //        }
        //    }
        //    else if (amount > 0)
        //    {
        //        // הוספה חדשה
        //        var newOrderPackage = new OrdersPackage
        //        {
        //            OrderId = order.IdOrder,
        //            IdPackage = packageId,
        //            Quantity = amount,
        //            PriceAtPurchase = package.Price
        //        };
        //        _context.OrdersPackage.Add(newOrderPackage);
        //        order.Price += package.Price * amount;
        //    }

        //    await _context.SaveChangesAsync();
        //}
    }
}