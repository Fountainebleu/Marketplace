using Orders.Api.Contracts;
using Orders.Api.Domain;

namespace Orders.Api.Services;

public static class OrderMapper
{
    public static OrderResponse ToResponse(this Order order) => new(
        order.Id,
        order.CustomerId,
        order.CustomerName,
        order.Phone,
        order.DeliveryAddress,
        order.Status,
        order.TotalPrice,
        order.CreatedAt,
        order.UpdatedAt,
        order.Items.Select(item => new OrderItemResponse(item.ProductId, item.ProductName, item.UnitPrice, item.Quantity)).ToArray(),
        order.History.Select(history => new OrderStatusHistoryResponse(history.Status, history.Comment, history.ChangedAt)).ToArray());
}
