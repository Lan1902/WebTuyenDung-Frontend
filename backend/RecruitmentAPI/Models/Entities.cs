using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecruitmentAPI.Models;

public enum UserRole
{
    Candidate = 1,
    Employer = 2,
    Admin = 3
}

public enum JobType
{
    FullTime = 1,
    PartTime = 2,
    Contract = 3,
    Temporary = 4,
    Internship = 5
}

public enum ExperienceLevel
{
    Intern = 1,
    Junior = 2,
    MidLevel = 3,
    Senior = 4,
    Lead = 5,
    Manager = 6
}

public enum ApplicationStatus
{
    Pending = 1,
    Reviewed = 2,
    Shortlisted = 3,
    Rejected = 4,
    Accepted = 5
}

[Table("Users")]
public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required, MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [Required, MaxLength(150)]
    public string FullName { get; set; } = string.Empty;

    [Required, MaxLength(30)]
    public string Role { get; set; } = nameof(UserRole.Candidate);

    [MaxLength(500)]
    public string? AvatarUrl { get; set; }

    [MaxLength(30)]
    public string? PhoneNumber { get; set; }

    [MaxLength(1000)]
    public string? Bio { get; set; }

    public bool IsActive { get; set; } = true;
    public DateTime? LastLoginAt { get; set; }

    // A07:2021 - Account lockout fields
    public int FailedLoginAttempts { get; set; } = 0;
    public DateTime? LockoutEndAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public virtual ICollection<Company> OwnedCompanies { get; set; } = new List<Company>();
    public virtual ICollection<JobPosting> PostedJobs { get; set; } = new List<JobPosting>();
    public virtual ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();
    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    public virtual ICollection<Resume> Resumes { get; set; } = new List<Resume>();
}

// A07:2021 - Refresh Token entity for secure token rotation
[Table("RefreshTokens")]
public class RefreshToken
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }

    [Required, MaxLength(500)]
    public string Token { get; set; } = string.Empty;

    public DateTime ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsRevoked { get; set; } = false;

    public virtual User User { get; set; } = null!;
}

[Table("Companies")]
public class Company
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid OwnerId { get; set; }

    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(5000)]
    public string? Description { get; set; }

    [MaxLength(500)]
    public string? LogoUrl { get; set; }

    [MaxLength(255)]
    public string? Website { get; set; }

    [MaxLength(100)]
    public string? Industry { get; set; }

    [MaxLength(50)]
    public string? Size { get; set; }

    [MaxLength(255)]
    public string? Location { get; set; }

    [MaxLength(50)]
    public string? TaxCode { get; set; }

    [MaxLength(30)]
    public string? PhoneNumber { get; set; }

    [MaxLength(255)]
    public string? Email { get; set; }

    public bool IsVerified { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public virtual User Owner { get; set; } = null!;
    public virtual ICollection<JobPosting> JobPostings { get; set; } = new List<JobPosting>();
}

[Table("Jobs")]
public class JobPosting
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid CompanyId { get; set; }
    public Guid AuthorId { get; set; }

    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required, MaxLength(5000)]
    public string Description { get; set; } = string.Empty;

    [MaxLength(5000)]
    public string? Requirements { get; set; }

    [MaxLength(5000)]
    public string? Benefits { get; set; }

    [Required, MaxLength(255)]
    public string Location { get; set; } = string.Empty;

    [Column(TypeName = "decimal(18,2)")]
    public decimal SalaryMin { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal SalaryMax { get; set; }

    [MaxLength(30)]
    public string SalaryCurrency { get; set; } = "VND";

    [Required, MaxLength(30)]
    public string JobType { get; set; } = nameof(Models.JobType.FullTime);

    [Required, MaxLength(30)]
    public string ExperienceLevel { get; set; } = nameof(Models.ExperienceLevel.MidLevel);

    [MaxLength(1000)]
    public string? SkillsRequired { get; set; }

    public int VacancyCount { get; set; } = 1;
    public int ViewCount { get; set; } = 0;
    public int ApplicationsCount { get; set; } = 0;
    public bool IsActive { get; set; } = true;

    public DateTime? Deadline { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public virtual Company Company { get; set; } = null!;
    public virtual User PostedByUser { get; set; } = null!;
    public virtual ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();
}

[Table("Applications")]
public class JobApplication
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid JobId { get; set; }
    public Guid CandidateId { get; set; }

    [MaxLength(500)]
    public string? ResumeUrl { get; set; }

    [MaxLength(5000)]
    public string? CoverLetter { get; set; }

    [MaxLength(500)]
    public string? PortfolioUrl { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal? ExpectedSalary { get; set; }

    [Required, MaxLength(30)]
    public string Status { get; set; } = nameof(ApplicationStatus.Pending);

    public Guid? ReviewedByUserId { get; set; }
    public DateTime? ReviewedAt { get; set; }

    public DateTime AppliedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public virtual JobPosting Job { get; set; } = null!;
    public virtual User Candidate { get; set; } = null!;
    public virtual User? ReviewedByUser { get; set; }
}

// Resume/CV related entities
[Table("Resumes")]
public class Resume
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }

    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? FullName { get; set; }

    [MaxLength(255)]
    public string? Email { get; set; }

    [MaxLength(30)]
    public string? PhoneNumber { get; set; }

    [MaxLength(500)]
    public string? Address { get; set; }

    [MaxLength(2000)]
    public string? Bio { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public virtual User User { get; set; } = null!;
    public virtual ICollection<ResumeExperience> Experiences { get; set; } = new List<ResumeExperience>();
    public virtual ICollection<ResumeEducation> Educations { get; set; } = new List<ResumeEducation>();
    public virtual ICollection<ResumeSkill> Skills { get; set; } = new List<ResumeSkill>();
}

[Table("ResumeExperiences")]
public class ResumeExperience
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ResumeId { get; set; }

    [Required, MaxLength(200)]
    public string Company { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string Position { get; set; } = string.Empty;

    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsCurrent { get; set; } = false;

    [MaxLength(5000)]
    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public virtual Resume Resume { get; set; } = null!;
}

[Table("ResumeEducations")]
public class ResumeEducation
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ResumeId { get; set; }

    [Required, MaxLength(200)]
    public string Institution { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string Degree { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? FieldOfStudy { get; set; }

    public int? GraduationYear { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public virtual Resume Resume { get; set; } = null!;
}

[Table("ResumeSkills")]
public class ResumeSkill
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ResumeId { get; set; }

    [Required, MaxLength(100)]
    public string SkillName { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    public string Proficiency { get; set; } = string.Empty; // Beginner, Intermediate, Advanced, Expert

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public virtual Resume Resume { get; set; } = null!;
}
