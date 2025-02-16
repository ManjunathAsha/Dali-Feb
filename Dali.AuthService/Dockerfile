FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443
RUN apt-get update && apt-get install -y curl

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Auth.API.csproj", "./"]

# Clear NuGet cache and configure for Linux
RUN dotnet nuget locals all --clear
ENV NUGET_PACKAGES=/root/.nuget/packages
RUN mkdir -p /root/.nuget/packages

# Restore with retry logic
RUN dotnet restore "Auth.API.csproj" --disable-parallel || \
    (sleep 5 && dotnet restore "Auth.API.csproj" --disable-parallel)

COPY . .
RUN dotnet build "Auth.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Auth.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Auth.API.dll"]