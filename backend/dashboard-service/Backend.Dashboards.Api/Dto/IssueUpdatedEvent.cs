namespace Backend.Shared.DTOs;

public class IssueUpdatedEvent
{
    public long ProjectId { get; set; }
    public long IssueId { get; set; }
    public long UpdaterId { get; set; }
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
}