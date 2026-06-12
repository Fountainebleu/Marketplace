namespace Orders.Api.Contracts;

public sealed record CreateOrderRequest(
    Guid CustomerId,
    string CustomerName,
    string Phone,
    string DeliveryAddress,
    IReadOnlyCollection<CreateOrderItemRequest> Items);

public sealed record CreateOrderItemRequest(
    Guid ProductId,
    string ProductName,
    decimal UnitPrice,
    int Quantity);
