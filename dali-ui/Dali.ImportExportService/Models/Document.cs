using System;
using System.Collections.Generic;
using Dali.ImportExportService.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Dali.ImportExportService.ChangeRequest;

namespace Dali.ImportExportService.Models
{
    [Table("Documents", Schema = "dbo")]
    public class Document : BaseEntity
    {
        public Document()
        {
            Versions = new HashSet<DocumentVersion>();
            Tags = new HashSet<DocumentTag>();
            Areas = new HashSet<DocumentArea>();
            Locations = new HashSet<DocumentLocation>();
            Stages = new HashSet<DocumentStage>();
            Sections = new HashSet<DocumentSection>();
            Topics = new HashSet<DocumentTopic>();
            Subtopics = new HashSet<DocumentSubtopic>();
            Clients = new HashSet<DocumentClient>();
            EnforcementLevels = new HashSet<DocumentEnforcementLevel>();
            ExternalMaps = new HashSet<DocumentExternalMap>();
            ChangeRequests = new HashSet<DocumentChangeRequest>();
            Reviews = new HashSet<DocumentReview>();
            Labels = new HashSet<DocumentLabel>();
            Files = new HashSet<DocumentFile>();
            Links = new HashSet<DocumentLink>();
        }

        public int Id { get; set; }
        public int CollectionId { get; set; }
        public string Title { get; set; }
        public DocumentType Type { get; set; }
        public int VersionId { get; set; }
        public string Description { get; set; }
        public string DescriptionAsHtml { get; set; }
        public string Content { get; set; }
        public DocumentStatus Status { get; set; }
        public int Version { get; set; }
        public int? OrderIndex { get; set; }
        public string Owner { get; set; }

        // Navigation Properties
        public virtual Collection Collection { get; set; }
        public virtual ICollection<DocumentVersion> Versions { get; set; }
        public virtual ICollection<DocumentTag> Tags { get; set; }
        public virtual ICollection<DocumentArea> Areas { get; set; }
        public virtual ICollection<DocumentLocation> Locations { get; set; }
        public virtual ICollection<DocumentStage> Stages { get; set; }
        public virtual ICollection<DocumentSection> Sections { get; set; }
        public virtual ICollection<DocumentTopic> Topics { get; set; }
        public virtual ICollection<DocumentSubtopic> Subtopics { get; set; }
        public virtual ICollection<DocumentClient> Clients { get; set; }
        public virtual ICollection<DocumentEnforcementLevel> EnforcementLevels { get; set; }
        public virtual ICollection<DocumentExternalMap> ExternalMaps { get; set; }
        public virtual ICollection<DocumentChangeRequest> ChangeRequests { get; set; }
        public virtual ICollection<DocumentReview> Reviews { get; set; }
        public virtual ICollection<DocumentLabel> Labels { get; set; }
        public virtual ICollection<DocumentFile> Files { get; set; }
        public virtual ICollection<DocumentLink> Links { get; set; }
    }

    public enum DocumentStatus
    {
        Draft = 0,
        InReview = 1,
        Published = 2,
        Archived = 3,
        Deleted = 4
    }

    public enum DocumentType
    {
        Standard = 0,
        Template = 1,
        Reference = 2,
        ProjectSpecific = 3
    }
}
