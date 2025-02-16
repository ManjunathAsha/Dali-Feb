using System.Collections.Generic;
using System.Threading.Tasks;
using Dali.DocumentService.Application.DTOs.Filter;
using Dali.DocumentService.Application.DTOs.Tree;
using Dali.DocumentService.Application.DTOs.Hierarchy;

namespace Dali.DocumentService.Application.Services;

public interface IDocumentService
{
    Task<SectionTreeResponseDto> GetSectionTreeAsync(int collectionId);
    
    // Updated to accept array of section IDs
    Task<FilterResponseDto> GetFiltersBySectionAsync(int collectionId, int[] sectionIds);
    
    Task<FilterResponseDto> GetAllFiltersAsync(int collectionId);
    
    Task<SectionTreeResponseDto> GetFilteredDocumentsAsync(
        int collectionId, 
        int[] sectionOrders = null, 
        int[] stageOrders = null, 
        int[] locationOrders = null, 
        int[] areaOrders = null, 
        int[] topicOrders = null
    );
} 