namespace Backend.Shared.DTOs;

public class IssueStatusChangedEvent
{
    public long ProjectId { get; set; }
    public long IssueId { get; set; }
    public long UpdaterId { get; set; }
    public string OldStatus { get; set; } = string.Empty;
    public string NewStatus { get; set; } = string.Empty;
    public DateTime ChangedAtUtc { get; set; } = DateTime.UtcNow;
}