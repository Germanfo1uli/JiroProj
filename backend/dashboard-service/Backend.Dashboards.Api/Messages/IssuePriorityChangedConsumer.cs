using Backend.Dashboard.Api.Services;
using Backend.Shared.DTOs;
using MassTransit;

namespace Backend.Dashboard.Api.Messages
{
    public class IssuePriorityChangedConsumer : IConsumer<IssuePriorityChangedEvent>
    {
        private readonly IActivityLogService _activityLogService;
        private readonly ILogger<IssuePriorityChangedConsumer> _logger;

        public IssuePriorityChangedConsumer(IActivityLogService activityLogService, ILogger<IssuePriorityChangedConsumer> logger)
        {
            _activityLogService = activityLogService;
            _logger = logger;
        }

        public async Task Consume(ConsumeContext<IssuePriorityChangedEvent> context)
        {
            var @event = context.Message;
            _logger.LogInformation("Received IssuePriorityChangedEvent for IssueId: {IssueId}", @event.IssueId);

            await _activityLogService.LogActivityAsync(
                @event.ProjectId,
                @event.UpdaterId,
                "PriorityChanged",
                "Issue",
                @event.IssueId
            );
        }
    }
}
