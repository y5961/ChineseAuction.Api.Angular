using ChineseAuctionAPI.DTOs;
using ChineseAuctionAPI.Repositories;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using ChineseAuctionAPI.Models;

namespace ChineseAuctionAPI.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepo _OrderRepository;
        private readonly ILogger<OrderService> _logger;
        private readonly IConfiguration _config;

        public OrderService(IOrderRepo OrderRepository, IConfiguration config, ILogger<OrderService> logger)
        {
            _OrderRepository = OrderRepository;
            _logger = logger;
            _config = config;
        }
       
        public async Task<bool> AddOrUpdateGiftInOrderAsync(int userId, int giftId, int amount)
        {
            try
            {
                _logger.LogInformation("מעדכן/מוסיף מתנה {GiftId} להזמנה {OrderId} בכמות {Amount}.", giftId, userId, amount);
                await _OrderRepository.AddOrUpdateGiftInOrderAsync(userId, giftId, amount);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "שגיאה בעת עדכון מתנה {GiftId} בהזמנה {OrderId}.", giftId, userId);
                throw;
            }
        }

        public async Task<bool> CompleteOrder(int orderId)
        {
            try
            {
                _logger.LogInformation("מנסה לסגור (Complete) הזמנה שמספרה {OrderId}.", orderId);
                await _OrderRepository.CompleteOrder(orderId);
                _logger.LogInformation("הזמנה {OrderId} נסגרה בהצלחה.", orderId);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "נכשלה סגירת הזמנה {OrderId}.", orderId);
                throw;
            }
        }

        public async Task<bool> DeleteAsync(int orderId, int giftId, int amount)
        {
            try
            {
                _logger.LogInformation("מוחק {Amount} יחידות של מתנה {GiftId} מהזמנה {OrderId}.", amount, giftId, orderId);
                var result = await _OrderRepository.DeleteAsync(orderId, giftId, amount);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "שגיאה במחיקת מתנה מהזמנה {OrderId}.", orderId);
                throw;
            }
        }

        public async Task<IEnumerable<OrderDTO>> GetAllAsync(int userId)
        {
            try
            {
                _logger.LogInformation("שולף את כל ההזמנות עבור משתמש {UserId}.", userId);
                var orders = await _OrderRepository.GetAllOrder(userId);

                var ordersDto = orders.Select(o => new OrderDTO
                {
                    
                    IdUser = o.IdUser,
                    OrderDate = o.OrderDate,
                    Status = o.Status,
                    Amount = o.OrdersGift.Sum(og => og.Amount),
                    TotalPrice = o.OrdersGift.Sum(go => go.Gift.Price),
                    TotalAmount=o.OrdersGift.Sum(go=>go.Amount),
                    OrdersGifts = o.OrdersGift.Select(og => new OrdersGiftDTO
                    {
                        Category=og.Gift.Category.Name,
                        Name = og.Gift.Name ?? "",
                        Amount = og.Amount,
                        Price = og.Gift.Price,
                        Description = og.Gift.Description,
                        Image = og.Gift.Image
                    })?.ToList(),
                   
                })?.ToList();

                return ordersDto;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "שגיאה בשליפת הזמנות למשתמש {UserId}.", userId);
                throw;
            }
        }

        public async Task<OrderDTO?> GetByIdWithGiftsAsync(int orderId)
        {
            try
            {
                _logger.LogInformation("שולף פרטי הזמנה {OrderId} כולל פירוט מתנות.", orderId);
                var order = await _OrderRepository.GetByIdWithGiftsAsync(orderId);

                if (order == null)
                {
                    _logger.LogWarning("הזמנה {OrderId} לא נמצאה.", orderId);
                    return null;
                }

                return new OrderDTO
                {
                    OrderDate = order.OrderDate,
                    Status = order.Status,
                    OrdersGifts = order.OrdersGift.Select(og => new OrdersGiftDTO
                    {
                        Name = og.Gift.Name,
                        Description = og.Gift.Description,
                        Category = og.Gift.Category.Name,
                        Amount = og.Amount,
                        Price = og.Gift.Price,
                        Image = og.Gift.Image
                    }).ToList(),
                    TotalAmount = order.OrdersGift.Sum(og => og.Amount),
                    TotalPrice = order.OrdersGift.Sum(og => og.Amount * og.Gift.Price)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "שגיאה בשליפת הזמנה {OrderId} עם מתנות.", orderId);
                throw;
            }
        }

        public async Task<OrderDTO?> GetDraftOrderByUserAsync(int userId)
        {
            try
            {
                _logger.LogInformation("מחפש הזמנה במצב טיוטה (Draft) עבור משתמש {UserId}.", userId);
                var order = await _OrderRepository.GetDraftOrderByUserAsync(userId);

                if (order == null) return null;

                return new OrderDTO
                {
                    IdUser = order.IdUser,
                    OrderDate = order.OrderDate,
                    Status = order.Status,
                    OrdersGifts = order.OrdersGift.Select(og => new OrdersGiftDTO
                    {
                        Name = og.Gift.Name,
                        Amount = og.Amount,
                        Price = og.Gift.Price,
                        Description = og.Gift.Description,
                        Image = og.Gift.Image
                    }).ToList()
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "שגיאה בשליפת טיוטת הזמנה למשתמש {UserId}.", userId);
                throw;
            }
        }
        // בתוך מחלקת OrderService
        public async Task<bool> UpdatePackageQuantityAsync(int userId, int packageId, int amount)
        {
            try
            {
                _logger.LogInformation("Updating package {PackageId} for user {UserId} with amount {Amount}", packageId, userId, amount);
                await _OrderRepository.AddOrUpdatePackageInOrderAsync(userId, packageId, amount);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating package in order");
                return false;
            }
        }
    }
}