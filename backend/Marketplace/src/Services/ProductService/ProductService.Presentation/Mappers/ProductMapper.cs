using ProductService.Domain.Models;
using ProductService.Presentation.Models;

namespace ProductService.Presentation.Mappers;

public static class ProductMapper
{
    public static Product ToDomain(this ProductRequest productRequest)
    {
        var now = DateTime.UtcNow;

        return new Product(
            Guid.NewGuid(),
            productRequest.Sku,
            productRequest.Name,
            productRequest.Description,
            productRequest.Price,
            productRequest.Category,
            productRequest.ManufacturerCountry,
            productRequest.Weight,
            productRequest.Width,
            productRequest.Height,
            productRequest.Length,
            productRequest.ImageUrl,
            true,
            now,
            now);
    }

    public static ProductResponse ToHttp(this Product product)
    {
        return new ProductResponse(
            product.Id,
            product.Sku,
            product.Name,
            product.Description,
            product.Price,
            product.Category,
            product.ManufacturerCountry,
            product.Weight,
            product.Width,
            product.Height,
            product.Length,
            product.ImageUrl,
            product.IsActive,
            product.CreatedAt,
            product.UpdatedAt);
    }

    public static ProductListResponse ToHttp(this PagedResult<Product> products)
    {
        return new ProductListResponse(
            products.Items.Select(product => product.ToHttp()).ToList(),
            products.TotalCount,
            products.Page,
            products.PageSize);
    }
}
