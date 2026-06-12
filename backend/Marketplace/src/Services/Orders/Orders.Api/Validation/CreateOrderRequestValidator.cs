using FluentValidation;
using Orders.Api.Contracts;

namespace Orders.Api.Validation;

public sealed class CreateOrderRequestValidator : AbstractValidator<CreateOrderRequest>
{
    public CreateOrderRequestValidator()
    {
        RuleFor(request => request.CustomerId).NotEmpty();
        RuleFor(request => request.CustomerName).NotEmpty().MaximumLength(200);
        RuleFor(request => request.Phone).NotEmpty().MaximumLength(32);
        RuleFor(request => request.DeliveryAddress).NotEmpty().MaximumLength(500);
        RuleFor(request => request.Items).NotEmpty();
        RuleForEach(request => request.Items).SetValidator(new CreateOrderItemRequestValidator());
    }
}

public sealed class CreateOrderItemRequestValidator : AbstractValidator<CreateOrderItemRequest>
{
    public CreateOrderItemRequestValidator()
    {
        RuleFor(item => item.ProductId).NotEmpty();
        RuleFor(item => item.ProductName).NotEmpty().MaximumLength(300);
        RuleFor(item => item.UnitPrice).GreaterThan(0);
        RuleFor(item => item.Quantity).GreaterThan(0);
    }
}
