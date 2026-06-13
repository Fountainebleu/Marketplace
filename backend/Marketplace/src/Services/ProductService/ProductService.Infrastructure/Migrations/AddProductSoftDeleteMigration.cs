using FluentMigrator;

namespace ProductService.Infrastructure.Migrations;

[Migration(20260613000300, "Add product soft delete")]
public class AddProductSoftDeleteMigration : Migration
{
    public override void Up()
    {
        Alter.Table("products")
            .AddColumn("is_active").AsBoolean().NotNullable().WithDefaultValue(true);

        Create.Index("ix_products_is_active")
            .OnTable("products")
            .OnColumn("is_active").Ascending();
    }

    public override void Down()
    {
        Delete.Index("ix_products_is_active").OnTable("products");
        Delete.Column("is_active").FromTable("products");
    }
}
