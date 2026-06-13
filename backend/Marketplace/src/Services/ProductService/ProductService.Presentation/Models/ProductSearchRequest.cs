using ProductService.Domain.Enums;
using ProductService.Domain.Models;

namespace ProductService.Presentation.Models;

public class ProductSearchRequest
{
    public string? Query { get; set; }

    public ProductCategory? Category { get; set; }

    public decimal? MinPrice { get; set; }

    public decimal? MaxPrice { get; set; }

    public int Page { get; set; } = 1;

    public int PageSize { get; set; } = 20;

    public ProductSortField SortBy { get; set; } = ProductSortField.CreatedAt;

    public SortDirection SortDirection { get; set; } = SortDirection.Desc;

    public ProductSearchQuery ToDomain() => new(
        Query,
        Category,
        MinPrice,
        MaxPrice,
        Page,
        PageSize,
        SortBy,
        SortDirection);
}
