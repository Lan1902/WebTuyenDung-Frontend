using System.ComponentModel.DataAnnotations;

namespace RecruitmentAPI.DTOs;

// A03:2021 - Input sanitization helper for XSS prevention
public static class InputSanitizer
{
    public static string Sanitize(string? input)
    {
        if (string.IsNullOrWhiteSpace(input)) return string.Empty;
        return input.Trim();
    }

    public static string SanitizeHtml(string? input)
    {
        if (string.IsNullOrWhiteSpace(input)) return string.Empty;
        var sanitized = input.Trim();
        // Remove script tags and event handlers
        sanitized = System.Text.RegularExpressions.Regex.Replace(
            sanitized,
            @"<script.*?</script>",
            "",
            System.Text.RegularExpressions.RegexOptions.IgnoreCase | System.Text.RegularExpressions.RegexOptions.Singleline);
        sanitized = System.Text.RegularExpressions.Regex.Replace(
            sanitized,
            @"\bon\w+\s*=",
            "",
            System.Text.RegularExpressions.RegexOptions.IgnoreCase);
        return sanitized;
    }
}

public class LoginRequest
{
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}

public class RegisterRequest
{
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    public string FullName { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = "candidate";
}

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public UserDto User { get; set; } = null!;
}

public class UserDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}

public class JobPostingDto
{
    public Guid Id { get; set; }
    public Guid AuthorId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid CompanyId { get; set; }
    public decimal SalaryMin { get; set; }
    public decimal SalaryMax { get; set; }
    public string Location { get; set; } = string.Empty;
    public string JobType { get; set; } = string.Empty;
    public string ExperienceLevel { get; set; } = string.Empty;
    public List<string> SkillsRequired { get; set; } = new();
    public int ApplicationsCount { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateJobPostingDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid CompanyId { get; set; }
    public decimal SalaryMin { get; set; }
    public decimal SalaryMax { get; set; }
    public string Location { get; set; } = string.Empty;
    public string JobType { get; set; } = string.Empty;
    public string ExperienceLevel { get; set; } = string.Empty;
    public List<string> SkillsRequired { get; set; } = new();
}

public class JobApplicationDto
{
    public Guid Id { get; set; }
    public Guid JobId { get; set; }
    public Guid CandidateId { get; set; }
    public string ResumeUrl { get; set; } = string.Empty;
    public string CoverLetter { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime AppliedAt { get; set; }
    // 3 TRƯỜNG BỔ SUNG ĐỂ HIỂN THỊ LÊN DASHBOARD FRONTEND
    public string? JobTitle { get; set; }
    public string? CompanyName { get; set; }
    public string? CandidateName { get; set; }
}

public class UpdateApplicationStatusDto
{
    public string Status { get; set; } = string.Empty;
}

public class CompanyDto
{
    public Guid Id { get; set; }
    public Guid OwnerId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Website { get; set; } = string.Empty;
    public string Industry { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
}

// A07:2021 - Refresh Token DTOs
public class RefreshTokenRequest
{
    [Required]
    public string AccessToken { get; set; } = string.Empty;

    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}

public class TokenResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}

public class LoginResponseWithTokens : LoginResponse
{
    public string RefreshToken { get; set; } = string.Empty;
}

// Resume DTOs
public class ResumeDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<ResumeExperienceDto> Experiences { get; set; } = new List<ResumeExperienceDto>();
    public List<ResumeEducationDto> Educations { get; set; } = new List<ResumeEducationDto>();
    public List<ResumeSkillDto> Skills { get; set; } = new List<ResumeSkillDto>();
}

public class CreateResumeDto
{
    [Required]
    public string Title { get; set; } = string.Empty;
    public string? FullName { get; set; }
    [EmailAddress]
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Address { get; set; }
    public string? Bio { get; set; }
    public List<CreateResumeExperienceDto> Experiences { get; set; } = new List<CreateResumeExperienceDto>();
    public List<CreateResumeEducationDto> Educations { get; set; } = new List<CreateResumeEducationDto>();
    public List<CreateResumeSkillDto> Skills { get; set; } = new List<CreateResumeSkillDto>();
}

public class ResumeExperienceDto
{
    public Guid Id { get; set; }
    public string Company { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsCurrent { get; set; }
    public string? Description { get; set; }
}

public class CreateResumeExperienceDto
{
    [Required]
    public string Company { get; set; } = string.Empty;
    [Required]
    public string Position { get; set; } = string.Empty;
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsCurrent { get; set; } = false;
    public string? Description { get; set; }
}

public class ResumeEducationDto
{
    public Guid Id { get; set; }
    public string Institution { get; set; } = string.Empty;
    public string Degree { get; set; } = string.Empty;
    public string? FieldOfStudy { get; set; }
    public int? GraduationYear { get; set; }
}

public class CreateResumeEducationDto
{
    [Required]
    public string Institution { get; set; } = string.Empty;
    [Required]
    public string Degree { get; set; } = string.Empty;
    public string? FieldOfStudy { get; set; }
    public int? GraduationYear { get; set; }
}

public class ResumeSkillDto
{
    public Guid Id { get; set; }
    public string SkillName { get; set; } = string.Empty;
    public string Proficiency { get; set; } = string.Empty;
}

public class CreateResumeSkillDto
{
    [Required]
    public string SkillName { get; set; } = string.Empty;
    [Required]
    public string Proficiency { get; set; } = string.Empty;
}