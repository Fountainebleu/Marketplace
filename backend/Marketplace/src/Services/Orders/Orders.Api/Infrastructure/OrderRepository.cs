using Dapper;
using Orders.Api.Domain;

namespace Orders.Api.Infrastructure;

public sealed class OrderRepository(DbConnectionFactory connectionFactory) : IOrderRepository
{
    public async Task<Order> CreateAsync(Order order, CancellationToken cancellationToken)
    {
        using var connection = connectionFactory.Create();
        connection.Open();
        using var transaction = connection.BeginTransaction();

        const string insertOrder = """
            insert into orders (id, customer_id, customer_name, phone, delivery_address, status, total_price, created_at, updated_at)
            values (@Id, @CustomerId, @CustomerName, @Phone, @DeliveryAddress, @Status, @TotalPrice, @CreatedAt, @UpdatedAt);
            """;

        await connection.ExecuteAsync(new CommandDefinition(insertOrder, new
        {
            order.Id,
            order.CustomerId,
            order.CustomerName,
            order.Phone,
            order.DeliveryAddress,
            Status = order.Status.ToString(),
            TotalPrice = order.TotalPrice,
            order.CreatedAt,
            order.UpdatedAt
        }, transaction, cancellationToken: cancellationToken));

        const string insertItem = """
            insert into order_items (id, order_id, product_id, product_name, unit_price, quantity)
            values (@Id, @OrderId, @ProductId, @ProductName, @UnitPrice, @Quantity);
            """;

        foreach (var item in order.Items)
        {
            await connection.ExecuteAsync(new CommandDefinition(insertItem, new
            {
                Id = Guid.NewGuid(),
                OrderId = order.Id,
                item.ProductId,
                item.ProductName,
                item.UnitPrice,
                item.Quantity
            }, transaction, cancellationToken: cancellationToken));
        }

        await InsertHistoryAsync(connection, transaction, order.Id, order.Status, "Order created.", order.CreatedAt, cancellationToken);
        transaction.Commit();

        order.History.Add(new OrderStatusHistory(order.Status, "Order created.", order.CreatedAt));
        return order;
    }

    public async Task<IReadOnlyCollection<Order>> GetPageAsync(int page, int pageSize, OrderStatus? status, CancellationToken cancellationToken)
    {
        using var connection = connectionFactory.Create();
        var offset = (page - 1) * pageSize;

        var sql = """
            select id, customer_id, customer_name, phone, delivery_address, status, total_price, created_at, updated_at
            from orders
            where (@Status is null or status = @Status)
            order by created_at desc
            limit @PageSize offset @Offset;
            """;

        var rows = await connection.QueryAsync<OrderRow>(new CommandDefinition(sql, new
        {
            Status = status?.ToString(),
            PageSize = pageSize,
            Offset = offset
        }, cancellationToken: cancellationToken));

        return rows.Select(row => row.ToOrder()).ToArray();
    }

    public async Task<Order?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        using var connection = connectionFactory.Create();

        const string orderSql = """
            select id, customer_id, customer_name, phone, delivery_address, status, total_price, created_at, updated_at
            from orders
            where id = @Id;
            """;

        var orderRow = await connection.QuerySingleOrDefaultAsync<OrderRow>(
            new CommandDefinition(orderSql, new { Id = id }, cancellationToken: cancellationToken));

        if (orderRow is null)
        {
            return null;
        }

        var order = orderRow.ToOrder();

        const string itemsSql = """
            select product_id, product_name, unit_price, quantity
            from order_items
            where order_id = @Id
            order by product_name;
            """;

        var items = await connection.QueryAsync<OrderItemRow>(
            new CommandDefinition(itemsSql, new { Id = id }, cancellationToken: cancellationToken));

        order.Items.AddRange(items.Select(row => row.ToOrderItem()));

        var history = await GetHistoryAsync(id, cancellationToken);
        order.History.AddRange(history ?? []);

        return order;
    }

    public async Task<bool> ChangeStatusAsync(Guid id, OrderStatus status, string? comment, DateTimeOffset changedAt, CancellationToken cancellationToken)
    {
        using var connection = connectionFactory.Create();
        connection.Open();
        using var transaction = connection.BeginTransaction();

        const string updateOrder = """
            update orders
            set status = @Status,
                updated_at = @UpdatedAt
            where id = @Id;
            """;

        var affectedRows = await connection.ExecuteAsync(new CommandDefinition(updateOrder, new
        {
            Id = id,
            Status = status.ToString(),
            UpdatedAt = changedAt
        }, transaction, cancellationToken: cancellationToken));

        if (affectedRows == 0)
        {
            transaction.Rollback();
            return false;
        }

        await InsertHistoryAsync(connection, transaction, id, status, comment, changedAt, cancellationToken);
        transaction.Commit();
        return true;
    }

    public async Task<IReadOnlyCollection<OrderStatusHistory>?> GetHistoryAsync(Guid orderId, CancellationToken cancellationToken)
    {
        using var connection = connectionFactory.Create();

        const string sql = """
            select status, comment, changed_at
            from order_status_history
            where order_id = @OrderId
            order by changed_at;
            """;

        var rows = await connection.QueryAsync<HistoryRow>(
            new CommandDefinition(sql, new { OrderId = orderId }, cancellationToken: cancellationToken));

        var history = rows.Select(row => row.ToHistory()).ToArray();
        return history.Length == 0 ? null : history;
    }

    private static Task InsertHistoryAsync(
        System.Data.IDbConnection connection,
        System.Data.IDbTransaction transaction,
        Guid orderId,
        OrderStatus status,
        string? comment,
        DateTimeOffset changedAt,
        CancellationToken cancellationToken)
    {
        const string sql = """
            insert into order_status_history (id, order_id, status, comment, changed_at)
            values (@Id, @OrderId, @Status, @Comment, @ChangedAt);
            """;

        return connection.ExecuteAsync(new CommandDefinition(sql, new
        {
            Id = Guid.NewGuid(),
            OrderId = orderId,
            Status = status.ToString(),
            Comment = comment,
            ChangedAt = changedAt
        }, transaction, cancellationToken: cancellationToken));
    }

    private sealed record OrderRow(
        Guid Id,
        Guid Customer_Id,
        string Customer_Name,
        string Phone,
        string Delivery_Address,
        string Status,
        decimal Total_Price,
        DateTimeOffset Created_At,
        DateTimeOffset Updated_At)
    {
        public Order ToOrder() => new()
        {
            Id = Id,
            CustomerId = Customer_Id,
            CustomerName = Customer_Name,
            Phone = Phone,
            DeliveryAddress = Delivery_Address,
            Status = Enum.Parse<OrderStatus>(Status),
            CreatedAt = Created_At,
            UpdatedAt = Updated_At
        };
    }

    private sealed record OrderItemRow(Guid Product_Id, string Product_Name, decimal Unit_Price, int Quantity)
    {
        public OrderItem ToOrderItem() => new(Product_Id, Product_Name, Unit_Price, Quantity);
    }

    private sealed record HistoryRow(string Status, string? Comment, DateTimeOffset Changed_At)
    {
        public OrderStatusHistory ToHistory() => new(Enum.Parse<OrderStatus>(Status), Comment, Changed_At);
    }
}
