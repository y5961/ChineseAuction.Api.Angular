using ChineseAuctionAPI.Services;
using Microsoft.AspNetCore.Mvc;
using static ChineseAuctionAPI.Controllers.PackagesController;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost("update-package")]
    public async Task<ActionResult> UpdatePackageQuantity([FromBody] PackageUpdateDto dto)
    {
        try
        {
            // כאן ה-Service צריך לקבל את הכמות הסופית החדשה או הפרש (תלוי במימוש שלך)
            var result = await _orderService.UpdatePackageQuantityAsync(dto.UserId, dto.PackageId, dto.Quantity);
            if (result) return Ok(true);
            return BadRequest("שגיאה בעדכון כמות החבילה");
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }
}

