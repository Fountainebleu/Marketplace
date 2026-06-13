namespace Orders.Api.Domain;

public sealed class Order
{
    public required Guid Id { get; init; }
    public required Guid CustomerId { get; init; }
    public required string CustomerName { get; init; }
    public required string Phone { get; init; }
    public required string DeliveryAddress { get; init; }
    public required OrderStatus Status { get; set; }
    public required DateTimeOffset CreatedAt { get; init; }
    public required DateTimeOffset UpdatedAt { get; set; }
    public List<OrderItem> Items { get; } = [];
    public List<OrderStatusHistory> History { get; } = [];

    public decimal TotalPrice => Items.Sum(item => item.UnitPrice * item.Quantity);
}
