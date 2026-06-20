using Orders.Api.Contracts;
using Orders.Api.Domain;
using Orders.Api.Infrastructure;

namespace Orders.Api.Services;

public sealed class OrderService(
    IOrderRepository repository,
    IProductCatalogClient productCatalogClient,
    TimeProvider timeProvider)
{
    private static readonly IReadOnlyDictionary<OrderStatus, OrderStatus[]> AllowedTransitions =
        new Dictionary<OrderStatus, OrderStatus[]>
        {
            [OrderStatus.Created] = [OrderStatus.Paid, OrderStatus.Canceled],
            [OrderStatus.Paid] = [OrderStatus.Assembling, OrderStatus.Canceled],
            [OrderStatus.Assembling] = [OrderStatus.HandedToDelivery, OrderStatus.Canceled],
            [OrderStatus.HandedToDelivery] = [OrderStatus.Delivered, OrderStatus.Canceled],
            [OrderStatus.Delivered] = [],
            [OrderStatus.Canceled] = []
        };

    public async Task<OrderResponse> CreateAsync(CreateOrderRequest request, CancellationToken cancellationToken)
    {
        var productIds = request.Items.Select(item => item.ProductId).Distinct().ToArray();
        var products = await productCatalogClient.GetProductsByIdsAsync(productIds, cancellationToken);
        var missingProductIds = productIds.Where(id => !products.ContainsKey(id)).ToArray();

        if (missingProductIds.Length > 0)
        {
            throw new ProductsNotAvailableException(missingProductIds);
        }

        var now = timeProvider.GetUtcNow();
        var order = new Order
        {
            Id = Guid.NewGuid(),
            CustomerId = request.CustomerId,
            CustomerName = request.CustomerName.Trim(),
            Phone = request.Phone.Trim(),
            DeliveryAddress = request.DeliveryAddress.Trim(),
            Status = OrderStatus.Created,
            CreatedAt = now,
            UpdatedAt = now
        };

        order.Items.AddRange(request.Items.Select(item =>
        {
            var product = products[item.ProductId];
            return new OrderItem(item.ProductId, product.Name, product.Price, item.Quantity);
        }));

        var created = await repository.CreateAsync(order, cancellationToken);
        return created.ToResponse();
    }

    public async Task<IReadOnlyCollection<OrderResponse>> GetPageAsync(int page, int pageSize, string? status, CancellationToken cancellationToken)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var statusFilter = Enum.TryParse<OrderStatus>(status, ignoreCase: true, out var parsedStatus)
            ? parsedStatus
            : (OrderStatus?)null;

        var orders = await repository.GetPageAsync(page, pageSize, statusFilter, cancellationToken);
        return orders.Select(order => order.ToResponse()).ToArray();
    }

    public async Task<OrderResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var order = await repository.GetByIdAsync(id, cancellationToken);
        return order?.ToResponse();
    }

    public async Task<ChangeStatusResult> ChangeStatusAsync(Guid id, UpdateOrderStatusRequest request, CancellationToken cancellationToken)
    {
        var order = await repository.GetByIdAsync(id, cancellationToken);
        if (order is null)
        {
            return ChangeStatusResult.Failure(ChangeStatusError.NotFound);
        }

        if (!AllowedTransitions[order.Status].Contains(request.Status))
        {
            return ChangeStatusResult.Failure(ChangeStatusError.InvalidTransition);
        }

        var changedAt = timeProvider.GetUtcNow();
        var updated = await repository.ChangeStatusAsync(id, request.Status, request.Comment, changedAt, cancellationToken);
        if (!updated)
        {
            return ChangeStatusResult.Failure(ChangeStatusError.NotFound);
        }

        order.Status = request.Status;
        order.UpdatedAt = changedAt;
        order.History.Add(new OrderStatusHistory(request.Status, request.Comment, changedAt));

        return ChangeStatusResult.Success(order.ToResponse());
    }

    public async Task<IReadOnlyCollection<OrderStatusHistoryResponse>?> GetHistoryAsync(Guid id, CancellationToken cancellationToken)
    {
        var history = await repository.GetHistoryAsync(id, cancellationToken);
        return history?.Select(item => new OrderStatusHistoryResponse(item.Status, item.Comment, item.ChangedAt)).ToArray();
    }
}
