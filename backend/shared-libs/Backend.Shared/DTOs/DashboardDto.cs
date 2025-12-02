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

public class CreateSnapshotDto
{
    public long project_id { get; set; }
    public string metric_name { get; set; }
    public decimal metric_value { get; set; }
    public DateTime? snapshot_date { get; set; }
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

public enum ActivityActionType
{
	VIEW = 1,
	CREATE = 2,
	EDIT = 3,
	DELETE = 4,
	ASSIGN = 5,
	EDIT_ALL = 6,
	EDIT_OWN = 7,
	EDIT_ASSIGNED = 8,
	DELETE_ALL = 9,
	DELETE_OWN = 10,
	MANAGE = 11,
	COMPLETE = 12
}

public enum EntityType
{
    PROJECT=1, 
	ISSUE=2, 
	COMMENT=3, 
	ATTACHMENT=4, 
	TAG=5, 
	SPRINT=6, 
	BOARD=7, 
	ANALYTICS=8, 
	NOTIFICATION=9
}