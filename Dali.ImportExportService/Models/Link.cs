using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Dali.ImportExportService.Models;

namespace Dali.ImportExportService.Models
{
    [Table("Links", Schema = "dbo")]
    public class Link : BaseEntity
    {
        public Link()
        {
            DocumentLinks = new HashSet<DocumentLink>();
        }

        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(256)]
        public string Title { get; set; }

        [Required]
        [StringLength(1000)]
        public string Url { get; set; }

        [StringLength(1000)]
        public string Description { get; set; }

        public int OrderIndex { get; set; }

        [Required]
        public LinkType Type { get; set; }

        [StringLength(50)]
        public string ExternalId { get; set; }

        // Navigation Properties
        public virtual ICollection<DocumentLink> DocumentLinks { get; set; }
    }

    public enum LinkType
    {
        Internal = 0,
        External = 1
    }
}
