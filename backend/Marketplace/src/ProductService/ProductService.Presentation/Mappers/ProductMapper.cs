using ProductService.Domain.Models;
using ProductService.Presentation.Models;

namespace ProductService.Presentation.Mappers;

public static class ProductMapper
{
    public static Product ToDomain(this ProductRequest productRequest)
    {
        return new Product(
            Guid.NewGuid(),
            productRequest.Name,
            productRequest.Description,
            productRequest.Price,
            productRequest.Category,
            productRequest.ImageUrl,
            DateTime.Now,
            DateTime.Now);
    }

    public static ProductResponse ToHttp(this Product product)
    {
        return new ProductResponse(
            product.Name,
            product.Description,
            product.Price,
            product.Category,
            product.ImageUrl);
    }
}