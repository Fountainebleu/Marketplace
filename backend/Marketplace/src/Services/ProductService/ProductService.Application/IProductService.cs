using ProductService.Domain.Models;

namespace ProductService.Application;

public interface IProductService
{
    Task<Product?> GetProductAsync(Guid productId);

    Task<IReadOnlyCollection<Product>> GetProductsByIdsAsync(IReadOnlyCollection<Guid> productIds);

    Task<PagedResult<Product>> GetProductsAsync(ProductSearchQuery query);
    
    Task<Guid> CreateProductAsync(Product product);
    
    Task<Guid> UpdateAsync(Product product);

    Task<bool> DeleteAsync(Guid productId);
}
