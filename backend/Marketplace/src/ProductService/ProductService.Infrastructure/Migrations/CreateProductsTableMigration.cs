using FluentMigrator;

namespace ProductService.Infrastructure.Migrations;

[Migration(20260414881337, "Create Products Table")]
public class CreateProductsTableMigration : Migration
{
    public override void Up()
    {
        Create.Table("products")
            .WithColumn("id").AsGuid().NotNullable().PrimaryKey()
            .WithColumn("name").AsString().NotNullable()
            .WithColumn("description").AsString().NotNullable()
            .WithColumn("price").AsDecimal().NotNullable()
            .WithColumn("category").AsInt32().NotNullable()
            .WithColumn("image_url").AsString().Nullable()
            .WithColumn("created_at").AsDateTime().NotNullable()
            .WithColumn("updated_at").AsDateTime().Nullable();
    }

    public override void Down()
    {
        if (Schema.Table("products").Exists())
        {
            Delete.Table("products");
        }
    }
}