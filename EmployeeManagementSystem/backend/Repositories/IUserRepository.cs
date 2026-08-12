using EmployeeManagementSystem.Models;

namespace EmployeeManagementSystem.Repositories;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByIdentifierAsync(string identifier, CancellationToken cancellationToken = default);
    Task<bool> ExistsByUsernameOrEmailAsync(string username, string email, int? excludeUserId = null, CancellationToken cancellationToken = default);
}

public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(Data.ApplicationDbContext dbContext) : base(dbContext) { }

    public async Task<User?> GetByIdentifierAsync(string identifier, CancellationToken cancellationToken = default)
    {
        var term = identifier.Trim().ToLower();
        return await DbSet.AsNoTracking()
            .FirstOrDefaultAsync(u =>
                u.Username.ToLower() == term || u.Email.ToLower() == term,
                cancellationToken);
    }

    public async Task<bool> ExistsByUsernameOrEmailAsync(string username, string email, int? excludeUserId = null, CancellationToken cancellationToken = default)
    {
        var u = username.Trim().ToLower();
        var e = email.Trim().ToLower();
        return await DbSet.AsNoTracking()
            .AnyAsync(x =>
                (x.Username.ToLower() == u || x.Email.ToLower() == e) &&
                (!excludeUserId.HasValue || x.UserId != excludeUserId.Value),
                cancellationToken);
    }
}
