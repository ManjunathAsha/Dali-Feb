using Microsoft.EntityFrameworkCore;
using Dali.ImportExportService.Models;
using Dali.ImportExportService.Models.Support;
using Dali.ImportExportService.ChangeRequest;
using File = Dali.ImportExportService.Models.File;

namespace Dali.ImportExportService.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    private readonly string _tenantId;
    private readonly string _userId;

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, string tenantId = "", string userId = "")
        : base(options)
    {
        _tenantId = tenantId;
        _userId = userId;
    }

    public DbSet<Collection> Collections { get; set; }
    public DbSet<CollectionVersion> CollectionVersions { get; set; }
    public DbSet<CollectionMember> CollectionMembers { get; set; }
    public DbSet<CollectionImportHistory> CollectionImportHistory { get; set; }
    public DbSet<Document> Documents { get; set; }
    public DbSet<DocumentVersion> DocumentVersions { get; set; }
    public DbSet<DocumentArea> DocumentAreas { get; set; }
    public DbSet<DocumentClient> DocumentClients { get; set; }
    public DbSet<DocumentEnforcementLevel> DocumentEnforcementLevels { get; set; }
    public DbSet<DocumentExternalMap> DocumentExternalMaps { get; set; }
    public DbSet<DocumentFile> DocumentFiles { get; set; }
    public DbSet<DocumentLabel> DocumentLabels { get; set; }
    public DbSet<DocumentChangeRequest> DocumentChangeRequests { get; set; }
    public DbSet<DocumentReview> DocumentReviews { get; set; }
    public DbSet<DocumentSection> DocumentSections { get; set; }
    public DbSet<DocumentStage> DocumentStages { get; set; }
    public DbSet<DocumentTopic> DocumentTopics { get; set; }
    public DbSet<DocumentSubtopic> DocumentSubtopics { get; set; }
    public DbSet<DocumentLink> DocumentLinks { get; set; }
    public DbSet<DocumentLocation> DocumentLocations { get; set; }
    public DbSet<Area> Areas { get; set; }
    public DbSet<Client> Clients { get; set; }
    public DbSet<File> Files { get; set; }
    public DbSet<Link> Links { get; set; }
    public DbSet<Label> Labels { get; set; }
    public DbSet<Section> Sections { get; set; }
    public DbSet<Stage> Stages { get; set; }
    public DbSet<Topic> Topics { get; set; }
    public DbSet<Subtopic> Subtopics { get; set; }
    public DbSet<Location> Locations { get; set; }
    public DbSet<EnforcementLevel> EnforcementLevels { get; set; }
    public DbSet<CollectionPermissionMatrix> CollectionPermissionMatrix { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Collection relationships
        modelBuilder.Entity<Collection>()
            .HasMany(c => c.Versions)
            .WithOne(v => v.Collection)
            .HasForeignKey(v => v.CollectionId);

        modelBuilder.Entity<Collection>()
            .HasMany(c => c.Members)
            .WithOne(m => m.Collection)
            .HasForeignKey(m => m.CollectionId);

        modelBuilder.Entity<Collection>()
            .HasMany(c => c.ImportHistory)
            .WithOne(h => h.Collection)
            .HasForeignKey(h => h.CollectionId);

        modelBuilder.Entity<Collection>()
            .HasMany(c => c.PermissionMatrix)
            .WithOne(p => p.Collection)
            .HasForeignKey(p => p.CollectionId);

        // Configure Document relationships
        modelBuilder.Entity<Document>()
            .HasMany(d => d.Areas)
            .WithOne(da => da.Document)
            .HasForeignKey(da => da.DocumentId);

        modelBuilder.Entity<Document>()
            .HasMany(d => d.Clients)
            .WithOne(dc => dc.Document)
            .HasForeignKey(dc => dc.DocumentId);

        modelBuilder.Entity<Document>()
            .HasMany(d => d.EnforcementLevels)
            .WithOne(de => de.Document)
            .HasForeignKey(de => de.DocumentId);

        modelBuilder.Entity<Document>()
            .HasMany(d => d.ExternalMaps)
            .WithOne(dm => dm.Document)
            .HasForeignKey(dm => dm.DocumentId);

        modelBuilder.Entity<Document>()
            .HasMany(d => d.Files)
            .WithOne(df => df.Document)
            .HasForeignKey(df => df.DocumentId);

        modelBuilder.Entity<Document>()
            .HasMany(d => d.Labels)
            .WithOne(dl => dl.Document)
            .HasForeignKey(dl => dl.DocumentId);

        modelBuilder.Entity<Document>()
            .HasMany(d => d.ChangeRequests)
            .WithOne(cr => cr.Document)
            .HasForeignKey(cr => cr.DocumentId);

        modelBuilder.Entity<Document>()
            .HasMany(d => d.Reviews)
            .WithOne(r => r.Document)
            .HasForeignKey(r => r.DocumentId);

        // Configure Area relationships
        modelBuilder.Entity<Area>()
            .HasMany(a => a.DocumentAreas)
            .WithOne(da => da.Area)
            .HasForeignKey(da => da.AreaId);

        // Configure Client relationships
        modelBuilder.Entity<Client>()
            .HasMany(c => c.DocumentClients)
            .WithOne(dc => dc.Client)
            .HasForeignKey(dc => dc.ClientId);

        // Configure File relationships
        modelBuilder.Entity<File>()
            .HasMany(f => f.DocumentFiles)
            .WithOne(df => df.File)
            .HasForeignKey(df => df.FileId);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.TenantId = _tenantId;
                    entry.Entity.CreatedBy = _userId;
                    entry.Entity.CreatedDate = DateTime.UtcNow;
                    entry.Entity.IsActive = true;
                    break;

                case EntityState.Modified:
                    entry.Entity.ModifiedBy = _userId;
                    entry.Entity.ModifiedDate = DateTime.UtcNow;
                    break;
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
} 