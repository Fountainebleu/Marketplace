using Dapper;
using ProductService.Domain.Enums;
using ProductService.Domain.Models;
using ProductService.Infrastructure.Mappers;
using ProductService.Infrastructure.Helpers;
using ProductService.Infrastructure.Models;

namespace ProductService.Infrastructure.Implementations;

public class ProductRepository(IPostgresConnectionFactory connectionFactory) : IProductRepository
{
    private const string ProductColumns = """
                                          id AS Id,
                                          sku AS Sku,
                                          name AS Name,
                                          description AS Description,
                                          price AS Price,
                                          category AS Category,
                                          manufacturer_country AS ManufacturerCountry,
                                          weight AS Weight,
                                          width AS Width,
                                          height AS Height,
                                          length AS Length,
                                          image_url AS ImageUrl,
                                          is_active AS IsActive,
                                          created_at AS CreatedAt,
                                          updated_at AS UpdatedAt
                                          """;

    public async Task<Product?> GetProductAsync(Guid productId)
    {
        await using var connection = connectionFactory.GetConnection();

        var sql = $"""
                   SELECT {ProductColumns}
                   FROM products
                   WHERE id = @Id AND is_active = TRUE
                   """;
        
        var dao = await connection.QueryFirstOrDefaultAsync<ProductDao>(sql, new { Id = productId });
        return dao?.ToDomain();
    }

    public async Task<IReadOnlyCollection<Product>> GetProductsByIdsAsync(IReadOnlyCollection<Guid> productIds)
    {
        if (productIds.Count == 0)
        {
            return [];
        }

        await using var connection = connectionFactory.GetConnection();

        var sql = $"""
                   SELECT {ProductColumns}
                   FROM products
                   WHERE id = ANY(@Ids)
                     AND is_active = TRUE
                   """;

        var daos = await connection.QueryAsync<ProductDao>(sql, new { Ids = productIds.Distinct().ToArray() });
        return daos.Select(dao => dao.ToDomain()).ToArray();
    }

    public async Task<PagedResult<Product>> GetProductsAsync(ProductSearchQuery query)
    {
        await using var connection = connectionFactory.GetConnection();

        var page = Math.Max(query.Page, 1);
        var pageSize = Math.Clamp(query.PageSize, 1, 100);
        var offset = (page - 1) * pageSize;

        var whereClauses = new List<string> { "is_active = TRUE" };
        var parameters = new DynamicParameters();

        if (!string.IsNullOrWhiteSpace(query.Query))
        {
            whereClauses.Add("(sku ILIKE @Query OR name ILIKE @Query OR description ILIKE @Query)");
            parameters.Add("Query", $"%{query.Query.Trim()}%");
        }

        if (query.Category.HasValue && query.Category.Value != ProductCategory.Undefined)
        {
            whereClauses.Add("category = @Category");
            parameters.Add("Category", (int)query.Category.Value);
        }

        if (query.MinPrice.HasValue)
        {
            whereClauses.Add("price >= @MinPrice");
            parameters.Add("MinPrice", query.MinPrice.Value);
        }

        if (query.MaxPrice.HasValue)
        {
            whereClauses.Add("price <= @MaxPrice");
            parameters.Add("MaxPrice", query.MaxPrice.Value);
        }

        var whereSql = whereClauses.Count > 0
            ? "WHERE " + string.Join(" AND ", whereClauses)
            : string.Empty;

        var orderBy = GetOrderBySql(query.SortBy, query.SortDirection);

        var countSql = $"""
                        SELECT COUNT(*)
                        FROM products
                        {whereSql}
                        """;

        var productsSql = $"""
                           SELECT {ProductColumns}
                           FROM products
                           {whereSql}
                           {orderBy}
                           OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY
                           """;

        parameters.Add("Offset", offset);
        parameters.Add("PageSize", pageSize);

        var totalCount = await connection.ExecuteScalarAsync<long>(countSql, parameters);
        var daos = await connection.QueryAsync<ProductDao>(productsSql, parameters);
        var products = daos.Select(dao => dao.ToDomain()).ToList();

        return new PagedResult<Product>(products, (int)totalCount, page, pageSize);
    }

    public async Task<Guid> CreateProductAsync(Product product)
    {
        await using var connection = connectionFactory.GetConnection();

        var sql = """
                  INSERT INTO products (
                      id,
                      sku,
                      name,
                      description,
                      price,
                      category,
                      manufacturer_country,
                      weight,
                      width,
                      height,
                      length,
                      image_url,
                      is_active,
                      created_at,
                      updated_at)
                  VALUES (
                      @Id,
                      @Sku,
                      @Name,
                      @Description,
                      @Price,
                      @Category,
                      @ManufacturerCountry,
                      @Weight,
                      @Width,
                      @Height,
                      @Length,
                      @ImageUrl,
                      @IsActive,
                      @CreatedAt,
                      @UpdatedAt)
                  RETURNING id
                  """;
        
        return await connection.ExecuteScalarAsync<Guid>(sql, new
        {
            product.Id,
            product.Sku,
            product.Name,
            product.Description,
            product.Price,
            Category = (int)product.Category, 
            product.ManufacturerCountry,
            product.Weight,
            product.Width,
            product.Height,
            product.Length,
            product.ImageUrl,
            product.IsActive,
            product.CreatedAt,
            product.UpdatedAt
        });
    }

    public async Task<Guid> UpdateAsync(Product product)
    {
        await using var connection = connectionFactory.GetConnection();
        
        var sql = """
                  UPDATE products
                  SET sku = @Sku,
                      name = @Name,
                      description = @Description,
                      price = @Price,
                      category = @Category,
                      manufacturer_country = @ManufacturerCountry,
                      weight = @Weight,
                      width = @Width,
                      height = @Height,
                      length = @Length,
                      image_url = @ImageUrl,
                      updated_at = @UpdatedAt
                  WHERE id = @Id
                    AND is_active = TRUE
                  RETURNING id
                  """;
        
        return await connection.ExecuteScalarAsync<Guid>(sql, new
        {
            product.Id,
            product.Sku,
            product.Name,
            product.Description,
            product.Price,
            Category = (int)product.Category,
            product.ManufacturerCountry,
            product.Weight,
            product.Width,
            product.Height,
            product.Length,
            product.ImageUrl,
            product.UpdatedAt
        });
    }

    public async Task<bool> DeleteAsync(Guid productId)
    {
        await using var connection = connectionFactory.GetConnection();

        var sql = """
                  UPDATE products
                  SET is_active = FALSE,
                      updated_at = @UpdatedAt
                  WHERE id = @Id
                    AND is_active = TRUE
                  """;

        var affectedRows = await connection.ExecuteAsync(sql, new
        {
            Id = productId,
            UpdatedAt = DateTime.UtcNow
        });

        return affectedRows > 0;
    }

    private static string GetOrderBySql(ProductSortField sortBy, SortDirection sortDirection)
    {
        var column = sortBy switch
        {
            ProductSortField.Name => "name",
            ProductSortField.Price => "price",
            _ => "created_at"
        };

        var direction = sortDirection == SortDirection.Asc ? "ASC" : "DESC";

        return $"ORDER BY {column} {direction}, id ASC";
    }
}
