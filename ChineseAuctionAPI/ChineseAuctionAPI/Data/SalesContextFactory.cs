using ChineseAuctionAPI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design; // חובה להוסיף את זה

// namespace ChineseAuctionAPI.Data // וודא שה-Namespace תואם לפרויקט שלך
// {
//     // הוספנו את הירושה מהממשק IDesignTimeDbContextFactory
//     public class SalesContextFactory : IDesignTimeDbContextFactory<SaleContextDB>
//     {
//         public SaleContextDB CreateDbContext(string[] args)
//         {
//             var optionsBuilder = new DbContextOptionsBuilder<SaleContextDB>();

//             // שימוש במחרוזת החיבור הישירה שמתאימה למחשב שלך
//             optionsBuilder.UseSqlServer("Server=DESKTOP-021APTL\\SQLEXPRESS;Database=3285461_SalesAPI;Integrated Security=True;TrustServerCertificate=True;");

//             return new SaleContextDB(optionsBuilder.Options);
//         }
//     }
// }


namespace StoreAPI.Data
{
    public class SalesContextFactory
    {
        private const string ConnectionString = "Server=DESKTOP-I18T6QA\\SQLEXPRESS;DataBase=0533155961_SalesAPI;Integrated Security=SSPI;Persist Security Info=False;TrustServerCertificate=True;";

        public static SaleContextDB CreateContext()
        {
            var optionsBuilder = new DbContextOptionsBuilder<SaleContextDB>();
            optionsBuilder.UseSqlServer(ConnectionString);
            return new SaleContextDB(optionsBuilder.Options);
        }
    }
}
