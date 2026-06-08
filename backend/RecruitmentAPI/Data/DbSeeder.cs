using Microsoft.EntityFrameworkCore;
using RecruitmentAPI.Data;
using RecruitmentAPI.Models;

namespace RecruitmentAPI.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Check if we have any companies already
        if (await context.Companies.AnyAsync())
        {
            return;
        }

        // Get a default admin/employer user to be the owner of these companies
        var defaultOwner = await context.Users.FirstOrDefaultAsync(u => u.Role == "employer" || u.Role == "admin");
        if (defaultOwner == null)
        {
            // Create a default employer user
            defaultOwner = new User
            {
                Id = Guid.NewGuid(),
                Username = "employer_seeder",
                Email = "employer_seeder@gotuyendung.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123", workFactor: 12),
                FullName = "GoTuyenDung Seeder",
                Role = "employer",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            context.Users.Add(defaultOwner);
            await context.SaveChangesAsync();
        }

        var industries = new[] { "IT", "Finance", "Marketing", "Education", "FMCG", "Healthcare", "Real Estate", "Logistics", "Retail", "Manufacturing" };
        var sizes = new[] { "10-50 employees", "50-200 employees", "200-500 employees", "500-1000 employees", "1000+ employees" };
        var locations = new[] { "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Cần Thơ", "Nghệ An", "Bình Dương", "Hải Phòng" };

        var companyNames = new[]
        {
            "FPT Software", "Viettel Group", "VNG Corporation", "Shopee Vietnam", "Grab Vietnam",
            "Tiki Corporation", "Momo (M-Service)", "VinGroup", "Masan Group", "Vinamilk",
            "SABECO", "Vietcombank", "Techcombank", "MB Bank", "BIDV",
            "FMCG Unilever Vietnam", "Nestle Vietnam", "Procter & Gamble (P&G)", "Samsung Vina", "Intel Vietnam",
            "LG Electronics Vietnam", "Honda Vietnam", "Toyota Vietnam", "Hoa Sen Group", "Hoa Phat Group",
            "Biti's", "Trung Nguyen Group", "Highlands Coffee", "The Coffee House", "Phuc Long Tea",
            "PropertyValue (Dat Xanh)", "Novaland Group", " Vinhomes", "Khang Dien", "Nam Long Group",
            "Lazada Vietnam", "Sendo", "Giao Hang Tiet Kiem", "Giao Hang Nhanh", "Viettel Post",
            "Vietnam Airlines", "Vietjet Air", "Bamboo Airways", "Saigontourist", "Sun Group",
            "Topica Edtech", "Vinschool", "RMIT University Vietnam", "FPT Education", "Aptech Vietnam"
        };

        var listCompanies = new List<Company>();

        for (int i = 0; i < companyNames.Length; i++)
        {
            var industry = industries[i % industries.Length];
            var size = sizes[i % sizes.Length];
            var location = locations[i % locations.Length];
            var name = companyNames[i];

            var company = new Company
            {
                Id = Guid.NewGuid(),
                OwnerId = defaultOwner.Id,
                Name = name,
                Description = $"{name} là một trong những doanh nghiệp hàng đầu trong lĩnh vực {industry} tại Việt Nam. Chúng tôi cam kết mang lại môi trường làm việc năng động, sáng tạo và nhiều cơ hội thăng tiến cho người lao động.",
                LogoUrl = $"https://api.dicebear.com/7.x/initials/svg?seed={Uri.EscapeDataString(name)}",
                Website = $"https://www.{name.ToLower().Replace(" ", "").Replace("(", "").Replace(")", "")}.com.vn",
                Industry = industry,
                Size = size,
                Location = location,
                TaxCode = $"0102{100000 + i}",
                PhoneNumber = $"0243{100000 + i}",
                Email = $"recruitment@{name.ToLower().Replace(" ", "").Replace("(", "").Replace(")", "")}.com.vn",
                IsVerified = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            listCompanies.Add(company);
        }

        await context.Companies.AddRangeAsync(listCompanies);
        await context.SaveChangesAsync();

        // Seed some job postings as well for real-time search and filter testing
        var jobTitles = new[]
        {
            "Software Engineer", "Frontend Developer", "Backend Developer", "Fullstack Developer",
            "UI/UX Designer", "Product Manager", "Data Analyst", "DevOps Engineer",
            "Mobile App Developer", "QA/QC Engineer", "Business Analyst", "Marketing Executive",
            "Sales Manager", "Accountant", "Human Resources Specialist", "Content Creator"
        };

        var listJobs = new List<JobPosting>();

        foreach (var company in listCompanies)
        {
            // Seed 1-3 jobs for each company
            var jobsCount = (company.Id.GetHashCode() % 3) + 1;
            for (int k = 0; k < jobsCount; k++)
            {
                var jobTitle = jobTitles[Math.Abs((company.Id.GetHashCode() + k) % jobTitles.Length)];
                var jobType = (company.Id.GetHashCode() + k) % 3 == 0 ? "PartTime" : "FullTime";
                var expLevel = (company.Id.GetHashCode() + k) % 4 == 0 ? "Senior" : "MidLevel";

                var job = new JobPosting
                {
                    Id = Guid.NewGuid(),
                    CompanyId = company.Id,
                    AuthorId = defaultOwner.Id,
                    Title = $"{jobTitle} ({company.Name})",
                    Description = $"Chúng tôi đang tìm kiếm một {jobTitle} tài năng để gia nhập đội ngũ của chúng tôi tại {company.Location}. Bạn sẽ tham gia vào các dự án lớn và có cơ hội phát triển năng lực bản thân vượt bậc.",
                    Requirements = "• Có từ 1-3 năm kinh nghiệm trong vị trí tương đương\n• Có tinh thần học hỏi tốt và làm việc nhóm hiệu quả\n• Sử dụng thành thạo các công cụ phục vụ công việc",
                    Benefits = "• Mức lương cạnh tranh và hấp dẫn\n• Thưởng tháng 13 và thưởng hiệu quả công việc\n• Bảo hiểm sức khỏe cao cấp và hoạt động teambuilding thường niên",
                    Location = company.Location,
                    SalaryMin = 10000000 + (Math.Abs(company.Id.GetHashCode() + k) % 15) * 1000000,
                    SalaryMax = 20000000 + (Math.Abs(company.Id.GetHashCode() + k) % 25) * 1000000,
                    SalaryCurrency = "VND",
                    JobType = jobType,
                    ExperienceLevel = expLevel,
                    SkillsRequired = "Communication,Teamwork,Problem Solving",
                    VacancyCount = 1 + (k % 3),
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow.AddDays(-(k * 2)),
                    UpdatedAt = DateTime.UtcNow
                };

                listJobs.Add(job);
            }
        }

        await context.JobPostings.AddRangeAsync(listJobs);
        await context.SaveChangesAsync();
    }
}