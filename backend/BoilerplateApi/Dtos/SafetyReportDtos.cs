using System.ComponentModel.DataAnnotations;

namespace BoilerplateApi.Dtos
{
    public record CreateSafetyReportDto(
        [Required, StringLength(100)] string Title,
        [Required, StringLength(50)] string Category,
        [Required, StringLength(100)] string Location,
        [StringLength(500)] string Description,
        [Required] string Severity // Low, Medium, High
    );

    public record UpdateStatusDto(
        [Required] string Status // Reported, In Progress, Resolved
    );

    public record SafetyReportDto(
        int Id, 
        string Title, 
        string Category, 
        string Location, 
        string Description, 
        string Severity, 
        string Status, 
        DateTime ReportedAt
        
    );
}
