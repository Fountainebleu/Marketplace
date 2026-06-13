using FluentMigrator;

namespace ProductService.Infrastructure.Migrations;

[Migration(20260613000100, "Add products search indexes")]
public class AddProductsSearchIndexesMigration : Migration
{
    public override void Up()
    {
        Create.Index("ix_products_category")
            .OnTable("products")
            .OnColumn("category").Ascending();

        Create.Index("ix_products_price")
            .OnTable("products")
            .OnColumn("price").Ascending();

        Create.Index("ix_products_created_at")
            .OnTable("products")
            .OnColumn("created_at").Descending();

        Create.Index("ix_products_name")
            .OnTable("products")
            .OnColumn("name").Ascending();

    }

    public override void Down()
    {
        Delete.Index("ix_products_name").OnTable("products");
        Delete.Index("ix_products_created_at").OnTable("products");
        Delete.Index("ix_products_price").OnTable("products");
        Delete.Index("ix_products_category").OnTable("products");
    }
}
