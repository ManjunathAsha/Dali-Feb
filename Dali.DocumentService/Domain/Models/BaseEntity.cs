using System;
using System.ComponentModel.DataAnnotations;

namespace Dali.DocumentService.Domain.Models
{
    public abstract class BaseEntity
    {
        protected BaseEntity()
        {
            CreatedDate = DateTime.UtcNow;
            IsActive = true;
            TenantId = string.Empty;
            CreatedBy = string.Empty;
            ModifiedBy = string.Empty;
        }

        [Required]
        [StringLength(450)]
        public string TenantId { get; set; }

        [Required]
        public DateTime CreatedDate { get; set; }

        [Required]
        [StringLength(256)]
        public string CreatedBy { get; set; }

        [StringLength(256)]
        public string ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public bool IsActive { get; set; }
    }
}
