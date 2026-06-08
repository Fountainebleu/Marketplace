using ProductService.Domain.Enums;

namespace ProductService.Presentation.Models;

public record ProductResponse(
    string Name,
    string Description,
    decimal Price,
    ProductCategory Category,
    string? ImageUrl);