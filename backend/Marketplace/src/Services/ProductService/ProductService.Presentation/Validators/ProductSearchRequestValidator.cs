using FluentValidation;
using ProductService.Domain.Enums;
using ProductService.Presentation.Models;

namespace ProductService.Presentation.Validators;

public class ProductSearchRequestValidator : AbstractValidator<ProductSearchRequest>
{
    public ProductSearchRequestValidator()
    {
        RuleFor(query => query.Page)
            .GreaterThanOrEqualTo(1);

        RuleFor(query => query.PageSize)
            .InclusiveBetween(1, 100);

        RuleFor(query => query.Category)
            .IsInEnum()
            .NotEqual(ProductCategory.Undefined)
            .When(query => query.Category.HasValue);

        RuleFor(query => query.SortBy)
            .IsInEnum()
            .When(query => query.SortBy.HasValue);

        RuleFor(query => query.SortDirection)
            .IsInEnum()
            .When(query => query.SortDirection.HasValue);

        RuleFor(query => query.MinPrice)
            .GreaterThanOrEqualTo(0)
            .When(query => query.MinPrice.HasValue);

        RuleFor(query => query.MaxPrice)
            .GreaterThanOrEqualTo(0)
            .When(query => query.MaxPrice.HasValue);

        RuleFor(query => query)
            .Must(query => !query.MinPrice.HasValue
                           || !query.MaxPrice.HasValue
                           || query.MinPrice <= query.MaxPrice)
            .WithMessage("MinPrice must be less than or equal to MaxPrice.");
    }
}
