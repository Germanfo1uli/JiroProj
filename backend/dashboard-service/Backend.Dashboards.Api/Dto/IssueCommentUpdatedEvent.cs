namespace Backend.Shared.DTOs;

public class IssueCommentUpdatedEvent
{
    public long ProjectId { get; set; }
    public long IssueId { get; set; }
    public long CommentId { get; set; }
    public long EditorId { get; set; }
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
}