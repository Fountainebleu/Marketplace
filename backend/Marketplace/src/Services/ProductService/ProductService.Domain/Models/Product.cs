using ProductService.Domain.Enums;

namespace ProductService.Domain.Models;

public record Product(
    Guid Id,
    string Sku,
    string Name,
    string Description,
    decimal Price,
    ProductCategory Category,
    string? ManufacturerCountry,
    decimal Weight,
    decimal Width,
    decimal Height,
    decimal Length,
    string? ImageUrl,
    bool IsActive,
    DateTime CreatedAt,
    DateTime UpdatedAt);
