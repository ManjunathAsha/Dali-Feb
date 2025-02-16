using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Dali.ImportExportService.Models;

namespace Dali.ImportExportService.Models
{
    public class DocumentSection : BaseEntity
    {
        public int Id { get; set; }
        public int DocumentId { get; set; }
        public int SectionId { get; set; }
        public int OrderIndex { get; set; }

        // Navigation Properties
        public virtual Document Document { get; set; }
        public virtual Section Section { get; set; }
    }
}
