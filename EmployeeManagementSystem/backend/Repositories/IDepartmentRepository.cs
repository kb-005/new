using EmployeeManagementSystem.Models;

namespace EmployeeManagementSystem.Repositories;

public interface IDepartmentRepository : IRepository<Department>
{
    Task<bool> ExistsByNameAsync(string name, int? excludeDepartmentId = null, CancellationToken cancellationToken = default);
    Task<int> GetEmployeeCountAsync(int departmentId, CancellationToken cancellationToken = default);
    Task<bool> HasEmployeesAsync(int departmentId, CancellationToken cancellationToken = default);
}

public class DepartmentRepository : Repository<Department>, IDepartmentRepository
{
    public DepartmentRepository(Data.ApplicationDbContext dbContext) : base(dbContext) { }

    public async Task<bool> ExistsByNameAsync(string name, int? excludeDepartmentId = null, CancellationToken cancellationToken = default)
    {
        var normalized = name.Trim().ToLower();
        return await DbSet.AsNoTracking()
            .AnyAsync(d =>
                d.DepartmentName.ToLower() == normalized &&
                (!excludeDepartmentId.HasValue || d.DepartmentId != excludeDepartmentId.Value),
                cancellationToken);
    }

    public async Task<int> GetEmployeeCountAsync(int departmentId, CancellationToken cancellationToken = default)
        => await DbContext.Employees
            .AsNoTracking()
            .CountAsync(e => e.DepartmentId == departmentId, cancellationToken);

    public async Task<bool> HasEmployeesAsync(int departmentId, CancellationToken cancellationToken = default)
        => await DbContext.Employees
            .AsNoTracking()
            .AnyAsync(e => e.DepartmentId == departmentId, cancellationToken);
}
