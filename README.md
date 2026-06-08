# Recruitment Platform - Full Stack Application

## 📋 Project Structure

```
WebTuyenDung/
├── frontend/                 # Next.js 14 Frontend
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   ├── components/      # React Components
│   │   ├── lib/             # Utilities & API Client
│   │   └── types/           # TypeScript Types
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.js
│
├── backend/                 # .NET 8 API
│   └── RecruitmentAPI/
│       ├── Controllers/     # API Endpoints
│       ├── Models/          # Database Entities
│       ├── Data/            # EF Core DbContext
│       ├── Services/        # Business Logic
│       ├── DTOs/            # Data Transfer Objects
│       ├── Program.cs       # App Configuration
│       └── appsettings.json # Configuration
│
├── frontend.Dockerfile
├── backend.Dockerfile
├── docker-compose.yml
└── README.md
```

## 🚀 Quick Start

### Using Docker Compose

```bash
docker-compose up -d
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Swagger UI: http://localhost:5000/swagger

### Local Development

#### Backend (.NET)
```bash
cd backend/RecruitmentAPI
dotnet restore
dotnet ef database update
dotnet run
```

#### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

## 📚 Features

### For Candidates
- Browse available job postings
- Apply to jobs
- Manage applications
- View application status

### For Employers
- Post job listings
- Manage company profile
- Review applications
- Track applicant status

### Admin
- Manage users
- Monitor system activity
- Review applications
- Generate reports

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **HTTP Client**: Axios

### Backend
- **Runtime**: .NET 8
- **Framework**: ASP.NET Core
- **Database**: SQL Server
- **ORM**: Entity Framework Core
- **Authentication**: JWT

## 🔐 Security Features

- JWT Token-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- SQL injection prevention via parameterized queries
- CORS configuration
- Secure API endpoints

## 📝 API Documentation

Swagger/OpenAPI documentation is available at: `/swagger`

### Main Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

#### Jobs
- `GET /api/jobs` - List all jobs
- `GET /api/jobs/{id}` - Get job details
- `POST /api/jobs` - Create job (employers only)
- `PUT /api/jobs/{id}` - Update job
- `DELETE /api/jobs/{id}` - Delete job

#### Applications
- `GET /api/applications` - List applications
- `POST /api/applications` - Apply to job
- `PATCH /api/applications/{id}/status` - Update application status

#### Companies
- `GET /api/companies` - List companies
- `POST /api/companies` - Create company

## 🌐 Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=RecruitmentDb;Trusted_Connection=true;"
  },
  "Jwt": {
    "Key": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!",
    "Issuer": "RecruitmentAPI",
    "Audience": "RecruitmentApp"
  }
}
```

## 📦 Dependencies

### Frontend
- react: ^18.2.0
- next: ^14.0.0
- tailwindcss: ^3.3.0
- axios: ^1.6.0
- typescript: ^5.2.0

### Backend
- Microsoft.EntityFrameworkCore: ^8.0.0
- Microsoft.EntityFrameworkCore.SqlServer: ^8.0.0
- Microsoft.AspNetCore.Authentication.JwtBearer: ^8.0.0
- BCrypt.Net-Next: ^4.0.3

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure SQL Server is running
- Check connection string in appsettings.json
- Verify database name and credentials

### Port Already in Use
- Change ports in docker-compose.yml or appsettings.json
- Kill processes using the ports

### CORS Issues
- Check CORS policy in Program.cs
- Ensure frontend URL is allowed

## 📄 License

This project is proprietary software. All rights reserved.

## 👥 Support

For issues and questions, please contact the development team.
