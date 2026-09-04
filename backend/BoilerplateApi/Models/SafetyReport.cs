namespace BoilerplateApi.Models
{
    public class SafetyReport
    {
        public int Id { get; set; }
        public string Title { get; set; } = ""; // e.g., "Broken Streetlight"
        public string Category { get; set; } = ""; // "Road", "Drain", "Tree", "Light"
        public string Location { get; set; } = ""; // "Galle Road, Colombo 3"
        public string Description { get; set; } = "";
        public string Severity { get; set; } = "Medium"; // "Low", "Medium", "High"
        public string Status { get; set; } = "Reported"; // "Reported", "In Progress", "Resolved"
        public DateTime ReportedAt { get; set; } = DateTime.UtcNow;
    }
}