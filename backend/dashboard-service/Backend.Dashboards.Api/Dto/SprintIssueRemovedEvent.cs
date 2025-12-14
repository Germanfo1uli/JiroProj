namespace Backend.Shared.DTOs;

public class SprintIssueRemovedEvent
{
    public long ProjectId { get; set; }
    public long SprintId { get; set; }
    public long IssueId { get; set; }
    public long RemovedByUserId { get; set; }
    public DateTime RemovedAtUtc { get; set; } = DateTime.UtcNow;
}