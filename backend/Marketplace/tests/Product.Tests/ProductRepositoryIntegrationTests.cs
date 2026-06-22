using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Npgsql;
using ProductService.Domain.Enums;
using ProductService.Domain.Models;
using ProductService.Infrastructure.Helpers;
using ProductService.Infrastructure.Implementations;
using ProductService.Infrastructure.Migrations;
using Testcontainers.PostgreSql;
using ProductModel = ProductService.Domain.Models.Product;

namespace Product.Tests;

public sealed class ProductPostgreSqlFixture : IAsyncLifetime
{
    public PostgreSqlContainer Container { get; } = new PostgreSqlBuilder("postgres:16-alpine")
        .WithDatabase("products_tests")
        .WithUsername("postgres")
        .WithPassword("postgres")
        .Build();

    public async Task InitializeAsync()
    {
        await Container.StartAsync();

        using var host = CreateHost(Container.GetConnectionString());
        host.RunMigrations();
    }

    public Task DisposeAsync() => Container.DisposeAsync().AsTask();

    private static IHost CreateHost(string connectionString)
    {
        return Host.CreateDefaultBuilder()
            .ConfigureAppConfiguration(configuration =>
            {
                configuration.AddInMemoryCollection(new Dictionary<string, string?>
                {
                    ["ConnectionStrings:ProductsDb"] = connectionString
                });
            })
            .Build();
    }
}

public sealed class ProductRepositoryIntegrationTests(ProductPostgreSqlFixture database)
    : IClassFixture<ProductPostgreSqlFixture>
{
    private string ConnectionString => database.Container.GetConnectionString();

    [Fact]
    public async Task Migrations_create_products_table()
    {
        await using var connection = new NpgsqlConnection(ConnectionString);
        await connection.OpenAsync();
        await using var command = new NpgsqlCommand(
            "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'products'",
            connection);

        var result = (long)(await command.ExecuteScalarAsync() ?? 0L);

        Assert.Equal(1, result);
    }

    [Fact]
    public async Task Repository_filters_products_by_sku_query_category_price_and_paging()
    {
        var repository = new ProductRepository(
            new PostgresConnectionFactory(ConnectionString));
        var marker = $"integration-{Guid.NewGuid():N}";
        var target = CreateProduct($"{marker}-target", ProductCategory.Electronics, 150);
        var otherCategory = CreateProduct($"{marker}-other-category", ProductCategory.Books, 150);
        var otherPrice = CreateProduct($"{marker}-other-price", ProductCategory.Electronics, 500);

        await repository.CreateProductAsync(target);
        await repository.CreateProductAsync(otherCategory);
        await repository.CreateProductAsync(otherPrice);

        var result = await repository.GetProductsAsync(new ProductSearchQuery(
            Query: target.Sku,
            Category: ProductCategory.Electronics,
            MinPrice: 100,
            MaxPrice: 200,
            Page: 1,
            PageSize: 10,
            SortBy: ProductSortField.Name,
            SortDirection: SortDirection.Asc));

        Assert.Equal(1, result.TotalCount);
        Assert.Single(result.Items);
        Assert.Equal(target.Id, result.Items[0].Id);
    }

    [Fact]
    public async Task Repository_creates_updates_and_soft_deletes_product()
    {
        var repository = new ProductRepository(
            new PostgresConnectionFactory(ConnectionString));
        var product = CreateProduct($"crud-{Guid.NewGuid():N}", ProductCategory.General, 100);

        await repository.CreateProductAsync(product);
        var created = await repository.GetProductAsync(product.Id);

        Assert.NotNull(created);
        Assert.Equal(product.Name, created.Name);

        var updated = product with
        {
            Name = $"{product.Name}-updated",
            Price = 250,
            UpdatedAt = DateTime.UtcNow
        };

        await repository.UpdateAsync(updated);
        var loadedUpdated = await repository.GetProductAsync(product.Id);

        Assert.NotNull(loadedUpdated);
        Assert.Equal(updated.Name, loadedUpdated.Name);
        Assert.Equal(250, loadedUpdated.Price);

        Assert.True(await repository.DeleteAsync(product.Id));
        Assert.Null(await repository.GetProductAsync(product.Id));
    }

    private static ProductModel CreateProduct(string name, ProductCategory category, decimal price)
    {
        var now = DateTime.UtcNow;
        var sku = $"{name}-sku";

        return new ProductModel(
            Guid.NewGuid(),
            sku[..Math.Min(sku.Length, 100)],
            name,
            $"{name} description",
            price,
            category,
            "China",
            1.5m,
            10,
            20,
            30,
            null,
            true,
            now,
            now);
    }
}
