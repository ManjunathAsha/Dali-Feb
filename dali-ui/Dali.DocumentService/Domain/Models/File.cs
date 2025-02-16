using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dali.DocumentService.Domain.Models
{
    [Table("Files", Schema = "dbo")]
    public class File : BaseEntity
    {
        public File()
        {
            DocumentFiles = new HashSet<DocumentFile>();
        }

        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(256)]
        public string Name { get; set; }

        [Required]
        [StringLength(1000)]
        public string FilePath { get; set; }

        [Required]
        [StringLength(50)]
        public string FileType { get; set; }

        [Required]
        public long Size { get; set; }

        [StringLength(1000)]
        public string Description { get; set; }

        public int OrderIndex { get; set; }

        [StringLength(50)]
        public string ExternalId { get; set; }

        public new bool IsActive { get; set; } = true;

        // Navigation Properties
        public virtual ICollection<DocumentFile> DocumentFiles { get; set; }
    }
}
