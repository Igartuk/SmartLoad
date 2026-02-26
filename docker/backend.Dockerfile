FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY backend/src/SmartLoad.Api/SmartLoad.Api.csproj backend/src/SmartLoad.Api/
RUN dotnet restore backend/src/SmartLoad.Api/SmartLoad.Api.csproj

COPY . .
RUN dotnet publish backend/src/SmartLoad.Api/SmartLoad.Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "SmartLoad.Api.dll"]