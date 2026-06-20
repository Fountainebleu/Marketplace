using FluentMigrator.Runner;
using FluentValidation;
using Orders.Api.Endpoints;
using Orders.Api.Infrastructure;
using Orders.Api.Services;
using Orders.Api.Validation;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins(
                "http://localhost:5173",
                "http://localhost:3000",
                "http://localhost")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddSingleton<DbConnectionFactory>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IProductCatalogClient, GrpcProductCatalogClient>();
builder.Services.AddScoped<OrderService>();
builder.Services.AddValidatorsFromAssemblyContaining<CreateOrderRequestValidator>();
builder.Services.AddOpenApi();
builder.Services.AddGrpcClient<Marketplace.Products.Grpc.ProductCatalog.ProductCatalogClient>(options =>
{
    options.Address = new Uri(
        builder.Configuration["ProductCatalog:GrpcAddress"]
        ?? throw new InvalidOperationException("ProductCatalog:GrpcAddress is not configured."));
});

builder.Services
    .AddFluentMigratorCore()
    .ConfigureRunner(runner => runner
        .AddPostgres()
        .WithGlobalConnectionString(builder.Configuration.GetConnectionString("OrdersDb"))
        .ScanIn(typeof(CreateOrdersTablesMigration).Assembly).For.Migrations())
    .AddLogging(logging => logging.AddFluentMigratorConsole());

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

using (var scope = app.Services.CreateScope())
{
    var migrationRunner = scope.ServiceProvider.GetRequiredService<IMigrationRunner>();
    migrationRunner.MigrateUp();
}

app.UseCors();
app.UseHttpsRedirection();
app.MapOrdersEndpoints();

app.Run();
