namespace SmartLoad.Api.Filters
{
    public class RequestLoggingFilter : IEndpointFilter
    {
        private readonly ILogger<RequestLoggingFilter> _logger;
        public RequestLoggingFilter(ILogger<RequestLoggingFilter> logger) => _logger = logger;

        public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
        {
            var requestName = context.HttpContext.Request.Path;
            _logger.LogInformation("Starting request {Path}", requestName);

            var result = await next(context);

            _logger.LogInformation("Finished request {Path}", requestName);
            return result;
        }
    }
}
