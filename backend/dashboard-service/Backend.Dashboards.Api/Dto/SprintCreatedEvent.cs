namespace Backend.Shared.DTOs;

public class SprintCreatedEvent
{
    public long ProjectId { get; set; }
    public long SprintId { get; set; }
    public long CreatorId { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}