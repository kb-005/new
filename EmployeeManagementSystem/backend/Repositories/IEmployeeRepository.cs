using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Models;

namespace EmployeeManagementSystem.Repositories;

public interface IEmployeeRepository : IRepository<Employee>
{
    Task<PagedResult<Employee>> GetPagedAsync(
        int page,
        int pageSize,
        string? search,
        int? departmentId,
        string? sortBy,
        bool sortDescending,
        CancellationToken cancellationToken = default);

    Task<bool> ExistsByEmailAsync(string email, int? excludeEmployeeId = null, CancellationToken cancellationToken = default);
    Task<Employee?> GetByIdWithDepartmentAsync(int id, CancellationToken cancellationToken = default);
}

public class EmployeeRepository : Repository<Employee>, IEmployeeRepository
{
    public EmployeeRepository(ApplicationDbContext dbContext) : base(dbContext) { }

    public async Task<PagedResult<Employee>> GetPagedAsync(
        int page,
        int pageSize,
        string? search,
        int? departmentId,
        string? sortBy,
        bool sortDescending,
        CancellationToken cancellationToken = default)
    {
        var query = DbSet.AsNoTracking().Include(e => e.Department).AsQueryable();

        if (departmentId.HasValue)
            query = query.Where(e => e.DepartmentId == departmentId.Value);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(e =>
                e.FirstName.ToLower().Contains(term) ||
                e.LastName.ToLower().Contains(term) ||
                e.Email.ToLower().Contains(term) ||
                e.Designation.ToLower().Contains(term) ||
                (e.Department != null && e.Department.DepartmentName.ToLower().Contains(term)));
        }

        query = sortBy?.ToLower() switch
        {
            "firstname" => sortDescending ? query.OrderByDescending(e => e.FirstName) : query.OrderBy(e => e.FirstName),
            "lastname" => sortDescending ? query.OrderByDescending(e => e.LastName) : query.OrderBy(e => e.LastName),
            "email" => sortDescending ? query.OrderByDescending(e => e.Email) : query.OrderBy(e => e.Email),
            "department" => sortDescending ? query.OrderByDescending(e => e.Department!.DepartmentName) : query.OrderBy(e => e.Department!.DepartmentName),
            "designation" => sortDescending ? query.OrderByDescending(e => e.Designation) : query.OrderBy(e => e.Designation),
            "salary" => sortDescending ? query.OrderByDescending(e => e.Salary) : query.OrderBy(e => e.Salary),
            "joiningdate" => sortDescending ? query.OrderByDescending(e => e.JoiningDate) : query.OrderBy(e => e.JoiningDate),
            _ => sortDescending ? query.OrderByDescending(e => e.EmployeeId) : query.OrderBy(e => e.EmployeeId)
        };

        var totalItems = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<Employee>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalItems = totalItems
        };
    }

    public async Task<bool> ExistsByEmailAsync(string email, int? excludeEmployeeId = null, CancellationToken cancellationToken = default)
    {
        var normalized = email.Trim().ToLower();
        return await DbSet.AsNoTracking()
            .AnyAsync(e =>
                e.Email.ToLower() == normalized &&
                (!excludeEmployeeId.HasValue || e.EmployeeId != excludeEmployeeId.Value),
                cancellationToken);
    }

    public async Task<Employee?> GetByIdWithDepartmentAsync(int id, CancellationToken cancellationToken = default)
        => await DbSet.AsNoTracking()
            .Include(e => e.Department)
            .FirstOrDefaultAsync(e => e.EmployeeId == id, cancellationToken);
}
