using FluentMigrator.Runner;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace ProductService.Infrastructure.Migrations;

public static class MigrationRunner
{
    public static IHost RunMigrations(this IHost host)
    {
        var configuration = host.Services.GetRequiredService<IConfiguration>();
        var connectionString = configuration.GetConnectionString("ProductsDb")
                               ?? throw new InvalidOperationException("No database connection string found.");
        
        var serviceContext = CreateService(connectionString);
        using var scope = serviceContext.CreateScope();
        var runner = scope.ServiceProvider.GetRequiredService<IMigrationRunner>();
        runner.MigrateUp();

        return host;
    }

    private static IServiceProvider CreateService(string connectionString)
        => new ServiceCollection()
            .AddFluentMigratorCore()
            .ConfigureRunner(builder => builder
                .AddPostgres()
                .WithGlobalConnectionString(connectionString)
                .ScanIn(typeof(MigrationRunner).Assembly).For.Migrations()
                .ConfigureGlobalProcessorOptions(op => op.ProviderSwitches = "Force Quote=false"))
            .AddLogging(log => log.AddFluentMigratorConsole())
            .BuildServiceProvider(false);
}
