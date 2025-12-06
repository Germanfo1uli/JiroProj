using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Dashboard.Api.Models.Entities;

[Table("activity_logs")]
public class ActivityLog
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("project_id")]
    public long ProjectId { get; set; }

    [Column("user_id")]
    public long UserId { get; set; }

    [Column("action_type")]
    [MaxLength(50)]
    public string ActionType { get; set; } = string.Empty;

    [Column("entity_type")]
    [MaxLength(50)]
    public string EntityType { get; set; } = string.Empty;

    [Column("entity_id")]
    public long EntityId { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}