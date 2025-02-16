FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
RUN apt-get update && apt-get install -y curl
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Dali.DocumentService.csproj", "./"]
RUN dotnet restore "Dali.DocumentService.csproj"
COPY . .
RUN dotnet build "Dali.DocumentService.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Dali.DocumentService.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Dali.DocumentService.dll"]
