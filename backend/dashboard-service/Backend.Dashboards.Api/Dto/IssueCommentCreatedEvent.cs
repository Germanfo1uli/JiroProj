namespace Backend.Shared.DTOs;

public class IssueCommentCreatedEvent
{
    public long ProjectId { get; set; }
    public long IssueId { get; set; }
    public long CommentId { get; set; }
    public long AuthorId { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}