namespace Backend.Shared.DTOs;

public class ProjectMemberAddedEvent
{
    public long ProjectId { get; set; }
    public long AddedUserId { get; set; }
    public long AddedByUserId { get; set; }
    public DateTime AddedAtUtc { get; set; } = DateTime.UtcNow;
}