namespace Orders.Api.Domain;

public sealed record OrderStatusHistory(
    OrderStatus Status,
    string? Comment,
    DateTimeOffset ChangedAt);
