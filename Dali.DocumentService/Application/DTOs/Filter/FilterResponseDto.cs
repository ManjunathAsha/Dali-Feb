using System.Collections.Generic;

namespace Dali.DocumentService.Application.DTOs.Filter;

public class FilterResponseDto
{
    public List<SectionFilterDto> Sections { get; set; } = new();
    public List<StageFilterDto> Stages { get; set; } = new();
    public List<LocationFilterDto> Locations { get; set; } = new();
    public List<AreaFilterDto> Areas { get; set; } = new();
    public List<TopicFilterDto> Topics { get; set; } = new();
}

public class SectionFilterDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int OrderIndex { get; set; }
}

public class StageFilterDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int OrderIndex { get; set; }
}

public class LocationFilterDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int OrderIndex { get; set; }
}

public class AreaFilterDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int OrderIndex { get; set; }
}

public class TopicFilterDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int OrderIndex { get; set; }
} 