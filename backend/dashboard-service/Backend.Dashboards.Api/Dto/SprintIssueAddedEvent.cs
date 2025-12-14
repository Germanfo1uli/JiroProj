namespace Backend.Shared.DTOs;

public class SprintIssueAddedEvent
{
    public long ProjectId { get; set; }
    public long SprintId { get; set; }
    public long IssueId { get; set; }
    public long AddedByUserId { get; set; }
    public DateTime AddedAtUtc { get; set; } = DateTime.UtcNow;
}