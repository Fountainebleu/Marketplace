namespace Orders.Api.Domain;

public enum OrderStatus
{
    Created = 0,
    Paid = 1,
    Assembling = 2,
    HandedToDelivery = 3,
    Delivered = 4,
    Canceled = 5
}
