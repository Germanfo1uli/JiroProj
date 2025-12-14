namespace Backend.Shared.DTOs;

public class AttachmentCreatedEvent
{
    public long ProjectId { get; set; }
    public long IssueId { get; set; }
    public long? CommentId { get; set; } 
    public long AttachmentId { get; set; }
    public long UploaderId { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}