using Marketplace.Domain.Enums;

namespace Marketplace.Domain.Models;

public record ProductSearchQuery(
    string? Query = null,
    ProductCategory? Category = null,
    decimal? MinPrice = null,
    decimal? MaxPrice = null,
    int Page = 1,
    int PageSize = 20,
    ProductSortField SortBy = ProductSortField.CreatedAt,
    SortDirection SortDirection = SortDirection.Desc);
