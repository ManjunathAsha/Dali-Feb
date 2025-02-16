using System.Collections.Generic;

namespace Dali.DocumentService.Application.DTOs.Tree
{
    public class SectionTreeDto
    {
        public int Sno { get; set; }
        public string Section { get; set; }
        public string Owner { get; set; }
        public List<StageTreeDto> Stages { get; set; } = new();
        public SectionTreeSummaryDto Summary { get; set; }
    }

    public class StageTreeDto
    {
        public string Stage { get; set; }
        public List<LocationAreaTreeDto> Areas { get; set; } = new();
    }

    public class LocationAreaTreeDto
    {
        public string Area { get; set; }
        public List<TopicTreeDto> Topics { get; set; } = new();
    }

    public class TopicTreeDto
    {
        public string Topic { get; set; }
        public List<DocumentTreeDto> Records { get; set; } = new();
    }

    public class DocumentTreeDto
    {
        public int Id { get; set; }
        public string Description  { get; set; }
        public string EnforcementLevel { get; set; }
        public ReferenceTreeDto Link { get; set; }
        public ReferenceTreeDto File { get; set; }
    }

    public class ReferenceTreeDto
    {
        public bool IsPresent { get; set; }
        public string Value { get; set; }
    }

    public class SectionTreeSummaryDto
    {
        public int TotalRecords { get; set; }
        public string Description { get; set; }
    }

    public class SectionTreeResponseDto
    {
        public List<SectionTreeDto> Data { get; set; } = new();
        public int TotalDocumentCount { get; set; }
    }
} 