namespace Backend.Shared.DTOs;

public class AttachmentDeletedEvent
{
    public long ProjectId { get; set; }
    public long IssueId { get; set; }
    public long AttachmentId { get; set; }
    public long DeleterId { get; set; }
    public DateTime DeletedAtUtc { get; set; } = DateTime.UtcNow;
}