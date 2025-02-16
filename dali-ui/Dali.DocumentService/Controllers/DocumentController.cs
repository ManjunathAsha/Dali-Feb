using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Dali.DocumentService.Application.Services;
using Dali.DocumentService.Application.DTOs.Tree;
using Dali.DocumentService.Application.DTOs.Hierarchy;
using Dali.DocumentService.Application.DTOs.Filter;

namespace Dali.DocumentService.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]  // Require authentication for all endpoints
public class DocumentController : ControllerBase
{
    private readonly ILogger<DocumentController> _logger;
    private readonly IDocumentService _documentService;

    public DocumentController(
        ILogger<DocumentController> logger,
        IDocumentService documentService)
    {
        _logger = logger;
        _documentService = documentService;
    }

    /// <summary>
    /// Gets the section tree with all hierarchical data for a collection
    /// </summary>
    /// <param name="collectionId">The ID of the collection</param>
    /// <returns>A hierarchical structure of sections, stages, areas, topics and documents</returns>
    [HttpGet("collection/{collectionId}/section-tree")]
    [Authorize(Roles = "Owner,Publisher")]
    [ProducesResponseType(typeof(SectionTreeResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<SectionTreeResponseDto>> GetSectionTree(int collectionId)
    {
        _logger.LogInformation("Getting section tree for collection {CollectionId}", collectionId);
        
        try
        {
            var result = await _documentService.GetSectionTreeAsync(collectionId);
            
            if (result == null)
            {
                _logger.LogWarning("No result returned for collection {CollectionId}", collectionId);
                return NotFound($"No data found for collection {collectionId}");
            }

            if (!result.Data.Any())
            {
                _logger.LogInformation("No sections found for collection {CollectionId}", collectionId);
                return Ok(result); // Return empty result with 200 status
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting section tree for collection {CollectionId}", collectionId);
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new { error = "An error occurred while getting the section tree", details = ex.Message });
        }
    }

 

  

    [HttpGet("collection/{collectionId}/filters")]
    [ProducesResponseType(typeof(FilterResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetAllFilters(int collectionId)
    {
        try
        {
            _logger.LogInformation("Getting all filters for collection {CollectionId}", collectionId);
            var result = await _documentService.GetAllFiltersAsync(collectionId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all filters for collection {CollectionId}", collectionId);
            return BadRequest("Error retrieving filters");
        }
    }

    [HttpGet("collection/{collectionId}/sections/filters")]
    [ProducesResponseType(typeof(FilterResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetFiltersBySection(int collectionId, [FromQuery] int[] sectionIds)
    {
        try
        {
            if (sectionIds == null || !sectionIds.Any())
            {
                _logger.LogWarning("No section IDs provided for collection {CollectionId}", collectionId);
                return BadRequest("At least one section ID must be provided");
            }

            _logger.LogInformation(
                "Getting filters for collection {CollectionId} and sections {SectionIds}", 
                collectionId, 
                string.Join(", ", sectionIds)
            );

            var result = await _documentService.GetFiltersBySectionAsync(collectionId, sectionIds);
            
            if (result == null)
            {
                return NotFound($"No filters found for the specified sections in collection {collectionId}");
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex, 
                "Error getting filters for collection {CollectionId} and sections {SectionIds}", 
                collectionId, 
                string.Join(", ", sectionIds)
            );
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new { error = "An error occurred while retrieving filters", details = ex.Message }
            );
        }
    }

    [HttpGet("collection/{collectionId}/filtered-documents")]
    [Authorize(Roles = "Owner,Publisher,Reader")]
    [ProducesResponseType(typeof(SectionTreeResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<SectionTreeResponseDto>> GetFilteredDocuments(
        int collectionId,
        [FromQuery] int[] sectionOrders = null,
        [FromQuery] int[] stageOrders = null,
        [FromQuery] int[] locationOrders = null,
        [FromQuery] int[] areaOrders = null,
        [FromQuery] int[] topicOrders = null)
    {
        _logger.LogInformation("Getting filtered documents for collection {CollectionId} with filters - " +
            "Section Orders: {SectionOrders}, Stage Orders: {StageOrders}, Location Orders: {LocationOrders}, " +
            "Area Orders: {AreaOrders}, Topic Orders: {TopicOrders}",
            collectionId, sectionOrders, stageOrders, locationOrders, areaOrders, topicOrders);
        
        try
        {
            var result = await _documentService.GetFilteredDocumentsAsync(
                collectionId, sectionOrders, stageOrders, locationOrders, areaOrders, topicOrders);
            
            if (result == null)
            {
                _logger.LogWarning("No result returned for filtered documents in collection {CollectionId}", collectionId);
                return NotFound(new { message = "No data found for the specified collection" });
            }

            if (!result.Data.Any())
            {
                var appliedFilters = new List<string>();
                if (sectionOrders?.Any() == true) appliedFilters.Add("sections");
                if (stageOrders?.Any() == true) appliedFilters.Add("stages");
                if (locationOrders?.Any() == true) appliedFilters.Add("locations");
                if (areaOrders?.Any() == true) appliedFilters.Add("areas");
                if (topicOrders?.Any() == true) appliedFilters.Add("topics");

                var filterMessage = appliedFilters.Any() 
                    ? $"No documents found matching the applied filters: {string.Join(", ", appliedFilters)}"
                    : "No documents found in the collection";

                _logger.LogInformation("No documents found matching filters in collection {CollectionId}", collectionId);
                return NotFound(new { message = filterMessage });
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting filtered documents for collection {CollectionId}", collectionId);
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new { error = "An error occurred while getting filtered documents", details = ex.Message });
        }
    }
} 