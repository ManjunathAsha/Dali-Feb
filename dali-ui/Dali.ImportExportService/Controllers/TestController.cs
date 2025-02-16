using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Dali.ImportExportService.Controllers;

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]
public class TestController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok("Import Export Service is running!");
    }
} 