using ProductService.Domain.Models;
using ProductService.Infrastructure.Models;

namespace ProductService.Infrastructure.Mappers;

public static class ProductDaoExtensions
{
    public static Product ToDomain(this ProductDao dao) => new Product(
        dao.Id,
        dao.Sku,
        dao.Name,
        dao.Description,
        dao.Price,
        dao.Category,
        dao.ManufacturerCountry,
        dao.Weight,
        dao.Width,
        dao.Height,
        dao.Length,
        dao.ImageUrl,
        dao.IsActive,
        dao.CreatedAt,
        dao.UpdatedAt
    );
}
