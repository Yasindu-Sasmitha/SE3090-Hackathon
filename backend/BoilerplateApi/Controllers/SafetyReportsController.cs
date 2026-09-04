using BoilerplateApi.Dtos;
using BoilerplateApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BoilerplateApi.Controllers
{
    [ApiController, Route("api/[controller]")]
    public class SafetyReportsController : ControllerBase
    {
        private readonly ISafetyReportService _service;
        public SafetyReportsController(ISafetyReportService service) => _service = service;

        [HttpGet] // Public: Anyone can see reports
        public async Task<IEnumerable<SafetyReportDto>> GetAll() => await _service.GetAllAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<SafetyReportDto>> Get(int id)
        {
            var r = await _service.GetByIdAsync(id);
            return r == null ? NotFound() : Ok(r);
        }

        [HttpPost] // Public: Anyone can report a hazard
        public async Task<ActionResult<SafetyReportDto>> Create(CreateSafetyReportDto dto)
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }

        [HttpPut("{id}/status")] // Admin only: Update the status
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatus(int id, UpdateStatusDto dto)
        {
            var ok = await _service.UpdateStatusAsync(id, dto);
            return ok ? NoContent() : NotFound();
        }

        [HttpDelete("{id}")] // Admin only
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _service.DeleteAsync(id);
            return ok ? NoContent() : NotFound();
        }
    }
}