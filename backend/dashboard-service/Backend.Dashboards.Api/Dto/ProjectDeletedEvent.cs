namespace Backend.Shared.DTOs;

public class ProjectDeletedEvent
{
    public long ProjectId { get; set; }
    public long DeleterId { get; set; }
    public DateTime DeletedAtUtc { get; set; } = DateTime.UtcNow;
}