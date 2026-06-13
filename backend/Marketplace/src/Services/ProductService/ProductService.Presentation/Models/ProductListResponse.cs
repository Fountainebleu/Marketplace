namespace ProductService.Presentation.Models;

public record ProductListResponse(
    IReadOnlyList<ProductResponse> Items,
    int TotalCount,
    int Page,
    int PageSize);
