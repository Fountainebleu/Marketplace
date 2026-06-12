using Orders.Api.Domain;

namespace Orders.Api.Contracts;

public sealed record OrderResponse(
    Guid Id,
    Guid CustomerId,
    string CustomerName,
    string Phone,
    string DeliveryAddress,
    OrderStatus Status,
    decimal TotalPrice,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt,
    IReadOnlyCollection<OrderItemResponse> Items,
    IReadOnlyCollection<OrderStatusHistoryResponse> History);

public sealed record OrderItemResponse(
    Guid ProductId,
    string ProductName,
    decimal UnitPrice,
    int Quantity);

public sealed record OrderStatusHistoryResponse(
    OrderStatus Status,
    string? Comment,
    DateTimeOffset ChangedAt);
