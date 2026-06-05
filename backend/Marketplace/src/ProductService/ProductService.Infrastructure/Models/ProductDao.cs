using ProductService.Domain.Enums;

namespace ProductService.Infrastructure.Models;

public record ProductDao(
    Guid Id,
    string Name,
    string Description,
    decimal Price,
    ProductCategory Category,
    string? ImageUrl,
    DateTime CreatedAt,
    DateTime UpdatedAt);