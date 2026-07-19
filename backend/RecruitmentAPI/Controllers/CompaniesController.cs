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
public class CompaniesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CompaniesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/companies - Public
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CompanyDto>>> GetCompanies()
    {
        var companies = await _context.Companies
            .Select(c => new CompanyDto
            {
                Id = c.Id,
                OwnerId = c.OwnerId,
                Name = c.Name,
                Description = c.Description ?? string.Empty,
                Website = c.Website ?? string.Empty,
                Industry = c.Industry ?? string.Empty,
                Size = c.Size ?? string.Empty,
                Location = c.Location ?? string.Empty
            })
            .ToListAsync();

        return Ok(companies);
    }

    // GET: api/companies/{id} - Public
    [HttpGet("{id}")]
    public async Task<ActionResult<CompanyDto>> GetCompany(Guid id)
    {
        var company = await _context.Companies.FindAsync(id);
        if (company == null)
            return NotFound(new { message = "Công ty không tồn tại." });

        return Ok(ToDto(company));
    }

    // POST: api/companies - Employer/Admin only
    [HttpPost]
    [Authorize(Roles = "employer,admin")]
    public async Task<ActionResult<CompanyDto>> CreateCompany([FromBody] CompanyDto createDto)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(new { message = "Token không hợp lệ." });

        // A03:2021 - Sanitize
        var company = new Company
        {
            Name = InputSanitizer.Sanitize(createDto.Name),
            Description = InputSanitizer.SanitizeHtml(createDto.Description),
            Website = InputSanitizer.Sanitize(createDto.Website),
            Industry = InputSanitizer.Sanitize(createDto.Industry),
            Size = InputSanitizer.Sanitize(createDto.Size),
            Location = InputSanitizer.Sanitize(createDto.Location),
            OwnerId = userId.Value,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Companies.Add(company);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCompany), new { id = company.Id }, ToDto(company));
    }

    // PUT: api/companies/{id} - Owner or Admin only
    [HttpPut("{id}")]
    [Authorize(Roles = "employer,admin")]
    public async Task<IActionResult> UpdateCompany(Guid id, [FromBody] CompanyDto updateDto)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(new { message = "Token không hợp lệ." });

        var company = await _context.Companies.FindAsync(id);
        if (company == null)
            return NotFound(new { message = "Công ty không tồn tại." });

        // A01:2021 - Only owner or admin can update
        if (company.OwnerId != userId.Value && !User.IsInRole("admin"))
            return Forbid();

        company.Name = InputSanitizer.Sanitize(updateDto.Name);
        company.Description = InputSanitizer.SanitizeHtml(updateDto.Description);
        company.Website = InputSanitizer.Sanitize(updateDto.Website);
        company.Industry = InputSanitizer.Sanitize(updateDto.Industry);
        company.Size = InputSanitizer.Sanitize(updateDto.Size);
        company.Location = InputSanitizer.Sanitize(updateDto.Location);
        company.UpdatedAt = DateTime.UtcNow;

        _context.Companies.Update(company);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/companies/{id} - Owner or Admin only
    [HttpDelete("{id}")]
    [Authorize(Roles = "employer,admin")]
    public async Task<IActionResult> DeleteCompany(Guid id)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(new { message = "Token không hợp lệ." });

        var company = await _context.Companies.FindAsync(id);
        if (company == null)
            return NotFound(new { message = "Công ty không tồn tại." });

        // A01:2021 - Only owner or admin can delete
        if (company.OwnerId != userId.Value && !User.IsInRole("admin"))
            return Forbid();

        _context.Companies.Remove(company);
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

    private static CompanyDto ToDto(Company c)
    {
        return new CompanyDto
        {
            Id = c.Id,
            OwnerId = c.OwnerId,
            Name = c.Name,
            Description = c.Description ?? string.Empty,
            Website = c.Website ?? string.Empty,
            Industry = c.Industry ?? string.Empty,
            Size = c.Size ?? string.Empty,
            Location = c.Location ?? string.Empty
        };
    }
}
