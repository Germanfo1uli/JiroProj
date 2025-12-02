using Microsoft.EntityFrameworkCore;
using Backend.Dashboard.Api.Models.Entities;

namespace Backend.Dashboard.Api.Data;

public class DashboardDbContext : DbContext
{
    public DashboardDbContext(DbContextOptions<DashboardDbContext> options) : base(options)
    {
    }

    public DbSet<DashboardSnapshot> DashboardSnapshots { get; set; }
    public DbSet<ActivityLog> ActivityLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("dashboard_service_schema");
        
        modelBuilder.Entity<DashboardSnapshot>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            
            entity.HasIndex(e => e.ProjectId);
            entity.HasIndex(e => e.SnapshotDate);
            entity.HasIndex(e => e.MetricName);
            entity.HasIndex(e => e.CreatedAt);
        });

        modelBuilder.Entity<ActivityLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            
            entity.HasIndex(e => e.ProjectId);
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.ActionType);
            entity.HasIndex(e => e.EntityType);
            entity.HasIndex(e => e.EntityId);
            entity.HasIndex(e => e.CreatedAt);
        });
    }
}