using System.Data;
using Npgsql;

namespace Orders.Api.Infrastructure;

public sealed class DbConnectionFactory(IConfiguration configuration)
{
    public IDbConnection Create()
    {
        var connectionString = configuration.GetConnectionString("OrdersDb")
            ?? throw new InvalidOperationException("Connection string 'OrdersDb' is not configured.");

        return new NpgsqlConnection(connectionString);
    }
}
