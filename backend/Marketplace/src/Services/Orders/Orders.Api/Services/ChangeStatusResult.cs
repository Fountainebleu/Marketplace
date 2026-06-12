using Orders.Api.Contracts;

namespace Orders.Api.Services;

public sealed class ChangeStatusResult
{
    private ChangeStatusResult(OrderResponse? order, ChangeStatusError? error)
    {
        Order = order;
        Error = error;
    }

    public OrderResponse? Order { get; }
    public ChangeStatusError? Error { get; }

    public static ChangeStatusResult Success(OrderResponse order) => new(order, null);
    public static ChangeStatusResult Failure(ChangeStatusError error) => new(null, error);

    public IResult Match(Func<OrderResponse, IResult> onSuccess, Func<ChangeStatusError, IResult> onFailure)
    {
        return Order is not null ? onSuccess(Order) : onFailure(Error!.Value);
    }
}
