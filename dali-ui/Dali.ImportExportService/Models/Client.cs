using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Dali.ImportExportService.Models;


namespace Dali.ImportExportService.Models
{
    [Table("Clients", Schema = "dbo")]
    public class Client : BaseEntity
    {
        public Client()
        {
            DocumentClients = new HashSet<DocumentClient>();
        }

        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(256)]
        public string Name { get; set; }

        [StringLength(1000)]
        public string Description { get; set; }

        [StringLength(50)]
        public string Code { get; set; }

        public int OrderIndex { get; set; }

        public int CollectionId { get; set; }

        [ForeignKey("CollectionId")]
        public virtual Collection Collection { get; set; }

        // Navigation Properties
        public virtual ICollection<DocumentClient> DocumentClients { get; set; }
    }
}
