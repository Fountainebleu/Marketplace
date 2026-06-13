using ProductService.Domain.Enums;
using ProductService.Presentation.Models;
using ProductService.Presentation.Validators;

namespace Product.Tests;

public sealed class ProductRequestValidatorTests
{
    [Fact]
    public void Rejects_required_fields_and_invalid_values()
    {
        var request = new ProductRequest(
            string.Empty,
            string.Empty,
            string.Empty,
            0,
            ProductCategory.Undefined,
            new string('x', 101),
            0,
            0,
            0,
            0,
            "not-a-url");

        var result = new ProductRequestValidator().Validate(request);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(ProductRequest.Sku));
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(ProductRequest.Name));
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(ProductRequest.Description));
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(ProductRequest.Price));
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(ProductRequest.Category));
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(ProductRequest.ManufacturerCountry));
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(ProductRequest.Weight));
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(ProductRequest.Width));
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(ProductRequest.Height));
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(ProductRequest.Length));
        Assert.Contains(result.Errors, error => error.PropertyName == nameof(ProductRequest.ImageUrl));
    }

    [Fact]
    public void Accepts_valid_product()
    {
        var request = new ProductRequest(
            "KB-001",
            "Keyboard",
            "Mechanical keyboard",
            4500,
            ProductCategory.Electronics,
            "China",
            0.8m,
            45,
            4,
            15,
            "https://example.com/keyboard.png");

        var result = new ProductRequestValidator().Validate(request);

        Assert.True(result.IsValid);
    }
}
