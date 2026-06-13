using Npgsql;
using ProductService.Domain.Enums;
using ProductService.Domain.Models;
using ProductService.Infrastructure.Helpers;
using ProductService.Infrastructure.Implementations;
using ProductService.Infrastructure.Migrations;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using ProductModel = ProductService.Domain.Models.Product;

namespace Product.Tests;

public sealed class ProductRepositoryIntegrationTests
{
    [Fact]
    public async Task RunMigrations_creates_products_table_when_database_is_available()
    {
        var connectionString = GetConnectionString();
        if (connectionString is null)
        {
            return;
        }

        using var host = CreateHost(connectionString);
        host.RunMigrations();

        await using var connection = new NpgsqlConnection(connectionString);
        await connection.OpenAsync();
        await using var command = new NpgsqlCommand(
            "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'products'",
            connection);

        var result = (long)(await command.ExecuteScalarAsync() ?? 0L);
        Assert.Equal(1, result);
    }

    [Fact]
    public async Task Repository_filters_products_by_sku_query_category_price_and_paging_when_database_is_available()
    {
        var connectionString = GetConnectionString();
        if (connectionString is null)
        {
            return;
        }

        using var host = CreateHost(connectionString);
        host.RunMigrations();

        var repository = new ProductRepository(new PostgresConnectionFactory(connectionString));
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

    private static string? GetConnectionString()
    {
        return Environment.GetEnvironmentVariable("PRODUCTS_TEST_CONNECTION_STRING");
    }

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

    private static ProductModel CreateProduct(string name, ProductCategory category, decimal price)
    {
        var now = DateTime.UtcNow;

        return new ProductModel(
            Guid.NewGuid(),
            $"{name}-sku"[..Math.Min($"{name}-sku".Length, 100)],
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
