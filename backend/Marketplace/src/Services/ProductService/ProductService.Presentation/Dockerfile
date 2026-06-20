FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY . .
RUN dotnet restore Services/ProductService/ProductService.Presentation/ProductService.Presentation.csproj --disable-parallel
RUN dotnet publish Services/ProductService/ProductService.Presentation/ProductService.Presentation.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "ProductService.Presentation.dll"]
