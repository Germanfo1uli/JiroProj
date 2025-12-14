namespace Backend.Shared.DTOs;

public class IssuePriorityChangedEvent
{
    public long ProjectId { get; set; }
    public long IssueId { get; set; }
    public long UpdaterId { get; set; }
    public string OldPriority { get; set; } = string.Empty;
    public string NewPriority { get; set; } = string.Empty;
    public DateTime ChangedAtUtc { get; set; } = DateTime.UtcNow;
}