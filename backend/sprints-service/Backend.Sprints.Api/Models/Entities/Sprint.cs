using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Shared.DTOs;

namespace Backend.Sprints.Api.Models.Entities;

[Table("sprints")]
public class Sprint
{
    [Key]
    public long Id { get; set; }

    [Required]
    [ForeignKey("project_id")]
    public long ProjectId { get; set; }
    
    [Required]
    [MaxLength(255)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string? Goal { get; set; }

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    [Required]
    public SprintStatus Status { get; set; } = SprintStatus.Planned;

	public virtual ICollection<SprintIssue> SprintIssues { get; set; } = new List<SprintIssue>();
}