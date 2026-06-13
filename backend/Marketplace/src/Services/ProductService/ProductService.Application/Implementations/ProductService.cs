using ProductService.Domain.Models;
using ProductService.Infrastructure;

namespace ProductService.Application.Implementations;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;

    public ProductService(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }
    
    public async Task<Product?> GetProductAsync(Guid productId)
    {
        return await _productRepository.GetProductAsync(productId);
    }

    public async Task<PagedResult<Product>> GetProductsAsync(ProductSearchQuery query)
    {
        return await _productRepository.GetProductsAsync(query);
    }

    public async Task<Guid> CreateProductAsync(Product product)
    { 
        return await _productRepository.CreateProductAsync(product);
    }

    public async Task<Guid> UpdateAsync(Product product)
    {
        return await _productRepository.UpdateAsync(product);
    }

    public async Task<bool> DeleteAsync(Guid productId)
    {
        return await _productRepository.DeleteAsync(productId);
    }
}
