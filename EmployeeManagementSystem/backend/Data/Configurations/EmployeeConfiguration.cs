using EmployeeManagementSystem.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EmployeeManagementSystem.Data.Configurations;

/// <summary>
/// Fluent configuration for the <see cref="Employee"/> entity.
/// </summary>
public class EmployeeConfiguration : IEntityTypeConfiguration<Employee>
{
    public void Configure(EntityTypeBuilder<Employee> builder)
    {
        builder.ToTable("Employees");

        builder.HasKey(e => e.EmployeeId);

        builder.Property(e => e.FirstName)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(e => e.LastName)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(e => e.Email)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(e => e.Phone)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(e => e.Designation)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(e => e.Salary)
            .IsRequired()
            .HasColumnType("decimal(18,2)");

        builder.Property(e => e.JoiningDate)
            .IsRequired();

        builder.Property(e => e.CreatedAt)
            .HasDefaultValueSql("now() at time zone 'utc'");

        builder.Property(e => e.UpdatedAt);

        // Employee email must be unique.
        builder.HasIndex(e => e.Email).IsUnique();

        // Index on foreign key for performant joins/filtering.
        builder.HasIndex(e => e.DepartmentId);

        // Index on last name to speed up search/sort.
        builder.HasIndex(e => e.LastName);
    }
}
