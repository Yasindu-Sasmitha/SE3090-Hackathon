using System.ComponentModel.DataAnnotations;

namespace BoilerplateApi.Models
{
    public class User
    {
        public int Id { get; set; }
        [Required, MaxLength(80)]
        public string Name { get; set; } = "";
        [Required, EmailAddress]
        public string Email { get; set; } = "";
        public string PasswordHash { get; set; } = "";
        public string Role { get; set; } = "User";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}