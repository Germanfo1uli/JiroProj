namespace Backend.Shared.DTOs;

public class ProjectMemberRemovedEvent
{
    public long ProjectId { get; set; }
    public long RemovedUserId { get; set; }
    public long RemovedByUserId { get; set; }
    public DateTime RemovedAtUtc { get; set; } = DateTime.UtcNow;
}