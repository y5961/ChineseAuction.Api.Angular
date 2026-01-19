using ChineseAuctionAPI.DTOs;
using ChineseAuctionAPI.Models;
using ChineseAuctionAPI.Repositories;
using Microsoft.Extensions.Logging;

namespace ChineseAuctionAPI.Services
{
    public class GiftCategoryService : IGiftCategoryService
    {
        private readonly IGiftCategoryRepo _repository;
        private readonly ILogger<GiftCategoryService> _logger;
        private readonly IConfiguration _configuration;


        public GiftCategoryService(IGiftCategoryRepo repository, ILogger<GiftCategoryService> logger, IConfiguration configuration)
        {
            _repository = repository;
            _logger = logger;
            _configuration = configuration;
        }

        public async Task<List<GiftCategoryDTO>> GetAllAsync()
        {
            try
            {
                _logger.LogInformation("מתחיל תהליך שליפת כל קטגוריות המתנות מהשירות.");
                var categories = await _repository.GetAllAsync();

                _logger.LogInformation("נשלפו בהצלחה {Count} קטגוריות.", categories.Count());

                return categories.Select(c => new GiftCategoryDTO
                {
                    Id = c.IdGiftCategory,
                    Name = c.Name
                }).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "אירעה שגיאה בלתי צפויה בעת ניסיון לשלוף את כל הקטגוריות.");
                throw;
            }
        }

        public async Task<GiftCategoryDTO?> GetByIdAsync(int id)
        {
            try
            {
                _logger.LogInformation("מנסה לשלוף קטגוריית מתנה עם מזהה: {Id}", id);
                var category = await _repository.GetByIdAsync(id);

                if (category == null)
                {
                    _logger.LogWarning("קטגוריית מתנה עם מזהה {Id} לא נמצאה במערכת.", id);
                    return null;
                }

                _logger.LogInformation("קטגוריה {Id} נשלפה בהצלחה.", id);

                return new GiftCategoryDTO
                {
                    Id = category.IdGiftCategory,
                    Name = category.Name
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "שגיאה בשירות בעת שליפת קטגוריה עם מזהה {Id}.", id);
                throw;
            }
        }

        public async Task<GiftCategoryDTO> CreateAsync(CreateGiftCategoryDTO dto)
        {
            try
            {
                _logger.LogInformation("מתחיל יצירת קטגוריה חדשה בשם: {Name}", dto.Name);

                var category = new GiftCategory
                {
                    Name = dto.Name
                };

                await _repository.CreateAsync(category);
                _logger.LogInformation("קטגוריה חדשה נוצרה בהצלחה עם מזהה: {Id}", category.IdGiftCategory);

                return new GiftCategoryDTO
                {
                    Id = category.IdGiftCategory,
                    Name = category.Name
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "נכשלה יצירת קטגוריה חדשה בשם {Name}.", dto.Name);
                throw;
            }
        }

        public async Task<bool> UpdateAsync(int id, UpdateGiftCategoryDTO dto)
        {
            try
            {
                _logger.LogInformation("מעדכן קטגוריה מזהה {Id}.", id);

                var category = await _repository.GetByIdAsync(id);
                if (category == null)
                {
                    _logger.LogWarning("ניסיון לעדכן קטגוריה שלא קיימת במערכת: {Id}.", id);
                    return false;
                }

                category.Name = dto.Name;
                await _repository.UpdateAsync(category);

                _logger.LogInformation("קטגוריה {Id} עודכנה בהצלחה לערך: {Name}.", id, dto.Name);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "שגיאה בעת עדכון קטגוריה {Id}.", id);
                throw;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                _logger.LogInformation("מבקש למחוק קטגוריה מזהה {Id}.", id);

                var category = await _repository.GetByIdAsync(id);
                if (category == null)
                {
                    _logger.LogWarning("ניסיון למחוק קטגוריה שלא קיימת: {Id}.", id);
                    return false;
                }

                await _repository.DeleteAsync(category);
                _logger.LogInformation("קטגוריה {Id} נמחקה מהמערכת בהצלחה.", id);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "שגיאה בעת ניסיון למחוק קטגוריה {Id}.", id);
                throw;
            }
        }
    }
}