using Azure.Core;
using global::ChineseAuctionAPI.DTOs;
using global::ChineseAuctionAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ChineseAuctionAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly ILogger<OrdersController> _logger;

        public OrdersController(IOrderService orderService, ILogger<OrdersController> logger)
        {
            _orderService = orderService;
            _logger = logger;
        }

        
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<OrderDTO>>> GetAll(int userId)
        {
            try
            {
                _logger.LogInformation("Fetching all orders for user ID: {UserId}", userId);
                var orders = await _orderService.GetAllAsync(userId);
                return Ok(orders);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching orders for user ID: {UserId}", userId);
                return StatusCode(500, "Internal server error");
            }
        }

      
        [HttpGet("{orderId}")]
        public async Task<ActionResult<OrderDTO>> GetById(int orderId)
        {
            try
            {
                _logger.LogInformation("Fetching order details for order ID: {OrderId}", orderId);
                var order = await _orderService.GetByIdWithGiftsAsync(orderId);
                if (order == null)
                {
                    _logger.LogWarning("Order ID: {OrderId} not found", orderId);
                    return NotFound();
                }
                return Ok(order);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching order ID: {OrderId}", orderId);
                return StatusCode(500, "Internal server error");
            }
        }

       
        [HttpGet("draft/{userId}")]
        public async Task<ActionResult<OrderDTO>> GetDraft(int userId)
        {
            try
            {
                _logger.LogInformation("Fetching draft order for user ID: {UserId}", userId);
                var draft = await _orderService.GetDraftOrderByUserAsync(userId);
                if (draft == null)
                {
                    _logger.LogWarning("No draft order found for user ID: {UserId}", userId);
                    return NotFound();
                }
                return Ok(draft);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching draft order for user ID: {UserId}", userId);
                return StatusCode(500, "Internal server error");
            }
        }

     
        [HttpPost("add-gift")]
        public async Task<ActionResult> AddOrUpdateGift([FromQuery] int userId, [FromQuery] int giftId, [FromQuery] int amount)
        {
            try
            {
                var result = await _orderService.AddOrUpdateGiftInOrderAsync(userId, giftId, amount);
                if (result) return Ok("הסל עודכן בהצלחה.");
                return BadRequest("שגיאה בעדכון הסל.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
