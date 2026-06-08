# Recruitment Platform Backend

This is the backend API for the Recruitment Platform built with ASP.NET Core 8.

## Prerequisites

- .NET 8 SDK
- SQL Server (local or remote)

## Setup

1. Update connection string in `appsettings.json`
2. Run migrations: `dotnet ef database update`
3. Start the server: `dotnet run`

## API Documentation

Swagger documentation available at `/swagger`

## Project Structure

- **Models** - Database entities
- **Controllers** - API endpoints
- **Services** - Business logic
- **Data** - Database context
- **DTOs** - Data transfer objects
