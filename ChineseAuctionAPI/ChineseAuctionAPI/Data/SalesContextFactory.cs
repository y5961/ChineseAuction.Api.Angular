using ChineseAuctionAPI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design; // חובה להוסיף את זה

namespace ChineseAuctionAPI.Data // וודא שה-Namespace תואם לפרויקט שלך
{
    // הוספנו את הירושה מהממשק IDesignTimeDbContextFactory
    public class SalesContextFactory : IDesignTimeDbContextFactory<SaleContextDB>
    {
        public SaleContextDB CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<SaleContextDB>();

            // שימוש במחרוזת החיבור הישירה שמתאימה למחשב שלך
            optionsBuilder.UseSqlServer("Server=DESKTOP-021APTL\\SQLEXPRESS;Database=3285461_SalesAPI;Integrated Security=True;TrustServerCertificate=True;");

            return new SaleContextDB(optionsBuilder.Options);
        }
    }
}