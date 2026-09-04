using BoilerplateApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BoilerplateApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<SafetyReport> SafetyReports => Set<SafetyReport>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<User>().HasIndex(u => u.Email).IsUnique();
            
            // Seed dummy data
            
        }
    }
}