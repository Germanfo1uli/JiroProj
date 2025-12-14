namespace Backend.Shared.DTOs;

public class SprintCompletedEvent
{
    public long ProjectId { get; set; }
    public long SprintId { get; set; }
    public long CompleterId { get; set; }
    public DateTime CompletedAtUtc { get; set; } = DateTime.UtcNow;
}