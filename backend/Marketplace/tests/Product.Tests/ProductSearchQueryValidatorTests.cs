using ProductService.Presentation.Models;
using ProductService.Presentation.Validators;

namespace Product.Tests;

public sealed class ProductSearchQueryValidatorTests
{
    [Fact]
    public void Rejects_invalid_paging_and_price_range()
    {
        var request = new ProductSearchRequest
        {
            Page = 0,
            PageSize = 101,
            MinPrice = 500,
            MaxPrice = 100
        };

        var result = new ProductSearchRequestValidator().Validate(request);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(ProductSearchRequest.Page));
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(ProductSearchRequest.PageSize));
        Assert.Contains(result.Errors, error => error.ErrorMessage == "MinPrice must be less than or equal to MaxPrice.");
    }

    [Fact]
    public void Accepts_default_search_request()
    {
        var result = new ProductSearchRequestValidator().Validate(new ProductSearchRequest());

        Assert.True(result.IsValid);
    }
}
