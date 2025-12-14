namespace Backend.Shared.DTOs;

public class SprintStartedEvent
{
    public long ProjectId { get; set; }
    public long SprintId { get; set; }
    public long StarterId { get; set; }
    public DateTime StartedAtUtc { get; set; } = DateTime.UtcNow;
}