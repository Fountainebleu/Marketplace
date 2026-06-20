using System.Globalization;
using Grpc.Core;
using Marketplace.Products.Grpc;

namespace Orders.Api.Services;

public sealed class GrpcProductCatalogClient(ProductCatalog.ProductCatalogClient client)
    : IProductCatalogClient
{
    public async Task<IReadOnlyDictionary<Guid, ProductCatalogItem>> GetProductsByIdsAsync(
        IReadOnlyCollection<Guid> productIds,
        CancellationToken cancellationToken)
    {
        var request = new GetProductsByIdsRequest();
        request.ProductIds.AddRange(productIds.Distinct().Select(id => id.ToString()));

        try
        {
            var response = await client.GetProductsByIdsAsync(request, cancellationToken: cancellationToken);

            return response.Products
                .Where(product => product.IsActive && Guid.TryParse(product.Id, out _))
                .ToDictionary(
                    product => Guid.Parse(product.Id),
                    product => new ProductCatalogItem(
                        Guid.Parse(product.Id),
                        product.Sku,
                        product.Name,
                        decimal.Parse(product.Price, CultureInfo.InvariantCulture)));
        }
        catch (RpcException exception) when (exception.StatusCode != StatusCode.Cancelled)
        {
            throw new ProductCatalogUnavailableException("ProductService is unavailable.", exception);
        }
    }
}
