namespace Backend.Shared.DTOs;

public class IssueTypeChangedEvent
{
    public long ProjectId { get; set; }
    public long IssueId { get; set; }
    public long UpdaterId { get; set; }
    public string OldType { get; set; } = string.Empty;
    public string NewType { get; set; } = string.Empty;
    public DateTime ChangedAtUtc { get; set; } = DateTime.UtcNow;
}