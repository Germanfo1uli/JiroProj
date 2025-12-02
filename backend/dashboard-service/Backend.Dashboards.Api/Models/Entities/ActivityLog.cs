using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Shared.DTOs;

namespace Backend.Dashboard.Api.Models.Entities;

[Table("activity_logs")]
public class ActivityLog
{
    [Key]
    public long Id { get; set; }
    
    [Required]
    [ForeignKey("project_id")]
    public long ProjectId { get; set; }

    [Required]
    [ForeignKey("user_id")]
    public long UserId { get; set; }

    [Required]
    public ActivityActionType ActionType { get; set; }

    [Required]
    public EntityType EntityType { get; set; }

    [Required]
    [ForeignKey("entity_id")]
    public long EntityId { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public enum ActivityActionType
{
    //дописать
}

public enum EntityType
{
    //дописать
}