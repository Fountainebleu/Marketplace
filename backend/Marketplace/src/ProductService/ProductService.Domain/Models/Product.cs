using ProductService.Domain.Enums;

namespace ProductService.Domain.Models;

public record Product(
    Guid Id,
    string Name,
    string Description,
    decimal Price,
    ProductCategory Category,
    string? ImageUrl,
    DateTime CreatedAt,
    DateTime UpdatedAt);