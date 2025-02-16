using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Dali.DocumentService.Domain.Models.Support;

namespace Dali.DocumentService.Domain.Models
{
    [Table("Collections", Schema = "dbo")]
    public class Collection : BaseEntity
    {
        public Collection()
        {
            Documents = new HashSet<Document>();
            Members = new HashSet<CollectionMember>();
            Versions = new HashSet<CollectionVersion>();
            Files = new HashSet<File>();
            Links = new HashSet<Link>();
            Labels = new HashSet<Label>();
            Topics = new HashSet<Topic>();
            ImportHistory = new HashSet<CollectionImportHistory>();
            PermissionMatrices = new HashSet<CollectionPermissionMatrix>();
            Sections = new HashSet<Section>();
            Areas = new HashSet<Area>();
            Locations = new HashSet<Location>();
            Clients = new HashSet<Client>();
            EnforcementLevels = new HashSet<EnforcementLevel>();
        }

        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(256)]
        public string Name { get; set; }

        [StringLength(1000)]
        public string Description { get; set; }

        [Required]
        public CollectionType Type { get; set; }

        public int? BaseVersionId { get; set; }

        [Required]
        public CollectionStatus Status { get; set; }

        [Required]
        public int Version { get; set; }

        public bool PublicAccess { get; set; }

        [StringLength(256)]
        public string Manager { get; set; }

        [StringLength(1000)]
        public string Comment { get; set; }

        [StringLength(256)]
        public string PublishedBy { get; set; }

        public DateTime? PublishedDate { get; set; }

        public DateTime? EffectiveDate { get; set; }

        public DateTime? ExpiryDate { get; set; }

        public int? LastPublishedVersion { get; set; }

        public int OrderIndex { get; set; }

        // Navigation Properties
        public virtual ICollection<Document> Documents { get; set; }
        public virtual ICollection<CollectionMember> Members { get; set; }
        public virtual ICollection<CollectionVersion> Versions { get; set; }
        public virtual ICollection<File> Files { get; set; }
        public virtual ICollection<Link> Links { get; set; }
        public virtual ICollection<Label> Labels { get; set; }
        public virtual ICollection<Topic> Topics { get; set; }
        public virtual ICollection<CollectionImportHistory> ImportHistory { get; set; }
        public virtual ICollection<CollectionPermissionMatrix> PermissionMatrices { get; set; }
        public virtual ICollection<Section> Sections { get; set; }
        public virtual ICollection<Area> Areas { get; set; }
        public virtual ICollection<Location> Locations { get; set; }
        public virtual ICollection<Client> Clients { get; set; }
        public virtual ICollection<EnforcementLevel> EnforcementLevels { get; set; }
    }

    public enum CollectionType
    {
        Standard = 0,  // For LIOR
        Project = 1    // For PvE
    }

    public enum CollectionStatus
    {
        Draft = 0,
        Published = 1,
        Archived = 2
    }
}
