using FluentValidation;
using ProductService.Application;
using ProductService.Infrastructure;
using ProductService.Infrastructure.Helpers;
using ProductService.Infrastructure.Implementations;
using ProductService.Infrastructure.Migrations;
using ProductService.Presentation.Endpoints;
using ProductService.Presentation.Validators;
using ProductApplicationService = ProductService.Application.Implementations.ProductService;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddValidatorsFromAssemblyContaining<ProductRequestValidator>();

var productsConnectionString = builder.Configuration.GetConnectionString("ProductsDb")
                               ?? throw new InvalidOperationException("ProductsDb connection string is not configured.");

builder.Services.AddSingleton<IPostgresConnectionFactory>(new PostgresConnectionFactory(productsConnectionString));
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductService, ProductApplicationService>();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapOpenApi();
}

app.RunMigrations();
app.UseHttpsRedirection();
app.MapProductEndpoints();

app.Run();
