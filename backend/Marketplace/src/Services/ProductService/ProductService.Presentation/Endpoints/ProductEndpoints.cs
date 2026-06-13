using FluentValidation;
using ProductService.Application;
using ProductService.Presentation.Mappers;
using ProductService.Presentation.Models;

namespace ProductService.Presentation.Endpoints;

public static class ProductEndpoints
{
    public static RouteGroupBuilder MapProductEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/products").WithTags("Products");

        group.MapGet("/{id:guid}", async (Guid id, IProductService service) =>
        {
            var product = await service.GetProductAsync(id);
            return product is null ? Results.NotFound() : Results.Ok(product.ToHttp());
        });

        group.MapGet("", async (
            [AsParameters] ProductSearchRequest request,
            IValidator<ProductSearchRequest> validator,
            IProductService service,
            CancellationToken cancellationToken) =>
        {
            var validationResult = await validator.ValidateAsync(request, cancellationToken);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            var products = await service.GetProductsAsync(request.ToDomain());
            return Results.Ok(products.ToHttp());
        });

        group.MapPost("", async (
            ProductRequest request,
            IValidator<ProductRequest> validator,
            IProductService service,
            CancellationToken cancellationToken) =>
        {
            var validationResult = await validator.ValidateAsync(request, cancellationToken);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            var product = request.ToDomain();
            await service.CreateProductAsync(product);

            return Results.Created($"/api/products/{product.Id}", product.ToHttp());
        });

        group.MapPut("/{id:guid}", async (
            Guid id,
            ProductRequest request,
            IValidator<ProductRequest> validator,
            IProductService service,
            CancellationToken cancellationToken) =>
        {
            var existingProduct = await service.GetProductAsync(id);
            if (existingProduct is null)
            {
                return Results.NotFound();
            }

            var validationResult = await validator.ValidateAsync(request, cancellationToken);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            var updatedProduct = existingProduct with
            {
                Sku = request.Sku,
                Name = request.Name,
                Description = request.Description,
                Price = request.Price,
                Category = request.Category,
                ManufacturerCountry = request.ManufacturerCountry,
                Weight = request.Weight,
                Width = request.Width,
                Height = request.Height,
                Length = request.Length,
                ImageUrl = request.ImageUrl,
                UpdatedAt = DateTime.UtcNow
            };

            await service.UpdateAsync(updatedProduct);

            return Results.Ok(updatedProduct.ToHttp());
        });

        group.MapDelete("/{id:guid}", async (Guid id, IProductService service) =>
        {
            var deleted = await service.DeleteAsync(id);
            return deleted ? Results.NoContent() : Results.NotFound();
        });

        return group;
    }
}
