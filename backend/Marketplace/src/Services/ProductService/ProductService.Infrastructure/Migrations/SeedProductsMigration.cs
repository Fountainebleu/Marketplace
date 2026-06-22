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
                            'Смартфон X',
                            'Компактный смартфон с ярким дисплеем, ёмким аккумулятором и быстрой зарядкой.',
                            49999, 2, 'Китай', 0.19, 7.2, 15.1, 0.8,
                            '/images/products/smartphone.png', TRUE,
                            NOW() AT TIME ZONE 'UTC', NOW() AT TIME ZONE 'UTC'
                        ),
                        (
                            '22222222-2222-2222-2222-222222222222',
                            'ELEC-LAPTOP-001',
                            'Ультрабук Про 14',
                            'Лёгкий и производительный ноутбук для учёбы, работы и поездок.',
                            89999, 2, 'Тайвань', 1.32, 31.2, 22.1, 1.6,
                            '/images/products/laptop.png', TRUE,
                            NOW() AT TIME ZONE 'UTC', NOW() AT TIME ZONE 'UTC'
                        ),
                        (
                            '33333333-3333-3333-3333-333333333333',
                            'BOOK-CSHARP-001',
                            'Справочник по бэкенду на C#',
                            'Практическое руководство по разработке надёжных серверных приложений на C#.',
                            2499, 6, 'Россия', 0.65, 17, 24, 3,
                            '/images/products/csharp-book.png', TRUE,
                            NOW() AT TIME ZONE 'UTC', NOW() AT TIME ZONE 'UTC'
                        ),
                        (
                            '44444444-4444-4444-4444-444444444444',
                            'HOME-KETTLE-001',
                            'Электрический чайник',
                            'Стальной электрический чайник с автоматическим отключением и защитой от перегрева.',
                            3299, 4, 'Китай', 1.1, 22, 24, 16,
                            '/images/products/kettle.png', TRUE,
                            NOW() AT TIME ZONE 'UTC', NOW() AT TIME ZONE 'UTC'
                        ),
                        (
                            '55555555-5555-5555-5555-555555555555',
                            'ELEC-HEADPHONES-001',
                            'Беспроводные наушники',
                            'Полноразмерные наушники с активным шумоподавлением и мягкими амбушюрами.',
                            12999, 2, 'Китай', 0.28, 18, 20, 8,
                            '/images/products/headphones.png', TRUE,
                            NOW() AT TIME ZONE 'UTC', NOW() AT TIME ZONE 'UTC'
                        ),
                        (
                            '66666666-6666-6666-6666-666666666666',
                            'ELEC-WATCH-001',
                            'Умные часы',
                            'Умные часы с круглым экраном, отслеживанием активности и защитой от воды.',
                            15999, 2, 'Китай', 0.06, 4.6, 5.2, 1.2,
                            '/images/products/smartwatch.png', TRUE,
                            NOW() AT TIME ZONE 'UTC', NOW() AT TIME ZONE 'UTC'
                        ),
                        (
                            '77777777-7777-7777-7777-777777777777',
                            'FOOD-COFFEE-001',
                            'Кофе в зёрнах',
                            'Ароматный кофе средней обжарки с нотами шоколада и жареного ореха.',
                            1299, 3, 'Бразилия', 1, 14, 28, 9,
                            '/images/products/coffee.png', TRUE,
                            NOW() AT TIME ZONE 'UTC', NOW() AT TIME ZONE 'UTC'
                        ),
                        (
                            '88888888-8888-8888-8888-888888888888',
                            'FOOD-CHOCOLATE-001',
                            'Тёмный шоколад',
                            'Насыщенный тёмный шоколад с высоким содержанием какао и мягким послевкусием.',
                            449, 3, 'Россия', 0.1, 9, 18, 1,
                            '/images/products/chocolate.png', TRUE,
                            NOW() AT TIME ZONE 'UTC', NOW() AT TIME ZONE 'UTC'
                        ),
                        (
                            '99999999-9999-9999-9999-999999999999',
                            'HOME-VACUUM-001',
                            'Вертикальный пылесос',
                            'Лёгкий беспроводной пылесос для быстрой сухой уборки дома.',
                            21999, 4, 'Китай', 2.7, 25, 112, 21,
                            '/images/products/vacuum.png', TRUE,
                            NOW() AT TIME ZONE 'UTC', NOW() AT TIME ZONE 'UTC'
                        ),
                        (
                            'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
                            'HOME-PAN-001',
                            'Сковорода с антипригарным покрытием',
                            'Глубокая сковорода с прочным антипригарным покрытием и удобной ручкой.',
                            2799, 4, 'Россия', 1.15, 28, 6, 48,
                            '/images/products/frying-pan.png', TRUE,
                            NOW() AT TIME ZONE 'UTC', NOW() AT TIME ZONE 'UTC'
                        ),
                        (
                            'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
                            'CLOTH-HOODIE-001',
                            'Хлопковая толстовка',
                            'Мягкая толстовка свободного кроя с капюшоном и вместительным карманом.',
                            4999, 5, 'Турция', 0.65, 34, 42, 8,
                            '/images/products/hoodie.png', TRUE,
                            NOW() AT TIME ZONE 'UTC', NOW() AT TIME ZONE 'UTC'
                        ),
                        (
                            'cccccccc-cccc-cccc-cccc-cccccccccccc',
                            'CLOTH-SNEAKERS-001',
                            'Повседневные кроссовки',
                            'Лёгкие кроссовки с амортизирующей подошвой для прогулок и активного отдыха.',
                            7499, 5, 'Вьетнам', 0.78, 22, 13, 34,
                            '/images/products/sneakers.png', TRUE,
                            NOW() AT TIME ZONE 'UTC', NOW() AT TIME ZONE 'UTC'
                        ),
                        (
                            'dddddddd-dddd-dddd-dddd-dddddddddddd',
                            'BOOK-NOVEL-001',
                            'Роман «Ночной город»',
                            'Атмосферный детективный роман о тайнах большого города и неожиданных встречах.',
                            899, 6, 'Россия', 0.48, 14, 21, 3,
                            '/images/products/novel.png', TRUE,
                            NOW() AT TIME ZONE 'UTC', NOW() AT TIME ZONE 'UTC'
                        ),
                        (
                            'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
                            'GENERAL-GAME-001',
                            'Семейная настольная игра',
                            'Стратегическая настольная игра с простыми правилами для компании от двух до шести человек.',
                            2399, 1, 'Россия', 1.25, 30, 30, 7,
                            '/images/products/board-game.png', TRUE,
                            NOW() AT TIME ZONE 'UTC', NOW() AT TIME ZONE 'UTC'
                        ),
                        (
                            'ffffffff-ffff-ffff-ffff-ffffffffffff',
                            'GENERAL-BACKPACK-001',
                            'Городской рюкзак',
                            'Вместительный городской рюкзак с отделением для ноутбука и мягкими лямками.',
                            3999, 1, 'Россия', 0.72, 31, 45, 16,
                            '/images/products/backpack.png', TRUE,
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
                        '44444444-4444-4444-4444-444444444444',
                        '55555555-5555-5555-5555-555555555555',
                        '66666666-6666-6666-6666-666666666666',
                        '77777777-7777-7777-7777-777777777777',
                        '88888888-8888-8888-8888-888888888888',
                        '99999999-9999-9999-9999-999999999999',
                        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
                        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
                        'cccccccc-cccc-cccc-cccc-cccccccccccc',
                        'dddddddd-dddd-dddd-dddd-dddddddddddd',
                        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
                        'ffffffff-ffff-ffff-ffff-ffffffffffff'
                    );
                    """);
    }
}
