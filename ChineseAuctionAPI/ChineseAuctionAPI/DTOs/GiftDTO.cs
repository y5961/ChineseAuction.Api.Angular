using System.ComponentModel.DataAnnotations;

namespace ChineseAuctionAPI.DTOs
{
    public class GiftDTO
    {
        [Required]
        public string Name { get; set; }
        [StringLength(500)]
        public string? Description { get; set; }
        [Required]
        public int CategoryId { get; set; }
        [Required, Range(1, 500)]
        public int Quantity { get; set; }

        public string? Image { get; set; }
        [Required]
        public int IdDonor { get; set; }
        [Required, Range(1, 1000)]
        public int Price { get; set; }
    }
    public class GiftNewDTO
    {
        public int IdGift { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Price { get; set; }
        public int NumOfBuyers { get; set; }
    }
    public class GiftUpdateDto
    {
        public int UserId { get; set; }
        public int GiftId { get; set; }
        public int Amount { get; set; }
    }
}
