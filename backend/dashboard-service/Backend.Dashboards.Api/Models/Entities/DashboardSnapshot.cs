using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Dashboard.Api.Models.Entities;

[Table("dashboard_snapshots")]
public class DashboardSnapshot
{
    [Key]
    public long Id { get; set; }

    [Required]
    [ForeignKey("project_id")]
    public long ProjectId { get; set; }

    [Required]
    public DateTime SnapshotDate { get; set; }

    [Required]
    [MaxLength(100)]
    public string MetricName { get; set; }

    [Required]
    public decimal MetricValue { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}