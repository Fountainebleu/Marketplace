using FluentMigrator;

namespace ProductService.Infrastructure.Migrations;

[Migration(20260620000100, "Seed sample products")]
public class SeedProductsMigration : Migration
{
    public override void Up()
    {
        Execute.Sql("""
                    INSERT INTO products (
                        id, sku, name, description, price, category,
                        manufacturer_country, weight, width, height, length,
                        image_url, is_active, created_at, updated_at)
                    VALUES
                        (
                            '11111111-1111-1111-1111-111111111111',
                            'ELEC-PHONE-001',
                            'Smartphone X',
                            'Compact smartphone with a bright display and fast charging.',
                            49999, 2, 'China', 0.19, 7.2, 15.1, 0.8,
                            'https://placehold.co/600x400/png', TRUE,
                            NOW() AT TIME ZONE 'UTC', NOW() AT TIME ZONE 'UTC'
                        ),
                        (
                            '22222222-2222-2222-2222-222222222222',
                            'ELEC-LAPTOP-001',
                            'Ultrabook Pro 14',
                            'Lightweight laptop for study and work.',
                            89999, 2, 'Taiwan', 1.32, 31.2, 22.1, 1.6,
                            'https://placehold.co/600x400/png', TRUE,
                            NOW() AT TIME ZONE 'UTC', NOW() AT TIME ZONE 'UTC'
                        ),
                        (
                            '33333333-3333-3333-3333-333333333333',
                            'BOOK-CSHARP-001',
                            'C# Backend Handbook',
                            'Practical guide to building backend services with C#.',
                            2499, 6, 'Russia', 0.65, 17, 24, 3,
                            'https://placehold.co/600x400/png', TRUE,
                            NOW() AT TIME ZONE 'UTC', NOW() AT TIME ZONE 'UTC'
                        ),
                        (
                            '44444444-4444-4444-4444-444444444444',
                            'HOME-KETTLE-001',
                            'Electric Kettle',
                            'Steel electric kettle with automatic shut-off.',
                            3299, 4, 'China', 1.1, 22, 24, 16,
                            'https://placehold.co/600x400/png', TRUE,
                            NOW() AT TIME ZONE 'UTC', NOW() AT TIME ZONE 'UTC'
                        )
                    ON CONFLICT (id) DO NOTHING;
                    """);
    }

    public override void Down()
    {
        Execute.Sql("""
                    DELETE FROM products
                    WHERE id IN (
                        '11111111-1111-1111-1111-111111111111',
                        '22222222-2222-2222-2222-222222222222',
                        '33333333-3333-3333-3333-333333333333',
                        '44444444-4444-4444-4444-444444444444'
                    );
                    """);
    }
}
