namespace Orders.Api.Services;

public sealed class ProductsNotAvailableException(IReadOnlyCollection<Guid> productIds)
    : Exception($"Products are unavailable: {string.Join(", ", productIds)}")
{
    public IReadOnlyCollection<Guid> ProductIds { get; } = productIds;
}

public sealed class ProductCatalogUnavailableException(string message, Exception innerException)
    : Exception(message, innerException);
