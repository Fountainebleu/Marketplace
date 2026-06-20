using FluentValidation;
using Orders.Api.Contracts;
using Orders.Api.Services;

namespace Orders.Api.Endpoints;

public static class OrdersEndpoints
{
    public static RouteGroupBuilder MapOrdersEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/orders").WithTags("Orders");

        group.MapPost("/", async (
            CreateOrderRequest request,
            IValidator<CreateOrderRequest> validator,
            OrderService service,
            CancellationToken cancellationToken) =>
        {
            var validationResult = await validator.ValidateAsync(request, cancellationToken);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            try
            {
                var order = await service.CreateAsync(request, cancellationToken);
                return Results.Created($"/api/orders/{order.Id}", order);
            }
            catch (ProductsNotAvailableException exception)
            {
                return Results.BadRequest(new
                {
                    message = "One or more products do not exist or are inactive.",
                    productIds = exception.ProductIds
                });
            }
            catch (ProductCatalogUnavailableException)
            {
                return Results.Problem(
                    statusCode: StatusCodes.Status503ServiceUnavailable,
                    title: "Product catalog is unavailable.");
            }
        });

        group.MapGet("/", async (
            OrderService service,
            int page = 1,
            int pageSize = 20,
            string? status = null,
            CancellationToken cancellationToken = default) =>
        {
            var orders = await service.GetPageAsync(page, pageSize, status, cancellationToken);
            return Results.Ok(orders);
        });

        group.MapGet("/{id:guid}", async (
            Guid id,
            OrderService service,
            CancellationToken cancellationToken) =>
        {
            var order = await service.GetByIdAsync(id, cancellationToken);
            return order is null ? Results.NotFound() : Results.Ok(order);
        });

        group.MapPatch("/{id:guid}/status", async (
            Guid id,
            UpdateOrderStatusRequest request,
            IValidator<UpdateOrderStatusRequest> validator,
            OrderService service,
            CancellationToken cancellationToken) =>
        {
            var validationResult = await validator.ValidateAsync(request, cancellationToken);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            var result = await service.ChangeStatusAsync(id, request, cancellationToken);
            return result.Match(
                order => Results.Ok(order),
                error => error == ChangeStatusError.NotFound
                    ? Results.NotFound()
                    : Results.BadRequest(new { message = "Invalid order status transition." }));
        });

        group.MapGet("/{id:guid}/history", async (
            Guid id,
            OrderService service,
            CancellationToken cancellationToken) =>
        {
            var history = await service.GetHistoryAsync(id, cancellationToken);
            return history is null ? Results.NotFound() : Results.Ok(history);
        });

        return group;
    }
}
