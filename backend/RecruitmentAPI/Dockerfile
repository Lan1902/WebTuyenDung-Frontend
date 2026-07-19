FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["RecruitmentAPI.csproj", "./"]
RUN dotnet restore "RecruitmentAPI.csproj"
COPY . .
RUN dotnet publish "RecruitmentAPI.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Cấu hình cổng động cho Render
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "RecruitmentAPI.dll"]