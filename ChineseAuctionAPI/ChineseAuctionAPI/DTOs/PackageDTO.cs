using System.ComponentModel.DataAnnotations;

namespace ChineseAuctionAPI.DTOs
{
    public class PackageDTO
    {
        [Required]
        public int IdPackage { get; set; }
        public int AmountRegular { get; set; }
        public int? AmountPremium { get; set; }
        [Required,Range(0,int.MaxValue)]
        public int Price { get; set; }
        [Required]
        public string Name { get; set; }
        public string? Description { get; set; }
    }

    public class PackageCreateDTO
    {
        [Required]
        public int AmountRegular { get; set; }
        public int? AmountPremium { get; set; }
        [Required, Range(0, int.MaxValue)]
        public int Price { get; set; }
        [Required]
        public string Name { get; set; }
        public string? Description { get; set; }
    }
}