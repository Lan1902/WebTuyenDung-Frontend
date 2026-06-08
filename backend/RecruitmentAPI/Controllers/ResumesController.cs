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
[Authorize(Roles = "candidate,admin")] // Only candidates and admins can manage resumes
public class ResumesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ResumesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/resumes - Get all resumes for the authenticated user
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ResumeDto>>> GetUserResumes()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var resumes = await _context.Resumes
            .Where(r => r.UserId == userId.Value)
            .Include(r => r.Experiences)
            .Include(r => r.Educations)
            .Include(r => r.Skills)
            .Select(r => ToDto(r))
            .ToListAsync();

        return Ok(resumes);
    }

    // GET: api/resumes/{id} - Get a specific resume by ID
    [HttpGet("{id}")]
    public async Task<ActionResult<ResumeDto>> GetResume(Guid id)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var resume = await _context.Resumes
            .Include(r => r.Experiences)
            .Include(r => r.Educations)
            .Include(r => r.Skills)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (resume == null) return NotFound(new { message = "Resume not found." });

        // A01:2021 - Ownership check
        if (resume.UserId != userId.Value && !User.IsInRole("admin"))
        { 
            return Forbid();
        }

        return Ok(ToDto(resume));
    }

    // POST: api/resumes - Create a new resume
    [HttpPost]
    public async Task<ActionResult<ResumeDto>> CreateResume([FromBody] CreateResumeDto createDto)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        // A03:2021 - Sanitize inputs
        var resume = new Resume
        {
            Id = Guid.NewGuid(),
            UserId = userId.Value,
            Title = InputSanitizer.Sanitize(createDto.Title),
            FullName = InputSanitizer.Sanitize(createDto.FullName),
            Email = InputSanitizer.Sanitize(createDto.Email),
            PhoneNumber = InputSanitizer.Sanitize(createDto.PhoneNumber),
            Address = InputSanitizer.Sanitize(createDto.Address),
            Bio = InputSanitizer.SanitizeHtml(createDto.Bio),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        foreach (var expDto in createDto.Experiences)
        {
            resume.Experiences.Add(new ResumeExperience
            {
                Id = Guid.NewGuid(),
                Company = InputSanitizer.Sanitize(expDto.Company),
                Position = InputSanitizer.Sanitize(expDto.Position),
                StartDate = expDto.StartDate,
                EndDate = expDto.EndDate,
                IsCurrent = expDto.IsCurrent,
                Description = InputSanitizer.SanitizeHtml(expDto.Description),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
        }

        foreach (var eduDto in createDto.Educations)
        {
            resume.Educations.Add(new ResumeEducation
            {
                Id = Guid.NewGuid(),
                Institution = InputSanitizer.Sanitize(eduDto.Institution),
                Degree = InputSanitizer.Sanitize(eduDto.Degree),
                FieldOfStudy = InputSanitizer.Sanitize(eduDto.FieldOfStudy),
                GraduationYear = eduDto.GraduationYear,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
        }

        foreach (var skillDto in createDto.Skills)
        {
            resume.Skills.Add(new ResumeSkill
            {
                Id = Guid.NewGuid(),
                SkillName = InputSanitizer.Sanitize(skillDto.SkillName),
                Proficiency = InputSanitizer.Sanitize(skillDto.Proficiency),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
        }

        _context.Resumes.Add(resume);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetResume), new { id = resume.Id }, ToDto(resume));
    }

    // PUT: api/resumes/{id} - Update an existing resume
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateResume(Guid id, [FromBody] CreateResumeDto updateDto)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var resume = await _context.Resumes
            .Include(r => r.Experiences)
            .Include(r => r.Educations)
            .Include(r => r.Skills)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (resume == null) return NotFound(new { message = "Resume not found." });

        // A01:2021 - Ownership check
        if (resume.UserId != userId.Value && !User.IsInRole("admin"))
        { 
            return Forbid();
        }

        // A03:2021 - Sanitize inputs and update properties
        resume.Title = InputSanitizer.Sanitize(updateDto.Title);
        resume.FullName = InputSanitizer.Sanitize(updateDto.FullName);
        resume.Email = InputSanitizer.Sanitize(updateDto.Email);
        resume.PhoneNumber = InputSanitizer.Sanitize(updateDto.PhoneNumber);
        resume.Address = InputSanitizer.Sanitize(updateDto.Address);
        resume.Bio = InputSanitizer.SanitizeHtml(updateDto.Bio);
        resume.UpdatedAt = DateTime.UtcNow;

        // Update Experiences
        _context.ResumeExperiences.RemoveRange(resume.Experiences);
        foreach (var expDto in updateDto.Experiences)
        {
            resume.Experiences.Add(new ResumeExperience
            {
                Id = Guid.NewGuid(),
                Company = InputSanitizer.Sanitize(expDto.Company),
                Position = InputSanitizer.Sanitize(expDto.Position),
                StartDate = expDto.StartDate,
                EndDate = expDto.EndDate,
                IsCurrent = expDto.IsCurrent,
                Description = InputSanitizer.SanitizeHtml(expDto.Description),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
        }

        // Update Educations
        _context.ResumeEducations.RemoveRange(resume.Educations);
        foreach (var eduDto in updateDto.Educations)
        {
            resume.Educations.Add(new ResumeEducation
            {
                Id = Guid.NewGuid(),
                Institution = InputSanitizer.Sanitize(eduDto.Institution),
                Degree = InputSanitizer.Sanitize(eduDto.Degree),
                FieldOfStudy = InputSanitizer.Sanitize(eduDto.FieldOfStudy),
                GraduationYear = eduDto.GraduationYear,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
        }

        // Update Skills
        _context.ResumeSkills.RemoveRange(resume.Skills);
        foreach (var skillDto in updateDto.Skills)
        {
            resume.Skills.Add(new ResumeSkill
            {
                Id = Guid.NewGuid(),
                SkillName = InputSanitizer.Sanitize(skillDto.SkillName),
                Proficiency = InputSanitizer.Sanitize(skillDto.Proficiency),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
        }

        _context.Resumes.Update(resume);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/resumes/{id} - Delete a resume
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteResume(Guid id)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var resume = await _context.Resumes.FindAsync(id);

        if (resume == null) return NotFound(new { message = "Resume not found." });

        // A01:2021 - Ownership check
        if (resume.UserId != userId.Value && !User.IsInRole("admin"))
        { 
            return Forbid();
        }

        _context.Resumes.Remove(resume);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private Guid? GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(claim) || !Guid.TryParse(claim, out var userId))
            return null;
        return userId;
    }

    private static ResumeDto ToDto(Resume resume)
    {
        return new ResumeDto
        {
            Id = resume.Id,
            UserId = resume.UserId,
            Title = resume.Title,
            FullName = resume.FullName ?? string.Empty,
            Email = resume.Email ?? string.Empty,
            PhoneNumber = resume.PhoneNumber ?? string.Empty,
            Address = resume.Address ?? string.Empty,
            Bio = resume.Bio ?? string.Empty,
            CreatedAt = resume.CreatedAt,
            UpdatedAt = resume.UpdatedAt,
            Experiences = resume.Experiences.Select(exp => new ResumeExperienceDto
            {
                Id = exp.Id,
                Company = exp.Company,
                Position = exp.Position,
                StartDate = exp.StartDate,
                EndDate = exp.EndDate,
                IsCurrent = exp.IsCurrent,
                Description = exp.Description
            }).ToList(),
            Educations = resume.Educations.Select(edu => new ResumeEducationDto
            {
                Id = edu.Id,
                Institution = edu.Institution,
                Degree = edu.Degree,
                FieldOfStudy = edu.FieldOfStudy,
                GraduationYear = edu.GraduationYear
            }).ToList(),
            Skills = resume.Skills.Select(skill => new ResumeSkillDto
            {
                Id = skill.Id,
                SkillName = skill.SkillName,
                Proficiency = skill.Proficiency
            }).ToList()
        };
    }
}