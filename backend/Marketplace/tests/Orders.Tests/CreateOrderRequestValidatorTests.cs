using Orders.Api.Contracts;
using Orders.Api.Validation;

namespace Orders.Tests;

public sealed class CreateOrderRequestValidatorTests
{
    [Fact]
    public void Validates_required_order_items()
    {
        var request = new CreateOrderRequest(
            Guid.NewGuid(),
            "Ivan",
            "+79990000000",
            "Ekaterinburg",
            []);

        var result = new CreateOrderRequestValidator().Validate(request);

        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, error => error.PropertyName == "Items");
    }

    [Fact]
    public void Accepts_valid_order()
    {
        var request = new CreateOrderRequest(
            Guid.NewGuid(),
            "Ivan",
            "+79990000000",
            "Ekaterinburg",
            [new CreateOrderItemRequest(Guid.NewGuid(), 2)]);

        var result = new CreateOrderRequestValidator().Validate(request);

        Assert.True(result.IsValid);
    }
}
