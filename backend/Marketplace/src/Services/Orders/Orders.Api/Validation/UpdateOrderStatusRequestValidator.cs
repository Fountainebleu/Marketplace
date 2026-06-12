using FluentValidation;
using Orders.Api.Contracts;
using Orders.Api.Domain;

namespace Orders.Api.Validation;

public sealed class UpdateOrderStatusRequestValidator : AbstractValidator<UpdateOrderStatusRequest>
{
    public UpdateOrderStatusRequestValidator()
    {
        RuleFor(request => request.Status).IsInEnum().NotEqual(OrderStatus.Created);
        RuleFor(request => request.Comment).MaximumLength(1000);
    }
}
