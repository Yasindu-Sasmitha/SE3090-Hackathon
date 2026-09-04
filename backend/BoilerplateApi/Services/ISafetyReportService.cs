using BoilerplateApi.Dtos;

namespace BoilerplateApi.Services
{
    public interface ISafetyReportService
    {
        Task<IEnumerable<SafetyReportDto>> GetAllAsync();
        Task<SafetyReportDto?> GetByIdAsync(int id);
        Task<SafetyReportDto> CreateAsync(CreateSafetyReportDto dto);
        Task<bool> UpdateStatusAsync(int id, UpdateStatusDto dto);
        Task<bool> DeleteAsync(int id);
    }
}