namespace Orders.Api.Domain;

public sealed record OrderItem(
    Guid ProductId,
    string ProductName,
    decimal UnitPrice,
    int Quantity);
