using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Dali.DocumentService.Application.DTOs.Tree;
using Dali.DocumentService.Application.DTOs.Hierarchy;
using Dali.DocumentService.Application.DTOs.Filter;
using Dali.DocumentService.Infrastructure.Data;
using Dali.DocumentService.Domain.Models;
using System.Runtime.CompilerServices;

namespace Dali.DocumentService.Application.Services
{
  
 public static class AsyncEnumerableExtensions
    {
        public static async IAsyncEnumerable<List<T>> Buffer<T>(this IAsyncEnumerable<T> source, int bufferSize)
        {
            var buffer = new List<T>(bufferSize);
            await foreach (var item in source)
            {
                buffer.Add(item);
                if (buffer.Count == bufferSize)
                {
                    yield return buffer;
                    buffer = new List<T>(bufferSize);
                }
            }
            if (buffer.Count > 0)
            {
                yield return buffer;
            }
        }
    }

    public class DocumentService : IDocumentService
    {
        private readonly ILogger<DocumentService> _logger;
        private readonly ApplicationDbContext _context;

        public DocumentService(
            ILogger<DocumentService> logger,
            ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<SectionTreeResponseDto> GetSectionTreeAsync(int collectionId)
        {
            try
            {
                _logger.LogInformation("Getting section tree for collection {CollectionId}", collectionId);

                // First get the stage ordering
                var stageOrdering = await _context.Stages
                    .Where(s => s.IsActive && s.CollectionId == collectionId)
                    .OrderBy(s => s.OrderIndex)
                    .Select(s => s.Name)
                    .ToListAsync();

                // Get documents with their relationships
                var documents = await _context.Documents
                    .Where(d => d.CollectionId == collectionId && d.IsActive)
                    .Select(d => new
                    {
                        Id = d.Id,
                        Description = d.Description,
                        SectionId = d.Sections.Where(s => s.IsActive).Select(s => s.Section.Id).FirstOrDefault(),
                        SectionName = d.Sections.Where(s => s.IsActive).Select(s => s.Section.Name).FirstOrDefault(),
                        SectionOrder = d.Sections.Where(s => s.IsActive).Select(s => s.Section.OrderIndex).FirstOrDefault(),
                        SectionOwner = d.Sections.Where(s => s.IsActive).Select(s => s.Section.Owner).FirstOrDefault(),
                        Stage = d.Stages.Where(s => s.IsActive).Select(s => new { 
                            Name = s.Stage.Name,
                            OrderIndex = s.Stage.OrderIndex
                        }).FirstOrDefault(),
                        Location = d.Locations.Where(l => l.IsActive).Select(l => l.Location.Name).FirstOrDefault() ?? "Unknown",
                        Area = d.Areas.Where(a => a.IsActive).Select(a => a.Area.Name).FirstOrDefault() ?? "Unknown",
                        Topic = d.Topics.Where(t => t.IsActive).Select(t => t.Topic.Name).FirstOrDefault() ?? "",
                        Subtopic = d.Subtopics.Where(s => s.IsActive).Select(s => s.Subtopic.Name).FirstOrDefault(),
                        EnforcementLevel = d.EnforcementLevels.Select(el => el.EnforcementLevel.Name).FirstOrDefault(),
                        Links = d.Links.Where(l => l.IsActive).Select(l => new {
                            ExternalId = l.Link.ExternalId
                        }).ToList(),
                        Files = d.Files.Where(f => f.IsActive).Select(f => new {
                            ExternalId = f.File.ExternalId
                        }).ToList()
                    })
                    .AsNoTracking()
                    .ToListAsync();

                _logger.LogInformation("Retrieved {Count} documents for collection {CollectionId}", documents.Count(), collectionId);

                if (!documents.Any())
                {
                    _logger.LogWarning("No documents found for collection {CollectionId}", collectionId);
                    return new SectionTreeResponseDto
                    {
                        Data = new List<SectionTreeDto>(),
                        TotalDocumentCount = 0
                    };
                }

                // Group by sections
                var sections = documents
                    .Where(d => d.SectionId != 0)
                    .GroupBy(d => new { d.SectionId, d.SectionName, d.SectionOrder, d.SectionOwner })
                    .OrderBy(g => g.Key.SectionOrder)
                    .ToList();

                _logger.LogInformation("Found {Count} sections for collection {CollectionId}", sections.Count, collectionId);

                var response = new SectionTreeResponseDto
                {
                    Data = new List<SectionTreeDto>(),
                    TotalDocumentCount = documents.Count
                };

                foreach (var section in sections)
                {
                    try
                    {
                        // Update the stages ordering to use database order
                        var stageNames = section
                            .Select(d => d.Stage?.Name)
                            .Where(s => !string.IsNullOrEmpty(s))
                            .Distinct()
                            .OrderBy(s => stageOrdering.IndexOf(s))
                            .ToList();

                        _logger.LogInformation("Processing section {SectionId} with {StageCount} stages", section.Key.SectionId, stageNames.Count);

                        var sectionDto = new SectionTreeDto
                        {
                            Sno = section.Key.SectionOrder,
                            Section = $"{section.Key.SectionOrder}. {section.Key.SectionName}",
                            Owner = section.Key.SectionOwner ?? string.Empty,
                            Stages = stageNames.Select(stage => new StageTreeDto
                            {
                                Stage = stage,
                                Areas = section
                                    .Where(d => d.Stage?.Name == stage)
                                    .Select(d => new { Location = d.Location ?? "Unknown", Area = d.Area ?? "Unknown" })
                                    .Distinct()
                                    .OrderBy(a => a.Location)
                                    .ThenBy(a => a.Area)
                                    .Select(a => new LocationAreaTreeDto
                                    {
                                        Area = $"{a.Location}-{a.Area}",
                                        Topics = section
                                            .Where(d => d.Stage?.Name == stage && 
                                                       d.Location == a.Location && 
                                                       d.Area == a.Area)
                                            .GroupBy(d => new { Topic = d.Topic, Subtopic = d.Subtopic })
                                            .OrderBy(g => g.Key.Topic)
                                            .Select(g => new TopicTreeDto
                                            {
                                                Topic = string.IsNullOrEmpty(g.Key.Subtopic) 
                                                    ? g.Key.Topic 
                                                    : $"{g.Key.Topic}-{g.Key.Subtopic}",
                                                Records = g.OrderBy(d => d.Id)
                                                    .Select(d => new DocumentTreeDto
                                                    {
                                                        Id = d.Id,
                                                        Description = d.Description,
                                                        EnforcementLevel = d.EnforcementLevel ?? string.Empty,
                                                        Link = new ReferenceTreeDto
                                                        {
                                                            IsPresent = d.Links != null && d.Links.Any(),
                                                            Value = d.Links != null && d.Links.Any() 
                                                                ? string.Join(", ", d.Links.Select(l => 
                                                                    !string.IsNullOrEmpty(l.ExternalId) ? l.ExternalId : ""))
                                                                : string.Empty
                                                        },
                                                        File = new ReferenceTreeDto
                                                        {
                                                            IsPresent = d.Files != null && d.Files.Any(),
                                                            Value = d.Files != null && d.Files.Any() 
                                                                ? string.Join(", ", d.Files.Select(f => 
                                                                    !string.IsNullOrEmpty(f.ExternalId) ? f.ExternalId : ""))
                                                                : string.Empty
                                                        }
                                                    })
                                                    .ToList()
                                            }).ToList()
                                    }).ToList()
                            }).ToList(),
                            Summary = new SectionTreeSummaryDto
                            {
                                TotalRecords = section.Count(),
                                Description = $"Total {section.Count()} records in section {section.Key.SectionName}"
                            }
                        };

                        response.Data.Add(sectionDto);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error processing section {SectionId}", section.Key.SectionId);
                        // Continue processing other sections
                        continue;
                    }
                }

                _logger.LogInformation("Successfully retrieved section tree for collection {CollectionId} with {TotalCount} total documents", 
                    collectionId, response.TotalDocumentCount);

                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting section tree for collection {CollectionId}", collectionId);
                throw;
            }
        }

    
    

    

        public async Task<FilterResponseDto> GetFiltersBySectionAsync(int collectionId, int[] sectionIds)
        {
            try
            {
                _logger.LogInformation("Getting filters for collection {CollectionId} and sections {SectionIds}", 
                    collectionId, string.Join(", ", sectionIds));

                var response = new FilterResponseDto();

                // Get documents for selected sections
                var documentIds = await _context.DocumentSections
                    .Where(ds => sectionIds.Contains(ds.SectionId) && ds.IsActive)
                    .Select(ds => ds.DocumentId)
                    .Distinct()
                    .ToListAsync();

                // Get distinct topics with their first occurrence's orderIndex
                response.Topics = await _context.DocumentTopics
                    .Where(dt => documentIds.Contains(dt.DocumentId) && dt.IsActive)
                    .Select(dt => new
                    {
                        dt.Topic.Id,
                        dt.Topic.Name,
                        dt.Topic.OrderIndex
                    })
                    .Distinct()
                    .GroupBy(t => t.Name) // Group by topic name to get distinct topics
                    .Select(g => new TopicFilterDto
                    {
                        Id = g.First().Id,
                        Name = g.Key, // Use the topic name as the key
                        OrderIndex = g.Min(t => t.OrderIndex) // Use the minimum orderIndex for each distinct topic
                    })
                    .OrderBy(t => t.OrderIndex)
                    .ToListAsync();

                // Similarly for other filters...
                // Get sections
                response.Sections = await _context.Sections
                    .Where(s => sectionIds.Contains(s.Id) && s.IsActive)
                    .Select(s => new SectionFilterDto
                    {
                        Id = s.Id,
                        Name = s.Name,
                        OrderIndex = s.OrderIndex
                    })
                    .OrderBy(s => s.OrderIndex)
                    .ToListAsync();

                // Get stages
                response.Stages = await _context.DocumentStages
                    .Where(ds => documentIds.Contains(ds.DocumentId) && ds.IsActive)
                    .Select(ds => new StageFilterDto
                    {
                        Id = ds.Stage.Id,
                        Name = ds.Stage.Name,
                        OrderIndex = ds.Stage.OrderIndex
                    })
                    .Distinct()
                    .OrderBy(s => s.OrderIndex)
                    .ToListAsync();

                // Get locations
                response.Locations = await _context.DocumentLocations
                    .Where(dl => documentIds.Contains(dl.DocumentId) && dl.IsActive)
                    .Select(dl => new LocationFilterDto
                    {
                        Id = dl.Location.Id,
                        Name = dl.Location.Name,
                        OrderIndex = dl.Location.OrderIndex
                    })
                    .Distinct()
                    .OrderBy(l => l.OrderIndex)
                    .ToListAsync();

                // Get areas
                response.Areas = await _context.DocumentAreas
                    .Where(da => documentIds.Contains(da.DocumentId) && da.IsActive)
                    .Select(da => new AreaFilterDto
                    {
                        Id = da.Area.Id,
                        Name = da.Area.Name,
                        OrderIndex = da.Area.OrderIndex
                    })
                    .Distinct()
                    .OrderBy(a => a.OrderIndex)
                    .ToListAsync();

                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting filters for collection {CollectionId} and sections {SectionIds}", 
                    collectionId, string.Join(", ", sectionIds));
                throw;
            }
        }

        public async Task<FilterResponseDto> GetAllFiltersAsync(int collectionId)
        {
            try
            {
                _logger.LogInformation("Getting all filters for collection {CollectionId}", collectionId);

                var response = new FilterResponseDto();

                // Get all sections
                response.Sections = await _context.Sections
                    .Where(s => s.CollectionId == collectionId && s.IsActive)
                    .Select(s => new SectionFilterDto
                    {
                        Id = s.Id,
                        Name = s.Name,
                        OrderIndex = s.OrderIndex
                    })
                    .OrderBy(s => s.OrderIndex)
                    .ToListAsync();

                // Get all stages
                response.Stages = await _context.Stages
                    .Where(s => s.CollectionId == collectionId && s.IsActive)
                    .Select(s => new StageFilterDto
                    {
                        Id = s.Id,
                        Name = s.Name,
                        OrderIndex = s.OrderIndex
                    })
                    .OrderBy(s => s.OrderIndex)
                    .ToListAsync();

                // Get all locations
                response.Locations = await _context.Locations
                    .Where(l => l.CollectionId == collectionId && l.IsActive)
                    .Select(l => new LocationFilterDto
                    {
                        Id = l.Id,
                        Name = l.Name,
                        OrderIndex = l.OrderIndex
                    })
                    .OrderBy(l => l.OrderIndex)
                    .ToListAsync();

                // Get all areas
                response.Areas = await _context.Areas
                    .Where(a => a.CollectionId == collectionId && a.IsActive)
                    .Select(a => new AreaFilterDto
                    {
                        Id = a.Id,
                        Name = a.Name,
                        OrderIndex = a.OrderIndex
                    })
                    .OrderBy(a => a.OrderIndex)
                    .ToListAsync();

                // Get distinct topics with their first occurrence's orderIndex
        response.Topics = await _context.Topics
            .Where(t => t.CollectionId == collectionId && t.IsActive)
            .Select(t => new
            {
                t.Id,
                t.Name,
                t.OrderIndex
            })
            .Distinct()
            .GroupBy(t => t.Name) // Group by topic name to get distinct topics
            .Select(g => new TopicFilterDto
            {
                Id = g.First().Id,
                Name = g.Key, // Use the topic name as the key
                OrderIndex = g.Min(t => t.OrderIndex) // Use the minimum orderIndex for each distinct topic
            })
            .OrderBy(t => t.OrderIndex)
            .ToListAsync();

        return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all filters for collection {CollectionId}", collectionId);
                throw;
            }
        }

        public async Task<SectionTreeResponseDto> GetFilteredDocumentsAsync(int collectionId, int[] sectionOrders = null, int[] stageOrders = null, int[] locationOrders = null, int[] areaOrders = null, int[] topicOrders = null)
        {
            try
            {
                _logger.LogInformation("Getting filtered documents for collection {CollectionId}", collectionId);

                // Get stage ordering once and cache it
                var stageOrdering = await _context.Stages
                    .AsNoTracking()
                    .Where(s => s.IsActive && s.CollectionId == collectionId)
                    .OrderBy(s => s.OrderIndex)
                    .Select(s => new { s.Name, s.OrderIndex })
                    .ToListAsync();

                // Build optimized base query
                var query = _context.Documents
                    .AsNoTracking()
                    .Where(d => d.CollectionId == collectionId && d.IsActive)
                    .Select(d => new
                    {
                        d.Id,
                        d.Description,
                        Section = d.Sections
                            .Where(s => s.IsActive)
                            .Select(s => new
                            {
                                s.Section.Id,
                                s.Section.Name,
                                s.Section.OrderIndex,
                                s.Section.Owner
                            })
                            .FirstOrDefault(),
                        Stage = d.Stages
                            .Where(s => s.IsActive)
                            .Select(s => new
                            {
                                s.Stage.Name,
                                s.Stage.OrderIndex
                            })
                            .FirstOrDefault(),
                        Location = d.Locations
                            .Where(l => l.IsActive)
                            .Select(l => new
                            {
                                l.Location.Name,
                                l.Location.OrderIndex
                            })
                            .FirstOrDefault(),
                        Area = d.Areas
                            .Where(a => a.IsActive)
                            .Select(a => new
                            {
                                a.Area.Name,
                                a.Area.OrderIndex
                            })
                            .FirstOrDefault(),
                        Topic = d.Topics
                            .Where(t => t.IsActive)
                            .Select(t => new
                            {
                                t.Topic.Name,
                                t.Topic.OrderIndex
                            })
                            .FirstOrDefault(),
                        Subtopic = d.Subtopics
                            .Where(s => s.IsActive)
                            .Select(s => s.Subtopic.Name)
                            .FirstOrDefault(),
                        EnforcementLevel = d.EnforcementLevels
                            .Select(el => el.EnforcementLevel.Name)
                            .FirstOrDefault(),
                        Links = d.Links
                            .Where(l => l.IsActive)
                            .Select(l => l.Link.ExternalId)
                            .ToList(),
                        Files = d.Files
                            .Where(f => f.IsActive)
                            .Select(f => f.File.ExternalId)
                            .ToList()
                    });

                // Apply filters efficiently
                if (sectionOrders?.Any() == true)
                {
                    var sectionOrdersSet = sectionOrders.ToHashSet();
                    query = query.Where(d => d.Section != null && sectionOrdersSet.Contains(d.Section.OrderIndex));
                }
                if (stageOrders?.Any() == true)
                {
                    var stageOrdersSet = stageOrders.ToHashSet();
                    query = query.Where(d => d.Stage != null && stageOrdersSet.Contains(d.Stage.OrderIndex));
                }
                if (locationOrders?.Any() == true)
                {
                    var locationOrdersSet = locationOrders.ToHashSet();
                    query = query.Where(d => d.Location != null && locationOrdersSet.Contains(d.Location.OrderIndex));
                }
                if (areaOrders?.Any() == true)
                {
                    var areaOrdersSet = areaOrders.ToHashSet();
                    query = query.Where(d => d.Area != null && areaOrdersSet.Contains(d.Area.OrderIndex));
                }
                if (topicOrders?.Any() == true)
                {
                    var topicOrdersSet = topicOrders.ToHashSet();
                    query = query.Where(d => d.Topic != null && topicOrdersSet.Contains(d.Topic.OrderIndex));
                }

                // Execute the optimized query
                var documents = await query.ToListAsync();

                if (!documents.Any())
                {
                    return new SectionTreeResponseDto
                    {
                        Data = new List<SectionTreeDto>(),
                        TotalDocumentCount = 0
                    };
                }

                // Process results in memory for better performance
                var filteredSections = documents
                    .Where(d => d.Section != null)
                    .GroupBy(d => new
                    {
                        SectionId = d.Section.Id,
                        SectionName = d.Section.Name,
                        SectionOrder = d.Section.OrderIndex,
                        SectionOwner = d.Section.Owner
                    })
                    .OrderBy(g => g.Key.SectionOrder)
                    .ToList();

                var response = new SectionTreeResponseDto
                {
                    Data = new List<SectionTreeDto>(),
                    TotalDocumentCount = documents.Count
                };

                foreach (var section in filteredSections)
                {
                    var stageNames = section
                        .Where(d => d.Stage != null)
                        .Select(d => d.Stage.Name)
                        .Distinct()
                        .OrderBy(s => stageOrdering.FirstOrDefault(so => so.Name == s)?.OrderIndex ?? int.MaxValue)
                        .ToList();

                    var sectionDto = new SectionTreeDto
                    {
                        Sno = section.Key.SectionOrder,
                        Section = $"{section.Key.SectionOrder}. {section.Key.SectionName}",
                        Owner = section.Key.SectionOwner ?? string.Empty,
                        Stages = stageNames.Select(stage => new StageTreeDto
                        {
                            Stage = stage,
                            Areas = section
                                .Where(d => d.Stage?.Name == stage)
                                .Select(d => new { 
                                    Location = d.Location?.Name ?? "Unknown", 
                                    Area = d.Area?.Name ?? "Unknown",
                                    LocationOrder = d.Location?.OrderIndex ?? int.MaxValue,
                                    AreaOrder = d.Area?.OrderIndex ?? int.MaxValue
                                })
                                .Distinct()
                                .OrderBy(a => a.LocationOrder)
                                .ThenBy(a => a.AreaOrder)
                                .Select(a => new LocationAreaTreeDto
                                {
                                    Area = $"{a.Location}-{a.Area}",
                                    Topics = section
                                        .Where(d => d.Stage?.Name == stage &&
                                                   d.Location?.Name == a.Location &&
                                                   d.Area?.Name == a.Area)
                                        .GroupBy(d => new { Topic = d.Topic?.Name, Subtopic = d.Subtopic })
                                        .OrderBy(g => g.Key.Topic)
                                        .Select(g => new TopicTreeDto
                                        {
                                            Topic = string.IsNullOrEmpty(g.Key.Subtopic)
                                                ? g.Key.Topic
                                                : $"{g.Key.Topic}-{g.Key.Subtopic}",
                                            Records = g.OrderBy(d => d.Id)
                                                .Select(d => new DocumentTreeDto
                                                {
                                                    Id = d.Id,
                                                    Description = d.Description,
                                                    EnforcementLevel = d.EnforcementLevel ?? string.Empty,
                                                    Link = new ReferenceTreeDto
                                                    {
                                                        IsPresent = d.Links.Any(),
                                                        Value = d.Links.Any()
                                                            ? string.Join(", ", d.Links)
                                                            : string.Empty
                                                    },
                                                    File = new ReferenceTreeDto
                                                    {
                                                        IsPresent = d.Files.Any(),
                                                        Value = d.Files.Any()
                                                            ? string.Join(", ", d.Files)
                                                            : string.Empty
                                                    }
                                                })
                                                .ToList()
                                        }).ToList()
                                }).ToList()
                        }).ToList(),
                        Summary = new SectionTreeSummaryDto
                        {
                            TotalRecords = section.Count(),
                            Description = $"Total {section.Count()} records in section {section.Key.SectionName}"
                        }
                    };

                    response.Data.Add(sectionDto);
                }

                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting filtered documents for collection {CollectionId}", collectionId);
                throw;
            }
        }
    }
} 