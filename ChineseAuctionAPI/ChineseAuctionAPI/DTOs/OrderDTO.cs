using System.ComponentModel.DataAnnotations;
using ChineseAuctionAPI.Models;

namespace ChineseAuctionAPI.DTOs
{
    public class OrderDTO
    {
        [Required,Range(1,int.MaxValue)]
        public int TotalAmount { get; set; }
        [Required, Range(1, int.MaxValue)]
        public int TotalPrice { get; set; }
        [Required]
        public int IdUser { get; set; }
        [Range(1, 1000)]
        public int Amount { get; set; } = 1;
        public DateTime OrderDate { get; set; }= DateTime.Now;
        public OrderStatus Status { get; set; } = OrderStatus.Draft;
        [MinLength(1)]
        public List<OrdersGiftDTO> OrdersGifts { get; set; } = new();
    }
    public class OrdersGiftDTO
    {
        [Required]
        public string Category { get; set; }
        [Required]
        public string Name { get; set; }
        [Range(1, 1000)]
        public int Amount { get; set; } = 1;
        [Required,Range(1,int.MaxValue)]
        public int Price { get; set; }
        [StringLength(500)]
        public string Description { get; set; }
        public string? Image { get; set; }


    }

}

