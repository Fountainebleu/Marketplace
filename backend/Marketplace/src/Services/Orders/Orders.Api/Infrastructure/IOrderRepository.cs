using Orders.Api.Domain;

namespace Orders.Api.Infrastructure;

public interface IOrderRepository
{
    Task<Order> CreateAsync(Order order, CancellationToken cancellationToken);
    Task<IReadOnlyCollection<Order>> GetPageAsync(int page, int pageSize, OrderStatus? status, CancellationToken cancellationToken);
    Task<Order?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<bool> ChangeStatusAsync(Guid id, OrderStatus status, string? comment, DateTimeOffset changedAt, CancellationToken cancellationToken);
    Task<IReadOnlyCollection<OrderStatusHistory>?> GetHistoryAsync(Guid orderId, CancellationToken cancellationToken);
}
