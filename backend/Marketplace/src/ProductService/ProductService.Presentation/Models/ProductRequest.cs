using ProductService.Domain.Enums;

namespace ProductService.Presentation.Models;

public record ProductRequest(
    string Name,
    string Description,
    decimal Price,
    ProductCategory Category,
    string? ImageUrl);