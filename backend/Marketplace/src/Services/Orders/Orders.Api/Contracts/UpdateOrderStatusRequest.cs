using Orders.Api.Domain;

namespace Orders.Api.Contracts;

public sealed record UpdateOrderStatusRequest(OrderStatus Status, string? Comment);
