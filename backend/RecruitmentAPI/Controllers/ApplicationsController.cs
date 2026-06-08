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
public class ApplicationsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ApplicationsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/applications - Admin: all; Employer: own jobs' applications; Candidate: own applications
    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<JobApplicationDto>>> GetApplications()
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized();

        var role = User.FindFirst(ClaimTypes.Role)?.Value;

        IQueryable<JobApplication> query = role switch
        {
            "admin" => _context.JobApplications,
            "employer" => _context.JobApplications.Where(a => a.Job.AuthorId == userId.Value),
            "candidate" => _context.JobApplications.Where(a => a.CandidateId == userId.Value),
            _ => _context.JobApplications.Where(a => a.CandidateId == userId.Value)
        };

        var applications = await query
            .Select(a => ToDto(a))
            .ToListAsync();

        return Ok(applications);
    }

    // GET: api/applications/{id}
    [HttpGet("{id}")]
    [Authorize]
    public async Task<ActionResult<JobApplicationDto>> GetApplication(Guid id)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var application = await _context.JobApplications.FindAsync(id);
        if (application == null)
            return NotFound(new { message = "Đơn ứng tuyển không tồn tại." });

        // A01:2021 - Ownership check: candidate can see own, employer can see their job's applications, admin can see all
        var isAdmin = User.IsInRole("admin");
        if (!isAdmin && application.CandidateId != userId.Value)
        {
            var job = await _context.JobPostings.FindAsync(application.JobId);
            if (job == null || job.AuthorId != userId.Value)
                return Forbid();
        }

        return Ok(ToDto(application));
    }

    // POST: api/applications - Candidate only
    [HttpPost]
    [Authorize(Roles = "candidate,admin")]
    public async Task<ActionResult<JobApplicationDto>> CreateApplication([FromBody] JobApplicationDto createDto)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        // A01:2021 - Verify job exists and is active
        var job = await _context.JobPostings.FirstOrDefaultAsync(j => j.Id == createDto.JobId && j.IsActive);
        if (job == null)
            return BadRequest(new { message = "Tin tuyển dụng không tồn tại hoặc đã đóng." });

        // A01:2021 - Prevent duplicate applications
        var existing = await _context.JobApplications
            .FirstOrDefaultAsync(a => a.JobId == createDto.JobId && a.CandidateId == userId.Value);
        if (existing != null)
            return BadRequest(new { message = "Bạn đã ứng tuyển công việc này rồi." });

        var application = new JobApplication
        {
            JobId = createDto.JobId,
            CandidateId = userId.Value,
            ResumeUrl = InputSanitizer.Sanitize(createDto.ResumeUrl),
            CoverLetter = InputSanitizer.SanitizeHtml(createDto.CoverLetter),
            Status = nameof(ApplicationStatus.Pending),
            AppliedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.JobApplications.Add(application);

        job.ApplicationsCount++;
        _context.JobPostings.Update(job);

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetApplication), new { id = application.Id }, ToDto(application));
    }

    // PATCH: api/applications/{id}/status - Employer (own job) or Admin only
    [HttpPatch("{id}/status")]
    [Authorize(Roles = "employer,admin")]
    public async Task<IActionResult> UpdateApplicationStatus(Guid id, [FromBody] UpdateApplicationStatusDto updateDto)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var application = await _context.JobApplications
            .Include(a => a.Job)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (application == null)
            return NotFound(new { message = "Đơn ứng tuyển không tồn tại." });

        // A01:2021 - Employer can only update applications for their own jobs
        if (!User.IsInRole("admin") && application.Job.AuthorId != userId.Value)
            return Forbid();

        // Validate status
        var validStatuses = new[] { "Pending", "Reviewed", "Shortlisted", "Rejected", "Accepted" };
        var sanitizedStatus = InputSanitizer.Sanitize(updateDto.Status);
        if (!validStatuses.Contains(sanitizedStatus, StringComparer.OrdinalIgnoreCase))
            return BadRequest(new { message = "Trạng thái không hợp lệ." });

        application.Status = sanitizedStatus;
        application.ReviewedByUserId = userId.Value;
        application.ReviewedAt = DateTime.UtcNow;
        application.UpdatedAt = DateTime.UtcNow;

        _context.JobApplications.Update(application);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/applications/{id} - Candidate (own) or Admin only
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteApplication(Guid id)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var application = await _context.JobApplications.FindAsync(id);
        if (application == null)
            return NotFound(new { message = "Đơn ứng tuyển không tồn tại." });

        // A01:2021 - Only the candidate who applied or admin can delete
        if (application.CandidateId != userId.Value && !User.IsInRole("admin"))
            return Forbid();

        _context.JobApplications.Remove(application);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // ===== Helpers =====
    private Guid? GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(claim) || !Guid.TryParse(claim, out var userId))
            return null;
        return userId;
    }

    private static JobApplicationDto ToDto(JobApplication a)
    {
        return new JobApplicationDto
        {
            Id = a.Id,
            JobId = a.JobId,
            CandidateId = a.CandidateId,
            ResumeUrl = a.ResumeUrl ?? string.Empty,
            CoverLetter = a.CoverLetter ?? string.Empty,
            Status = a.Status,
            AppliedAt = a.AppliedAt
        };
    }
}
