using FluentMigrator;

namespace ProductService.Infrastructure.Migrations;

[Migration(20260613000200, "Add product physical properties")]
public class AddProductPhysicalPropertiesMigration : Migration
{
    public override void Up()
    {
        Alter.Table("products")
            .AddColumn("sku").AsString(100).Nullable()
            .AddColumn("manufacturer_country").AsString(100).Nullable()
            .AddColumn("weight").AsDecimal().NotNullable().WithDefaultValue(0)
            .AddColumn("width").AsDecimal().NotNullable().WithDefaultValue(0)
            .AddColumn("height").AsDecimal().NotNullable().WithDefaultValue(0)
            .AddColumn("length").AsDecimal().NotNullable().WithDefaultValue(0);

        Execute.Sql("UPDATE products SET sku = id::text WHERE sku IS NULL OR sku = '';");

        Alter.Column("sku")
            .OnTable("products")
            .AsString(100)
            .NotNullable();

        Create.Index("ux_products_sku")
            .OnTable("products")
            .OnColumn("sku").Ascending()
            .WithOptions().Unique();
    }

    public override void Down()
    {
        Delete.Index("ux_products_sku").OnTable("products");

        Delete.Column("length").FromTable("products");
        Delete.Column("height").FromTable("products");
        Delete.Column("width").FromTable("products");
        Delete.Column("weight").FromTable("products");
        Delete.Column("manufacturer_country").FromTable("products");
        Delete.Column("sku").FromTable("products");
    }
}
