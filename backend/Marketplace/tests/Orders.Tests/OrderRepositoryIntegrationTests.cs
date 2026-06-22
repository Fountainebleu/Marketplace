using FluentMigrator.Runner;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;
using Orders.Api.Domain;
using Orders.Api.Infrastructure;
using Testcontainers.PostgreSql;

namespace Orders.Tests;

public sealed class OrdersPostgreSqlFixture : IAsyncLifetime
{
    public PostgreSqlContainer Container { get; } = new PostgreSqlBuilder("postgres:16-alpine")
        .WithDatabase("orders_tests")
        .WithUsername("postgres")
        .WithPassword("postgres")
        .Build();

    public OrderRepository Repository { get; private set; } = null!;

    public async Task InitializeAsync()
    {
        await Container.StartAsync();
        RunMigrations(Container.GetConnectionString());

        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:OrdersDb"] = Container.GetConnectionString()
            })
            .Build();

        Repository = new OrderRepository(new DbConnectionFactory(configuration));
    }

    public Task DisposeAsync() => Container.DisposeAsync().AsTask();

    private static void RunMigrations(string connectionString)
    {
        using var services = new ServiceCollection()
            .AddFluentMigratorCore()
            .ConfigureRunner(runner => runner
                .AddPostgres()
                .WithGlobalConnectionString(connectionString)
                .ScanIn(typeof(CreateOrdersTablesMigration).Assembly).For.Migrations())
            .AddLogging()
            .BuildServiceProvider();

        using var scope = services.CreateScope();
        scope.ServiceProvider.GetRequiredService<IMigrationRunner>().MigrateUp();
    }
}

public sealed class OrderRepositoryIntegrationTests(OrdersPostgreSqlFixture database)
    : IClassFixture<OrdersPostgreSqlFixture>
{
    private OrderRepository Repository => database.Repository;

    [Fact]
    public async Task Migrations_create_all_order_tables()
    {
        await using var connection = new NpgsqlConnection(database.Container.GetConnectionString());
        await connection.OpenAsync();
        await using var command = new NpgsqlCommand(
            """
            select count(*)
            from information_schema.tables
            where table_schema = 'public'
              and table_name in ('orders', 'order_items', 'order_status_history');
            """,
            connection);

        var result = (long)(await command.ExecuteScalarAsync() ?? 0L);

        Assert.Equal(3, result);
    }

    [Fact]
    public async Task Repository_returns_items_total_and_history_in_order_page()
    {
        var order = CreateOrder();
        await Repository.CreateAsync(order, CancellationToken.None);

        var page = await Repository.GetPageAsync(
            page: 1,
            pageSize: 20,
            status: OrderStatus.Created,
            CancellationToken.None);

        var loaded = Assert.Single(page);
        var item = Assert.Single(loaded.Items);
        var history = Assert.Single(loaded.History);

        Assert.Equal(order.Id, loaded.Id);
        Assert.Equal("Integration keyboard", item.ProductName);
        Assert.Equal(11998, loaded.TotalPrice);
        Assert.Equal(OrderStatus.Created, history.Status);
    }

    [Fact]
    public async Task Repository_persists_status_change_and_history()
    {
        var order = CreateOrder();
        await Repository.CreateAsync(order, CancellationToken.None);
        var changedAt = DateTimeOffset.UtcNow.AddMinutes(1);

        var changed = await Repository.ChangeStatusAsync(
            order.Id,
            OrderStatus.Paid,
            "Payment received.",
            changedAt,
            CancellationToken.None);

        var loaded = await Repository.GetByIdAsync(order.Id, CancellationToken.None);

        Assert.True(changed);
        Assert.NotNull(loaded);
        Assert.Equal(OrderStatus.Paid, loaded.Status);
        Assert.Equal(2, loaded.History.Count);
        Assert.Contains(
            loaded.History,
            entry => entry.Status == OrderStatus.Paid && entry.Comment == "Payment received.");
    }

    private static Order CreateOrder()
    {
        var now = DateTimeOffset.UtcNow;
        var order = new Order
        {
            Id = Guid.NewGuid(),
            CustomerId = Guid.NewGuid(),
            CustomerName = "Integration User",
            Phone = "+79990000000",
            DeliveryAddress = "Ekaterinburg",
            Status = OrderStatus.Created,
            CreatedAt = now,
            UpdatedAt = now
        };

        order.Items.Add(new OrderItem(
            Guid.NewGuid(),
            "Integration keyboard",
            5999,
            2));

        return order;
    }

}
