using Backend.Sprints.Api.Data.Repositories;
using Backend.Sprints.Api.Models.Entities;
using Backend.Shared.DTOs;

namespace Backend.Sprints.Api.Services;

public class SprintService : ISprintService
{
    private readonly SprintRepository _sprintRepository;
    private readonly ISprintIssueService _sprintIssueService;

    public SprintService(SprintRepository sprintRepository, ISprintIssueService sprintIssueService)
    {
        _sprintRepository = sprintRepository;
        _sprintIssueService = sprintIssueService;
    }

    public async Task<Sprint> CreateSprintAsync(long projectId, string name, string? goal, DateTime startDate, DateTime endDate)
    {
        // Валидация дат
        if (startDate >= endDate)
            throw new ArgumentException("Start date must be before end date");

        // Проверка пересечения дат
        if (await _sprintRepository.HasDateOverlapAsync(projectId, startDate, endDate))
            throw new InvalidOperationException("Sprint dates overlap with existing sprint in project");

        var sprint = new Sprint
        {
            ProjectId = projectId,
            Name = name,
            Goal = goal,
            StartDate = startDate,
            EndDate = endDate,
            Status = SprintStatus.Planned
        };

        return await _sprintRepository.CreateAsync(sprint);
    }

    public async Task<Sprint?> GetSprintByIdAsync(long id)
    {
        return await _sprintRepository.GetByIdAsync(id);
    }

    public async Task<List<Sprint>> GetSprintsByProjectIdAsync(long projectId)
    {
        return await _sprintRepository.GetByProjectIdAsync(projectId);
    }

    public async Task<Sprint> UpdateSprintAsync(long id, string name, string? goal, DateTime startDate, DateTime endDate, SprintStatus status)
    {
        var sprint = await _sprintRepository.GetByIdAsync(id);
        if (sprint == null)
            throw new KeyNotFoundException($"Sprint with id {id} not found");

        // Валидация дат
        if (startDate >= endDate)
            throw new ArgumentException("Start date must be before end date");

        // Проверка пересечения дат (исключая текущий спринт)
        if (await _sprintRepository.HasDateOverlapAsync(sprint.ProjectId, startDate, endDate, id))
            throw new InvalidOperationException("Sprint dates overlap with existing sprint in project");

        sprint.Name = name;
        sprint.Goal = goal;
        sprint.StartDate = startDate;
        sprint.EndDate = endDate;
        sprint.Status = status;

        return await _sprintRepository.UpdateAsync(sprint);
    }

    public async Task DeleteSprintAsync(long id)
    {
        await _sprintRepository.DeleteAsync(id);
    }

    public async Task CompleteSprintAsync(long sprintId)
    {
        var sprint = await _sprintRepository.GetByIdAsync(sprintId);
        if (sprint == null)
            throw new KeyNotFoundException($"Sprint with id {sprintId} not found");

        sprint.Status = SprintStatus.Completed;
        await _sprintRepository.UpdateAsync(sprint);

        // TODO: Логика переноса незавершённых задач в следующий спринт
    }

    public async Task<SprintBoardDto> GetSprintBoardAsync(long sprintId)
    {
        var sprint = await _sprintRepository.GetByIdAsync(sprintId);
        if (sprint == null)
            throw new KeyNotFoundException($"Sprint with id {sprintId} not found");

        var issueIds = await _sprintIssueService.GetIssueIdsBySprintIdAsync(sprintId);

        // TODO: Получить детальную информацию о задачах из Issues микросервиса
        return new SprintBoardDto
        {
            SprintId = sprintId,
            SprintName = sprint.Name,
            IssueIds = issueIds
            // Issues = await GetIssuesDetailsAsync(issueIds) - через вызов Issues сервиса
        };
    }

    public async Task<bool> HasDateOverlapAsync(long projectId, DateTime startDate, DateTime endDate, long? excludeSprintId = null)
    {
        return await _sprintRepository.HasDateOverlapAsync(projectId, startDate, endDate, excludeSprintId);
    }
}