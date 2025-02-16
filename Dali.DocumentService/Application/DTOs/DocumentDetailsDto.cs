namespace Dali.DocumentService.Application.DTOs
{
    public class FileDto
    {
        public string ExternalId { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string FileType { get; set; }
    }

    public class LinkDto
    {
        public string ExternalId { get; set; }
        public string FileName { get; set; }
        public string Url { get; set; }
    }

    public class LocationDto
    {
        public string Section { get; set; }
        public string Stage { get; set; }
        public string Area { get; set; }
        public string Topic { get; set; }
        public string Subtopic { get; set; }
    }

    public class FileResultDto
    {
        public byte[] Content { get; set; }
        public string ContentType { get; set; }
        public string FileName { get; set; }
    }
} 