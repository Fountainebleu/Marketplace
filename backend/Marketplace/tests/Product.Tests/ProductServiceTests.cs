using ProductService.Application;
using ProductService.Domain.Enums;
using ProductService.Domain.Models;
using ProductService.Infrastructure;
using ProductApplicationService = ProductService.Application.Implementations.ProductService;
using ProductModel = ProductService.Domain.Models.Product;

namespace Product.Tests;

public sealed class ProductServiceTests
{
    [Fact]
    public async Task GetProductAsync_returns_repository_product()
    {
        var productId = Guid.NewGuid();
        var product = CreateProduct(productId, "Keyboard", ProductCategory.Electronics);
        var repository = new FakeProductRepository { Product = product };
        IProductService service = new ProductApplicationService(repository);

        var result = await service.GetProductAsync(productId);

        Assert.Equal(product, result);
        Assert.Equal(productId, repository.RequestedProductId);
    }

    [Fact]
    public async Task GetProductsAsync_returns_repository_page()
    {
        var query = new ProductSearchQuery(Query: "phone", Page: 2, PageSize: 10);
        var page = new PagedResult<ProductModel>(
            [CreateProduct(Guid.NewGuid(), "Phone", ProductCategory.Electronics)],
            1,
            2,
            10);
        var repository = new FakeProductRepository { Page = page };
        IProductService service = new ProductApplicationService(repository);

        var result = await service.GetProductsAsync(query);

        Assert.Equal(page, result);
        Assert.Equal(query, repository.RequestedSearchQuery);
    }

    [Fact]
    public async Task CreateProductAsync_passes_product_to_repository()
    {
        var product = CreateProduct(Guid.NewGuid(), "Book", ProductCategory.Books);
        var repository = new FakeProductRepository { CreatedProductId = product.Id };
        IProductService service = new ProductApplicationService(repository);

        var result = await service.CreateProductAsync(product);

        Assert.Equal(product.Id, result);
        Assert.Equal(product, repository.CreatedProduct);
    }

    [Fact]
    public async Task DeleteAsync_passes_product_id_to_repository()
    {
        var productId = Guid.NewGuid();
        var repository = new FakeProductRepository { DeleteResult = true };
        IProductService service = new ProductApplicationService(repository);

        var result = await service.DeleteAsync(productId);

        Assert.True(result);
        Assert.Equal(productId, repository.DeletedProductId);
    }

    private static ProductModel CreateProduct(Guid id, string name, ProductCategory category)
    {
        return new ProductModel(
            id,
            $"{name.ToUpperInvariant()}-{id:N}"[..20],
            name,
            $"{name} description",
            100,
            category,
            "China",
            1.5m,
            10,
            20,
            30,
            null,
            true,
            DateTime.UtcNow,
            DateTime.UtcNow);
    }

    private sealed class FakeProductRepository : IProductRepository
    {
        public ProductModel? Product { get; init; }

        public PagedResult<ProductModel>? Page { get; init; }

        public Guid CreatedProductId { get; init; }

        public Guid? RequestedProductId { get; private set; }

        public ProductSearchQuery? RequestedSearchQuery { get; private set; }

        public ProductModel? CreatedProduct { get; private set; }

        public ProductModel? UpdatedProduct { get; private set; }

        public bool DeleteResult { get; init; }

        public Guid? DeletedProductId { get; private set; }

        public Task<ProductModel?> GetProductAsync(Guid productId)
        {
            RequestedProductId = productId;
            return Task.FromResult(Product);
        }

        public Task<PagedResult<ProductModel>> GetProductsAsync(ProductSearchQuery query)
        {
            RequestedSearchQuery = query;
            return Task.FromResult(Page ?? new PagedResult<ProductModel>([], 0, query.Page, query.PageSize));
        }

        public Task<Guid> CreateProductAsync(ProductModel product)
        {
            CreatedProduct = product;
            return Task.FromResult(CreatedProductId);
        }

        public Task<Guid> UpdateAsync(ProductModel product)
        {
            UpdatedProduct = product;
            return Task.FromResult(product.Id);
        }

        public Task<bool> DeleteAsync(Guid productId)
        {
            DeletedProductId = productId;
            return Task.FromResult(DeleteResult);
        }
    }
}
