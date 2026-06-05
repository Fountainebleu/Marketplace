using ProductService.Domain.Models;

namespace ProductService.Infrastructure;

public interface IProductRepository
{
    Task<Product?> GetProductAsync(Guid productId);

    Task<PagedResult<Product>> GetProductsAsync(ProductSearchQuery query);
    
    Task<Guid> CreateProductAsync(Product product);
    
    Task<Guid> UpdateAsync(Product product);
}
