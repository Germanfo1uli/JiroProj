namespace Backend.Shared.DTOs;

public class ProjectCreatedEvent
{
    public long ProjectId { get; set; }
    public string ProjectName { get; set; } = string.Empty;
    public long CreatorId { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}