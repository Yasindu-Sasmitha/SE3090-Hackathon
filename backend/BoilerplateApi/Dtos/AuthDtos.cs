using System.ComponentModel.DataAnnotations;

namespace BoilerplateApi.Dtos
{
    public record RegisterDto(
        [Required, StringLength(80)] string Name,
        [Required, EmailAddress] string Email,
        [Required, MinLength(6)] string Password
    );

    public record LoginDto(
        [Required, EmailAddress] string Email,
        [Required] string Password
    );

    public record UserDto(int Id, string Name, string Email, string Role);
}