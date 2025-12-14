namespace Backend.Shared.DTOs;

public class IssueCommentDeletedEvent
{
    public long ProjectId { get; set; }
    public long IssueId { get; set; }
    public long CommentId { get; set; }
    public long DeleterId { get; set; }
    public DateTime DeletedAtUtc { get; set; } = DateTime.UtcNow;
}