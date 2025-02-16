using Microsoft.AspNetCore.Mvc;
using Dali.DocumentService.Application.Services;

namespace Dali.DocumentService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DocumentDetailsController : ControllerBase
    {
        private readonly IDocumentDetailsService _documentDetailsService;

        public DocumentDetailsController(IDocumentDetailsService documentDetailsService)
        {
            _documentDetailsService = documentDetailsService;
        }

        [HttpGet("files/{documentId}")]
        public async Task<IActionResult> GetFiles(string documentId)
        {
            try
            {
                var files = await _documentDetailsService.GetFiles(documentId);
                if (!files.Any())
                    return NotFound(new { message = $"No active files found for document {documentId}" });
                
                return Ok(files);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { message = "An error occurred while retrieving the files", details = ex.Message });
            }
        }

        [HttpGet("links/{documentId}")]
        public async Task<IActionResult> GetLinks(string documentId)
        {
            try
            {
                var links = await _documentDetailsService.GetLinks(documentId);
                if (!links.Any())
                    return NotFound(new { message = $"No active links found for document {documentId}" });
                
                return Ok(links);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { message = "An error occurred while retrieving the links", details = ex.Message });
            }
        }

        [HttpGet("location/{documentId}")]
        public async Task<IActionResult> GetLocation(string documentId)
        {
            var location = await _documentDetailsService.GetLocation(documentId);
            if (location == null)
                return NotFound();
            return Ok(location);
        }

        [HttpGet("files/download/{documentId}/{externalId}")]
        public async Task<IActionResult> DownloadFile(string documentId, string externalId)
        {
            try
            {
                var file = await _documentDetailsService.DownloadFile(documentId, externalId);
                if (file == null)
                    return NotFound(new { message = $"No active file found for document {documentId} with external ID {externalId}" });
                
                return File(file.Content, file.ContentType, file.FileName);
            }
            catch (FileNotFoundException ex)
            {
                return StatusCode(StatusCodes.Status404NotFound, 
                    new { message = "Physical file not found", details = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { message = "An error occurred while downloading the file", details = ex.Message });
            }
        }

        [HttpGet("files/get/{documentId}/{externalId}")]
        public async Task<IActionResult> GetFile(string documentId, string externalId)
        {
            try
            {
                var file = await _documentDetailsService.GetFile(documentId, externalId);
                if (file == null)
                    return NotFound(new { message = $"No active file found for document {documentId} with external ID {externalId}" });
                
                return File(file.Content, file.ContentType, file.FileName);
            }
            catch (FileNotFoundException ex)
            {
                return StatusCode(StatusCodes.Status404NotFound, 
                    new { message = "Physical file not found", details = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { message = "An error occurred while retrieving the file", details = ex.Message });
            }
        }
    }
} 