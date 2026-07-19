using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using RecruitmentAPI.Data;
using RecruitmentAPI.DTOs;
using RecruitmentAPI.Models;

namespace RecruitmentAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JobsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public JobsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/jobs - Public endpoint (no auth required)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<JobPostingDto>>> GetJobs()
    {
        var jobs = await _context.JobPostings
            .Include(j => j.Company)
            .Where(j => j.IsActive)
            .OrderByDescending(j => j.CreatedAt)
            .ToListAsync();

        return Ok(jobs.Select(j => ToDto(j)));
    }

    // GET: api/jobs/{id} - Public endpoint
    [HttpGet("{id}")]
    public async Task<ActionResult<JobPostingDto>> GetJob(Guid id)
    {       
        var job = await _context.JobPostings
        .Include(j => j.Company)
        .FirstOrDefaultAsync(j => j.Id == id);
        if (job == null || !job.IsActive)
            return NotFound(new { message = "Tin tuyển dụng không tồn tại." });

        return Ok(ToDto(job));
    }

    // POST: api/jobs - Employer/Admin only
    [HttpPost]
    [Authorize(Roles = "employer,admin")]
    public async Task<ActionResult<JobPostingDto>> CreateJob([FromBody] CreateJobPostingDto createDto)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(new { message = "Token không hợp lệ." });

        // A01:2021 - Verify company ownership
        var company = await _context.Companies.FirstOrDefaultAsync(c => c.Id == createDto.CompanyId && c.OwnerId == userId.Value);
        if (company == null)
        {
            var isAdmin = User.IsInRole("admin");
            if (!isAdmin)
                return Forbid();
        }

        // A03:2021 - Sanitize inputs
        var job = new JobPosting
        {
            Title = InputSanitizer.Sanitize(createDto.Title),
            Description = InputSanitizer.SanitizeHtml(createDto.Description),
            CompanyId = createDto.CompanyId,
            AuthorId = userId.Value,
            SalaryMin = createDto.SalaryMin,
            SalaryMax = createDto.SalaryMax,
            Location = InputSanitizer.Sanitize(createDto.Location),
            JobType = createDto.JobType,
            ExperienceLevel = createDto.ExperienceLevel,
            SkillsRequired = string.Join(",", createDto.SkillsRequired.Select(InputSanitizer.Sanitize)),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.JobPostings.Add(job);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetJob), new { id = job.Id }, ToDto(job));
    }

    // PUT: api/jobs/{id} - Owner or Admin only
    [HttpPut("{id}")]
    [Authorize(Roles = "employer,admin")]
    public async Task<IActionResult> UpdateJob(Guid id, [FromBody] CreateJobPostingDto updateDto)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(new { message = "Token không hợp lệ." });

        // A01:2021 - Check ownership: only the author or admin can update
        var job = await _context.JobPostings.FindAsync(id);
        if (job == null)
            return NotFound(new { message = "Tin tuyển dụng không tồn tại." });

        if (job.AuthorId != userId.Value && !User.IsInRole("admin"))
            return Forbid();

        // A03:2021 - Sanitize
        job.Title = InputSanitizer.Sanitize(updateDto.Title);
        job.Description = InputSanitizer.SanitizeHtml(updateDto.Description);
        job.SalaryMin = updateDto.SalaryMin;
        job.SalaryMax = updateDto.SalaryMax;
        job.Location = InputSanitizer.Sanitize(updateDto.Location);
        job.JobType = updateDto.JobType;
        job.ExperienceLevel = updateDto.ExperienceLevel;
        job.SkillsRequired = string.Join(",", updateDto.SkillsRequired.Select(InputSanitizer.Sanitize));
        job.UpdatedAt = DateTime.UtcNow;

        _context.JobPostings.Update(job);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/jobs/{id} - Owner or Admin only (soft delete)
    [HttpDelete("{id}")]
    [Authorize(Roles = "employer,admin")]
    public async Task<IActionResult> DeleteJob(Guid id)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(new { message = "Token không hợp lệ." });

        // A01:2021 - Check ownership
        var job = await _context.JobPostings.FindAsync(id);
        if (job == null)
            return NotFound(new { message = "Tin tuyển dụng không tồn tại." });

        if (job.AuthorId != userId.Value && !User.IsInRole("admin"))
            return Forbid();

        job.IsActive = false;
        job.UpdatedAt = DateTime.UtcNow;
        _context.JobPostings.Update(job);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // GET: api/jobs/search?q=keyword - Public
    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<JobPostingDto>>> SearchJobs([FromQuery] string? q)
    {
        var query = _context.JobPostings.Where(j => j.IsActive).AsQueryable();

        if (!string.IsNullOrWhiteSpace(q))
        {
            // A03:2021 - Use parameterized EF.Functions.Like (no raw SQL concatenation)
            var sanitizedQ = InputSanitizer.Sanitize(q);
            query = query.Where(j =>
                EF.Functions.Like(j.Title, $"%{sanitizedQ}%") ||
                EF.Functions.Like(j.Description, $"%{sanitizedQ}%") ||
                EF.Functions.Like(j.Location, $"%{sanitizedQ}%")
            );
        }

        var jobs = await query
            .OrderByDescending(j => j.CreatedAt)
            .Select(j => ToDto(j))
            .ToListAsync();

        return Ok(jobs);
    }

    // ===== Helper methods =====

    private Guid? GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(claim) || !Guid.TryParse(claim, out var userId))
            return null;
        return userId;
    }

    private static JobPostingDto ToDto(JobPosting j)
    {
        return new JobPostingDto
        {
            Id = j.Id,
            AuthorId = j.AuthorId,
            Title = j.Title,
            Description = j.Description,
            CompanyId = j.CompanyId,
            CompanyName = j.Company != null ? j.Company.Name : j.CompanyId.ToString(),
            SalaryMin = j.SalaryMin,
            SalaryMax = j.SalaryMax,
            Location = j.Location,
            JobType = j.JobType,
            ExperienceLevel = j.ExperienceLevel,
            SkillsRequired = j.SkillsRequired.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList(),
            ApplicationsCount = j.ApplicationsCount,
            IsActive = j.IsActive,
            CreatedAt = j.CreatedAt
        };
    }
}
