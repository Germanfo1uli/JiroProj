namespace Backend.Shared.DTOs;

public class IssueCreatedEvent
{
    public long ProjectId { get; set; }
    public long IssueId { get; set; }
    public long CreatorId { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}