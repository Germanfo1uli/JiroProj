using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Dashboard.Api.Models.Entities;

[Table("dashboard_snapshots")]
public class DashboardSnapshot
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("project_id")]
    public long ProjectId { get; set; }

    [Column("snapshot_date")]
    public DateTime SnapshotDate { get; set; }

    [Column("metric_name")]
    [MaxLength(100)]
    public string MetricName { get; set; } = string.Empty;

    [Column("metric_value")]
    public decimal MetricValue { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}