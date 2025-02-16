using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Dali.DocumentService.Domain.Models
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
        public virtual ICollection<DocumentLink> DocumentLinks { get; set; } = new List<DocumentLink>();
    }

    public enum LinkType
    {
        Internal = 0,
        External = 1
    }
}
