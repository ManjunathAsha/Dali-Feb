using System.Collections.Generic;


namespace Dali.DocumentService.Domain.Models
{
    public class Section : BaseEntity
    {
        public Section()
        {
            Documents = new HashSet<DocumentSection>();
            Topics = new HashSet<Topic>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int OrderIndex { get; set; }
        public string Owner { get; set; }
        public int CollectionId { get; set; }

        // Navigation Properties
        public virtual Collection Collection { get; set; }
        public virtual ICollection<DocumentSection> Documents { get; set; }
        public virtual ICollection<Topic> Topics { get; set; }
    }
}
