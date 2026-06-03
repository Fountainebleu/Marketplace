using Marketplace.Domain.Models;
using Marketplace.Infrastructure.Models;

namespace Marketplace.Infrastructure.Mappers;

public static class ProductDaoExtensions
{
    public static Product ToDomain(this ProductDao dao) => new Product(
        dao.Id,
        dao.Name,
        dao.Description,
        dao.Price,
        dao.Category,
        dao.ImageUrl,
        dao.CreatedAt,
        dao.UpdatedAt
    );
}