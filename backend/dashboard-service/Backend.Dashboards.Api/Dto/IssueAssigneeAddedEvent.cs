namespace Backend.Shared.DTOs;

public class IssueAssigneeAddedEvent
{
    public long ProjectId { get; set; }
    public long IssueId { get; set; }
    public long AssignedUserId { get; set; }
    public long AssignerId { get; set; }
    public DateTime AssignedAtUtc { get; set; } = DateTime.UtcNow;
}