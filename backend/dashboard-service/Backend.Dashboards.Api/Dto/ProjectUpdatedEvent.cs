namespace Backend.Shared.DTOs;

public class ProjectUpdatedEvent
{
    public long ProjectId { get; set; }
    public long UpdaterId { get; set; }
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
}