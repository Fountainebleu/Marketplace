namespace Orders.Api.Services;

public interface IProductCatalogClient
{
    Task<IReadOnlyDictionary<Guid, ProductCatalogItem>> GetProductsByIdsAsync(
        IReadOnlyCollection<Guid> productIds,
        CancellationToken cancellationToken);
}

public sealed record ProductCatalogItem(
    Guid Id,
    string Sku,
    string Name,
    decimal Price);
