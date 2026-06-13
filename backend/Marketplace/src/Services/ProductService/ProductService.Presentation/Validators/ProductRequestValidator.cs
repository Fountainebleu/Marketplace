using FluentValidation;
using ProductService.Presentation.Models;

namespace ProductService.Presentation.Validators;

public class ProductRequestValidator : AbstractValidator<ProductRequest>
{
    public ProductRequestValidator()
    {
        RuleFor(product => product.Sku)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(product => product.Name)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(product => product.Description)
            .NotEmpty()
            .MaximumLength(2000);

        RuleFor(product => product.Price)
            .GreaterThan(0);

        RuleFor(product => product.Category)
            .IsInEnum()
            .NotEqual(Domain.Enums.ProductCategory.Undefined);

        RuleFor(product => product.ManufacturerCountry)
            .MaximumLength(100)
            .When(product => !string.IsNullOrWhiteSpace(product.ManufacturerCountry));

        RuleFor(product => product.Weight)
            .GreaterThan(0);

        RuleFor(product => product.Width)
            .GreaterThan(0);

        RuleFor(product => product.Height)
            .GreaterThan(0);

        RuleFor(product => product.Length)
            .GreaterThan(0);

        RuleFor(product => product.ImageUrl)
            .MaximumLength(2048)
            .Must(BeValidHttpUrl)
            .When(product => !string.IsNullOrWhiteSpace(product.ImageUrl))
            .WithMessage("ImageUrl must be an absolute HTTP or HTTPS URL.");
    }

    private static bool BeValidHttpUrl(string? value)
    {
        return Uri.TryCreate(value, UriKind.Absolute, out var uri)
               && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);
    }
}
