namespace Backend.Sprints.Api.Services;

public interface ISprintIssueService
{
    Task AddIssueToSprintAsync(long sprintId, long issueId);
    Task RemoveIssueFromSprintAsync(long sprintId, long issueId);
    Task<List<long>> GetIssueIdsBySprintIdAsync(long sprintId);
    Task<List<long>> GetSprintIdsByIssueIdAsync(long issueId);
    Task<bool> IsIssueInSprintAsync(long sprintId, long issueId);
}