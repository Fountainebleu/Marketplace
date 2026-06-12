using FluentMigrator;

namespace Orders.Api.Infrastructure;

[Migration(2026061201)]
public sealed class CreateOrdersTablesMigration : Migration
{
    public override void Up()
    {
        Create.Table("orders")
            .WithColumn("id").AsGuid().PrimaryKey()
            .WithColumn("customer_id").AsGuid().NotNullable()
            .WithColumn("customer_name").AsString(200).NotNullable()
            .WithColumn("phone").AsString(32).NotNullable()
            .WithColumn("delivery_address").AsString(500).NotNullable()
            .WithColumn("status").AsString(32).NotNullable()
            .WithColumn("total_price").AsDecimal(18, 2).NotNullable()
            .WithColumn("created_at").AsDateTimeOffset().NotNullable()
            .WithColumn("updated_at").AsDateTimeOffset().NotNullable();

        Create.Table("order_items")
            .WithColumn("id").AsGuid().PrimaryKey()
            .WithColumn("order_id").AsGuid().NotNullable().ForeignKey("orders", "id")
            .WithColumn("product_id").AsGuid().NotNullable()
            .WithColumn("product_name").AsString(300).NotNullable()
            .WithColumn("unit_price").AsDecimal(18, 2).NotNullable()
            .WithColumn("quantity").AsInt32().NotNullable();

        Create.Table("order_status_history")
            .WithColumn("id").AsGuid().PrimaryKey()
            .WithColumn("order_id").AsGuid().NotNullable().ForeignKey("orders", "id")
            .WithColumn("status").AsString(32).NotNullable()
            .WithColumn("comment").AsString(1000).Nullable()
            .WithColumn("changed_at").AsDateTimeOffset().NotNullable();

        Create.Index("ix_orders_status").OnTable("orders").OnColumn("status");
        Create.Index("ix_orders_created_at").OnTable("orders").OnColumn("created_at");
        Create.Index("ix_order_items_order_id").OnTable("order_items").OnColumn("order_id");
        Create.Index("ix_order_status_history_order_id").OnTable("order_status_history").OnColumn("order_id");
    }

    public override void Down()
    {
        Delete.Table("order_status_history");
        Delete.Table("order_items");
        Delete.Table("orders");
    }
}
