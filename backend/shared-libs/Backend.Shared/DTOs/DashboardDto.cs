namespace Backend.Shared.DTOs;

public class DashboardSnapshotDto
{
    public long Id { get; set; }
    public long project_id { get; set; }
    public DateTime snapshot_date { get; set; }
    public string metric_name { get; set; }
    public decimal metric_value { get; set; }
    public DateTime created_at { get; set; }
}

public class ActivityLogDto
{
    public long Id { get; set; }
    public long project_id { get; set; }
    public long user_id { get; set; }
    public ActivityActionType action_type { get; set; }
    public EntityType entity_type { get; set; }
    public long entity_id { get; set; }
    public DateTime created_at { get; set; }
}