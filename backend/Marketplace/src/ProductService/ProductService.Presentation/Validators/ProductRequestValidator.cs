using FluentValidation;
using ProductService.Presentation.Models;

namespace ProductService.Presentation.Validators;

public class ProductRequestValidator : AbstractValidator<ProductRequest>
{
    public ProductRequestValidator()
    {
        
    }
}