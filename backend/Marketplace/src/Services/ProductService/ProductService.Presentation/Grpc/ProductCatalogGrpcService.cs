using System.Globalization;
using Grpc.Core;
using Marketplace.Products.Grpc;
using ProductService.Application;

namespace ProductService.Presentation.Grpc;

public sealed class ProductCatalogGrpcService(IProductService productService)
    : ProductCatalog.ProductCatalogBase
{
    public override async Task<GetProductsByIdsResponse> GetProductsByIds(
        GetProductsByIdsRequest request,
        ServerCallContext context)
    {
        var ids = request.ProductIds
            .Select(value => Guid.TryParse(value, out var id) ? id : (Guid?)null)
            .Where(id => id.HasValue)
            .Select(id => id!.Value)
            .Distinct()
            .ToArray();

        var products = await productService.GetProductsByIdsAsync(ids);
        var response = new GetProductsByIdsResponse();

        response.Products.AddRange(products.Select(product => new ProductSnapshot
        {
            Id = product.Id.ToString(),
            Sku = product.Sku,
            Name = product.Name,
            Price = product.Price.ToString(CultureInfo.InvariantCulture),
            IsActive = product.IsActive
        }));

        return response;
    }
}
