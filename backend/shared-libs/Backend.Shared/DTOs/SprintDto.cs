namespace Backend.Shared.DTOs;

public class SprintDto
{
    public long Id { get; set; }
    public string? Name { get; set; }
    public string? Goal { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public long ProjectId { get; set; }
	public SprintStatus Status { get; set; }
}

public enum SprintStatus
{
    Planned = 1,
    Active = 2, 
    Completed = 3
}