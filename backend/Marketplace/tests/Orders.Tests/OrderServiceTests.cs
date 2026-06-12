using Orders.Api.Contracts;
using Orders.Api.Domain;
using Orders.Api.Infrastructure;
using Orders.Api.Services;

namespace Orders.Tests;

public sealed class OrderServiceTests
{
    [Fact]
    public async Task ChangeStatusAsync_allows_created_to_paid()
    {
        var repository = new FakeOrderRepository(OrderStatus.Created);
        var service = new OrderService(repository, TimeProvider.System);

        var result = await service.ChangeStatusAsync(
            repository.OrderId,
            new UpdateOrderStatusRequest(OrderStatus.Paid, "Payment received."),
            CancellationToken.None);

        Assert.NotNull(result.Order);
        Assert.Equal(OrderStatus.Paid, result.Order.Status);
        Assert.Equal(OrderStatus.Paid, repository.CurrentStatus);
    }

    [Fact]
    public async Task ChangeStatusAsync_rejects_created_to_delivered()
    {
        var repository = new FakeOrderRepository(OrderStatus.Created);
        var service = new OrderService(repository, TimeProvider.System);

        var result = await service.ChangeStatusAsync(
            repository.OrderId,
            new UpdateOrderStatusRequest(OrderStatus.Delivered, null),
            CancellationToken.None);

        Assert.Equal(ChangeStatusError.InvalidTransition, result.Error);
        Assert.Equal(OrderStatus.Created, repository.CurrentStatus);
    }

    private sealed class FakeOrderRepository : IOrderRepository
    {
        public FakeOrderRepository(OrderStatus status)
        {
            CurrentStatus = status;
        }

        public Guid OrderId { get; } = Guid.NewGuid();
        public OrderStatus CurrentStatus { get; private set; }

        public Task<Order> CreateAsync(Order order, CancellationToken cancellationToken) => Task.FromResult(order);

        public Task<IReadOnlyCollection<Order>> GetPageAsync(int page, int pageSize, OrderStatus? status, CancellationToken cancellationToken) =>
            Task.FromResult<IReadOnlyCollection<Order>>([]);

        public Task<Order?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            if (id != OrderId)
            {
                return Task.FromResult<Order?>(null);
            }

            var order = new Order
            {
                Id = OrderId,
                CustomerId = Guid.NewGuid(),
                CustomerName = "Ivan",
                Phone = "+79990000000",
                DeliveryAddress = "Ekaterinburg",
                Status = CurrentStatus,
                CreatedAt = DateTimeOffset.UtcNow,
                UpdatedAt = DateTimeOffset.UtcNow
            };

            order.Items.Add(new OrderItem(Guid.NewGuid(), "Keyboard", 4500, 1));
            order.History.Add(new OrderStatusHistory(CurrentStatus, null, DateTimeOffset.UtcNow));
            return Task.FromResult<Order?>(order);
        }

        public Task<bool> ChangeStatusAsync(Guid id, OrderStatus status, string? comment, DateTimeOffset changedAt, CancellationToken cancellationToken)
        {
            if (id != OrderId)
            {
                return Task.FromResult(false);
            }

            CurrentStatus = status;
            return Task.FromResult(true);
        }

        public Task<IReadOnlyCollection<OrderStatusHistory>?> GetHistoryAsync(Guid orderId, CancellationToken cancellationToken) =>
            Task.FromResult<IReadOnlyCollection<OrderStatusHistory>?>([]);
    }
}
