using Microsoft.EntityFrameworkCore;
using Dali.DocumentService.Domain.Models;
using File = Dali.DocumentService.Domain.Models.File;

namespace Dali.DocumentService.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Document> Documents { get; set; }
    public DbSet<DocumentVersion> DocumentVersions { get; set; }
    public DbSet<DocumentTopic> DocumentTopics { get; set; }
    public DbSet<DocumentTag> DocumentTags { get; set; }
    public DbSet<DocumentSubtopic> DocumentSubtopics { get; set; }
    public DbSet<DocumentStage> DocumentStages { get; set; }
    public DbSet<DocumentSection> DocumentSections { get; set; }
    public DbSet<DocumentReview> DocumentReviews { get; set; }
    public DbSet<DocumentLocation> DocumentLocations { get; set; }
    public DbSet<DocumentLink> DocumentLinks { get; set; }
    public DbSet<DocumentLabel> DocumentLabels { get; set; }
    public DbSet<DocumentFile> DocumentFiles { get; set; }
    public DbSet<DocumentArea> DocumentAreas { get; set; }
    public DbSet<Topic> Topics { get; set; }
    public DbSet<Subtopic> Subtopics { get; set; }
    public DbSet<Stage> Stages { get; set; }
    public DbSet<Section> Sections { get; set; }
    public DbSet<Location> Locations { get; set; }
    public DbSet<Link> Links { get; set; }
    public DbSet<Label> Labels { get; set; }
    public DbSet<File> Files { get; set; }
    public DbSet<Area> Areas { get; set; }
    public DbSet<EnforcementLevel> EnforcementLevels { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Document relationships through junction tables
        modelBuilder.Entity<DocumentSection>()
            .HasOne(ds => ds.Document)
            .WithMany(d => d.Sections)
            .HasForeignKey(ds => ds.DocumentId);

        modelBuilder.Entity<DocumentSection>()
            .HasOne(ds => ds.Section)
            .WithMany()
            .HasForeignKey(ds => ds.SectionId);

        modelBuilder.Entity<DocumentStage>()
            .HasOne(ds => ds.Document)
            .WithMany(d => d.Stages)
            .HasForeignKey(ds => ds.DocumentId);

        modelBuilder.Entity<DocumentStage>()
            .HasOne(ds => ds.Stage)
            .WithMany()
            .HasForeignKey(ds => ds.StageId);

        modelBuilder.Entity<DocumentArea>()
            .HasOne(da => da.Document)
            .WithMany(d => d.Areas)
            .HasForeignKey(da => da.DocumentId);

        modelBuilder.Entity<DocumentArea>()
            .HasOne(da => da.Area)
            .WithMany()
            .HasForeignKey(da => da.AreaId);

        modelBuilder.Entity<DocumentTopic>()
            .HasOne(dt => dt.Document)
            .WithMany(d => d.Topics)
            .HasForeignKey(dt => dt.DocumentId);

        modelBuilder.Entity<DocumentTopic>()
            .HasOne(dt => dt.Topic)
            .WithMany()
            .HasForeignKey(dt => dt.TopicId);

        modelBuilder.Entity<DocumentSubtopic>()
            .HasOne(ds => ds.Document)
            .WithMany(d => d.Subtopics)
            .HasForeignKey(ds => ds.DocumentId);

        modelBuilder.Entity<DocumentSubtopic>()
            .HasOne(ds => ds.Subtopic)
            .WithMany()
            .HasForeignKey(ds => ds.SubtopicId);

        // Configure File relationships
        modelBuilder.Entity<DocumentFile>()
            .HasOne(df => df.Document)
            .WithMany(d => d.Files)
            .HasForeignKey(df => df.DocumentId);

        modelBuilder.Entity<DocumentFile>()
            .HasOne(df => df.File)
            .WithMany(f => f.DocumentFiles)
            .HasForeignKey(df => df.FileId);

        // Configure Link relationships
        modelBuilder.Entity<DocumentLink>()
            .HasOne(dl => dl.Document)
            .WithMany(d => d.Links)
            .HasForeignKey(dl => dl.DocumentId);

        modelBuilder.Entity<DocumentLink>()
            .HasOne(dl => dl.Link)
            .WithMany(l => l.DocumentLinks)
            .HasForeignKey(dl => dl.LinkId);
    }
} 