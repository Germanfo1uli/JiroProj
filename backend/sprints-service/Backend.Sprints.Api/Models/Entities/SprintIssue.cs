using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Sprints.Api.Models.Entities;

[Table("sprint_issues")]
public class SprintIssue
{
	[Required]
    [ForeignKey("issue_id")]
    public long IssueId { get; set; }

	[Required]
    [ForeignKey("sprint_id")]
    public long SprintId { get; set; }

	public virtual Sprint Sprint { get; set; } = null!;
}