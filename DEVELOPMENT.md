# Development Guide - Recruitment Platform

## 🚀 Bắt đầu nhanh

### Option 1: Docker (Khuyên dùng)
```bash
docker-compose up -d
```

### Option 2: Development cục bộ
```bash
# Terminal 1: Backend
cd backend/RecruitmentAPI
dotnet run

# Terminal 2: Frontend
cd frontend
npm run dev
```

## 📁 Cấu trúc dự án

```
WebTuyenDung/
├── frontend/                 # Next.js 14 Application
│   ├── src/
│   │   ├── app/             # Pages & layouts
│   │   │   ├── page.tsx     # Home page
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── jobs/
│   │   │   ├── dashboard/
│   │   │   └── companies/
│   │   ├── components/      # Reusable components
│   │   ├── lib/             # Utilities
│   │   │   ├── api.ts       # API client
│   │   │   └── auth.tsx     # Auth HOCs
│   │   └── types/           # TypeScript types
│   └── public/              # Static assets
│
├── backend/                 # ASP.NET Core 8 API
│   └── RecruitmentAPI/
│       ├── Controllers/     # API endpoints
│       │   ├── AuthController.cs
│       │   ├── JobsController.cs
│       │   ├── ApplicationsController.cs
│       │   └── CompaniesController.cs
│       ├── Models/          # Database entities
│       ├── Data/            # EF Core context
│       ├── Services/        # Business logic
│       ├── DTOs/            # Data transfer objects
│       ├── Program.cs       # App setup
│       └── appsettings.json
│
├── docker-compose.yml
├── frontend.Dockerfile
├── backend.Dockerfile
├── README.md                # Project overview
├── INSTALLATION.md          # Setup instructions
└── DEVELOPMENT.md           # This file
```

## 🔧 Backend Development

### Database Management

#### Create a Migration
```bash
cd backend/RecruitmentAPI
dotnet ef migrations add NameOfMigration -o Data/Migrations
```

#### Apply Migrations
```bash
dotnet ef database update
```

#### Revert Last Migration
```bash
dotnet ef migrations remove
```

### Adding a New Controller

1. Create a controller in `Controllers/` folder:
```csharp
using Microsoft.AspNetCore.Mvc;
using RecruitmentAPI.Data;

namespace RecruitmentAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class YourController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public YourController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult> GetAll()
    {
        return Ok(new { message = "Hello" });
    }
}
```

2. Register in `Program.cs` if needed (Controllers auto-registered)

### API Endpoints

#### Auth
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register

#### Jobs
- `GET /api/jobs` - List all jobs
- `GET /api/jobs/{id}` - Get job details
- `GET /api/jobs/search?q=query` - Search jobs
- `POST /api/jobs` - Create job (auth required)
- `PUT /api/jobs/{id}` - Update job (auth required)
- `DELETE /api/jobs/{id}` - Delete job (auth required)

#### Applications
- `GET /api/applications` - List applications
- `GET /api/applications/{id}` - Get application details
- `POST /api/applications` - Apply to job
- `PATCH /api/applications/{id}/status` - Update application status

#### Companies
- `GET /api/companies` - List companies
- `GET /api/companies/{id}` - Get company details
- `POST /api/companies` - Create company (auth required)
- `PUT /api/companies/{id}` - Update company

## ⚛️ Frontend Development

### Creating Pages

New pages go in `src/app/` using Next.js 14 App Router:

```bash
# Create a new page
mkdir -p src/app/newpage
echo "'use client';\n\nexport default function NewPage() {\n  return <h1>New Page</h1>;\n}" > src/app/newpage/page.tsx
```

### Creating Components

```bash
# Create reusable component
touch src/components/MyComponent.tsx
```

Example component:
```tsx
'use client';

interface MyComponentProps {
  title: string;
}

export default function MyComponent({ title }: MyComponentProps) {
  return <div className="p-4">{title}</div>;
}
```

### Using the API Client

```tsx
import { jobApi, authApi, applicationApi } from '@/lib/api';

// Get all jobs
const jobs = await jobApi.getAll();

// Get single job
const job = await jobApi.getById(jobId);

// Create job
await jobApi.create(jobData);

// Login
const response = await authApi.login(username, password);
localStorage.setItem('token', response.data.token);

// Apply to job
await applicationApi.create({
  job_id: jobId,
  resume_url: '',
  cover_letter: ''
});
```

### Protected Routes

Use auth HOCs to protect routes:

```tsx
import { withAuth, withEmployerAuth } from '@/lib/auth';

const ProtectedPage = () => {
  return <h1>Protected Content</h1>;
};

export default withAuth(ProtectedPage);

// For employer-only pages:
export default withEmployerAuth(ProtectedPage);
```

### Styling with Tailwind CSS

The project uses Tailwind CSS. Common utilities:

```tsx
<div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto">
  <h1 className="text-4xl font-bold text-gray-900 mb-4">Title</h1>
  <p className="text-gray-600 mb-6">Description</p>
  <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
    Click Me
  </button>
</div>
```

## 🧪 Testing

### Backend Unit Tests
```bash
# Create test project (optional)
dotnet new xunit -n RecruitmentAPI.Tests
dotnet add RecruitmentAPI.Tests reference RecruitmentAPI/RecruitmentAPI.csproj

# Run tests
dotnet test
```

### Frontend Tests
```bash
# Install testing library
npm install --save-dev @testing-library/react @testing-library/jest-dom jest

# Run tests
npm run test
```

## 📝 Environment Configuration

### Development
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Database: SQL Server localhost:1433

### Production
- Update connection strings
- Set secure JWT keys
- Configure CORS for production domain
- Set proper database backups

## 🐛 Debugging

### Backend Debugging
```bash
# In VS Code, add to launch.json:
{
  "name": ".NET Core Launch (web)",
  "type": "coreclr",
  "request": "launch",
  "program": "${workspaceFolder}/backend/RecruitmentAPI/bin/Debug/net8.0/RecruitmentAPI.dll",
  "args": [],
  "cwd": "${workspaceFolder}/backend/RecruitmentAPI",
  "stopAtEntry": false,
  "preLaunchTask": "build"
}
```

### Frontend Debugging
- Use Chrome DevTools
- Add `debugger;` statements in code
- Use React Developer Tools browser extension

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [ASP.NET Core Docs](https://learn.microsoft.com/en-us/aspnet/core/)
- [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)

## 🤝 Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes
git add .
git commit -m "feat: description of changes"

# Push branch
git push origin feature/feature-name

# Create Pull Request on GitHub
```

## 📋 Checklist Before Deploying

- [ ] All tests passing
- [ ] No console errors
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] CORS settings correct
- [ ] JWT secrets secure
- [ ] API rate limiting implemented
- [ ] Error handling implemented
- [ ] Code reviewed
- [ ] Documentation updated

## 🆘 Common Issues & Solutions

### "Module not found" errors
```bash
cd frontend
rm -rf node_modules
npm install
```

### Database connection refused
- Ensure SQL Server is running
- Check connection string
- Verify credentials

### Port already in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

### CORS errors
- Check allowed origins in `Program.cs`
- Ensure frontend URL matches

---

Happy coding! 🎉
