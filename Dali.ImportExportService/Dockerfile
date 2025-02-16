FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
RUN apt-get update && apt-get install -y curl
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Dali.ImportExportService.csproj", "./"]

# Clear NuGet cache and configure for Linux
RUN dotnet nuget locals all --clear
ENV NUGET_PACKAGES=/root/.nuget/packages
RUN mkdir -p /root/.nuget/packages

# Restore with retry logic
RUN dotnet restore "Dali.ImportExportService.csproj" --disable-parallel || \
    (sleep 5 && dotnet restore "Dali.ImportExportService.csproj" --disable-parallel)

COPY . .
RUN dotnet build "Dali.ImportExportService.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Dali.ImportExportService.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Dali.ImportExportService.dll"]
