using BoilerplateApi.Data;
using BoilerplateApi.Dtos;
using BoilerplateApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BoilerplateApi.Services
{
    public class SafetyReportService : ISafetyReportService
    {
        private readonly AppDbContext _db;
        public SafetyReportService(AppDbContext db) => _db = db;

        public async Task<IEnumerable<SafetyReportDto>> GetAllAsync()
        {
            return await _db.SafetyReports
                .OrderByDescending(r => r.ReportedAt)
                .Select(r => new SafetyReportDto(r.Id, r.Title, r.Category, r.Location, r.Description, r.Severity, r.Status, r.ReportedAt))
                .ToListAsync();
        }

        public async Task<SafetyReportDto?> GetByIdAsync(int id)
        {
            var r = await _db.SafetyReports.FindAsync(id);
            return r == null ? null : new SafetyReportDto(r.Id, r.Title, r.Category, r.Location, r.Description, r.Severity, r.Status, r.ReportedAt);
        }

        public async Task<SafetyReportDto> CreateAsync(CreateSafetyReportDto dto)
        {
            var report = new SafetyReport
            {
                Title = dto.Title,
                Category = dto.Category,
                Location = dto.Location,
                Description = dto.Description ?? "",
                Severity = dto.Severity,
                Status = "Reported"
            };
            _db.SafetyReports.Add(report);
            await _db.SaveChangesAsync();
            return new SafetyReportDto(report.Id, report.Title, report.Category, report.Location, report.Description, report.Severity, report.Status, report.ReportedAt);
        }

        public async Task<bool> UpdateStatusAsync(int id, UpdateStatusDto dto)
        {
            var r = await _db.SafetyReports.FindAsync(id);
            if (r == null) return false;
            r.Status = dto.Status;
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var r = await _db.SafetyReports.FindAsync(id);
            if (r == null) return false;
            _db.SafetyReports.Remove(r);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}