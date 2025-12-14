using Backend.Dashboard.Api.Services;
using Backend.Shared.DTOs;
using MassTransit;

namespace Backend.Dashboard.Api.Messages
{
    public class IssueTypeChangedConsumer : IConsumer<IssueTypeChangedEvent>
    {
        private readonly IActivityLogService _activityLogService;
        private readonly ILogger<IssueTypeChangedConsumer> _logger;

        public IssueTypeChangedConsumer(IActivityLogService activityLogService, ILogger<IssueTypeChangedConsumer> logger)
        {
            _activityLogService = activityLogService;
            _logger = logger;
        }

        public async Task Consume(ConsumeContext<IssueTypeChangedEvent> context)
        {
            var @event = context.Message;
            _logger.LogInformation("Received IssueTypeChangedEvent for IssueId: {IssueId}", @event.IssueId);

            await _activityLogService.LogActivityAsync(
                @event.ProjectId,
                @event.UpdaterId,
                "TypeChanged",
                "Issue",
                @event.IssueId
            );
        }
    }
}
