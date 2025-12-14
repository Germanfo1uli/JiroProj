namespace Backend.Shared.DTOs;

public class IssueAssigneeRemovedEvent
{
    public long ProjectId { get; set; }
    public long IssueId { get; set; }
    public long RemovedUserId { get; set; }
    public long RemoverId { get; set; }
    public DateTime RemovedAtUtc { get; set; } = DateTime.UtcNow;
}