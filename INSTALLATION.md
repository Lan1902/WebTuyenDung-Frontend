# Installation Guide - Recruitment Platform

## Yêu cầu hệ thống

### Chung
- Docker & Docker Compose (khuyên dùng)
- Git

### Backend (.NET)
- .NET 8 SDK hoặc cao hơn
- SQL Server 2019+

### Frontend (Next.js)
- Node.js 18+
- npm hoặc yarn

## Cài đặt nhanh với Docker (Khuyên dùng)

### 1. Clone dự án
```bash
git clone <repository>
cd WebTuyenDung
```

### 2. Khởi động với Docker Compose
```bash
docker-compose up -d
```

### 3. Truy cập ứng dụng
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/swagger

## Cài đặt phát triển cục bộ

### Backend Setup

#### 1. Chuẩn bị Database
```bash
# Nếu chưa cài SQL Server, cài đặt nó
# Windows: Download từ https://www.microsoft.com/sql-server/sql-server-downloads
# Linux/Mac: Chạy trong Docker
docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=YourPassword@123' -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest
```

#### 2. Cấu hình Backend
```bash
cd backend/RecruitmentAPI

# Cập nhật appsettings.json nếu cần
# Mở file appsettings.json và cập nhật ConnectionStrings

# Restore dependencies
dotnet restore

# Áp dụng migrations
dotnet ef database update

# Chạy ứng dụng
dotnet run
```

Backend sẽ chạy tại: http://localhost:5000

### Frontend Setup

#### 1. Cài đặt Dependencies
```bash
cd frontend
npm install
# hoặc
yarn install
```

#### 2. Cấu hình Environment
```bash
# Tạo file .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
```

#### 3. Chạy Development Server
```bash
npm run dev
# hoặc
yarn dev
```

Frontend sẽ chạy tại: http://localhost:3000

## Database Migrations

### Tạo Migration Mới
```bash
cd backend/RecruitmentAPI
dotnet ef migrations add MigrationName -o Data/Migrations
```

### Áp dụng Migrations
```bash
dotnet ef database update
```

## Cấu hình

### Environment Variables

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

#### Backend (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=RecruitmentDb;User Id=sa;Password=YourPassword@123;"
  },
  "Jwt": {
    "Key": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!",
    "Issuer": "RecruitmentAPI",
    "Audience": "RecruitmentApp"
  }
}
```

## Build for Production

### Frontend
```bash
cd frontend
npm run build
npm start
```

### Backend
```bash
cd backend/RecruitmentAPI
dotnet publish -c Release -o publish
dotnet publish/RecruitmentAPI.dll
```

## Troubleshooting

### Lỗi kết nối Database
- Kiểm tra SQL Server đang chạy
- Kiểm tra connection string trong appsettings.json
- Kiểm tra credentials (username/password)

### Lỗi Port đã được sử dụng
- Thay đổi port trong docker-compose.yml hoặc appsettings.json
- Hoặc kill process sử dụng port đó

### CORS Errors
- Kiểm tra CORS policy trong Program.cs
- Đảm bảo frontend URL được phép

### Module không tìm thấy (Frontend)
```bash
cd frontend
rm -rf node_modules
npm install
```

## API Documentation

Swagger/OpenAPI documentation: http://localhost:5000/swagger

## Hỗ trợ

Để báo cáo lỗi hoặc đề xuất, vui lòng liên hệ với đội phát triển.
