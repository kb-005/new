using EmployeeManagementSystem.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EmployeeManagementSystem.Data.Configurations;

/// <summary>
/// Fluent configuration for the <see cref="Department"/> entity.
/// </summary>
public class DepartmentConfiguration : IEntityTypeConfiguration<Department>
{
    public void Configure(EntityTypeBuilder<Department> builder)
    {
        builder.ToTable("Departments");

        builder.HasKey(d => d.DepartmentId);

        builder.Property(d => d.DepartmentName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(d => d.Description)
            .HasMaxLength(500);

        builder.Property(d => d.CreatedAt)
            .HasDefaultValueSql("now() at time zone 'utc'");

        // Department name must be unique.
        builder.HasIndex(d => d.DepartmentName).IsUnique();

        // Relationship: Department (1) --- (M) Employee, with referential integrity.
        builder.HasMany(d => d.Employees)
            .WithOne(e => e.Department!)
            .HasForeignKey(e => e.DepartmentId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
