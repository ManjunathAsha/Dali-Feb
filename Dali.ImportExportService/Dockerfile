FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
RUN apt-get update && apt-get install -y curl
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy Directory.Build.props first
COPY ["Directory.Build.props", "../Directory.Build.props"]
COPY ["Dali.ImportExportService.csproj", "./"]

# Clear NuGet cache and configure for Linux
RUN dotnet nuget locals all --clear
ENV NUGET_PACKAGES=/root/.nuget/packages
RUN mkdir -p /root/.nuget/packages

# Add NuGet.Config to disable package analysis
RUN echo '<?xml version="1.0" encoding="utf-8"?>\n\
<configuration>\n\
  <config>\n\
    <add key="globalPackagesFolder" value="/root/.nuget/packages" />\n\
  </config>\n\
  <packageRestore>\n\
    <add key="enabled" value="True" />\n\
    <add key="automatic" value="True" />\n\
  </packageRestore>\n\
</configuration>' > /root/NuGet.Config

ENV NUGET_CONFIG=/root/NuGet.Config

# Restore with retry logic and force
RUN dotnet restore "Dali.ImportExportService.csproj" --disable-parallel --force || \
    (sleep 5 && dotnet restore "Dali.ImportExportService.csproj" --disable-parallel --force)

COPY . .
RUN dotnet build "Dali.ImportExportService.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Dali.ImportExportService.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Dali.ImportExportService.dll"]
