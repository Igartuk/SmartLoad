using MediatR;
using Microsoft.AspNetCore.Mvc;
using SmartLoad.Api.Filters;
using SmartLoad.Application.Common;
using SmartLoad.Application.Interfaces;
using SmartLoad.Application.Packing.Commands;
using SmartLoad.Application.Packing.DTOs;
using SmartLoad.Application.Services;

namespace SmartLoad.Api.Endpoints
{
    public static class PackingEndpoints
    {
        public static void MapPackingEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/api/packing")
                           .AddEndpointFilter<RequestLoggingFilter>()
                           .WithOpenApi();

            // POST: Trigger calculation
            group.MapPost("/", async (CalculateLoadPlanCommand command, IMediator mediator, UrlShortenerService urlShortener) =>
            {
                var result = await mediator.Send(command);
                var path = $"/packing/{result.Url}";
                return Results.Created(path, new PackingResultSimple(true, path));
            })
            .WithName("CalculatePacking");

            // GET: Retrieve loading plan
            group.MapGet("/{url}", async (string url, ILoadPlanRepository repository) =>
            {
                var plan = await repository.GetByUrlAsync(url);
                return plan is not null
                    ? Results.Ok(plan.ToLoadingPlanResponse())
                    : Results.NotFound();
            })
            .WithName("GetLoadingPlanByUrl");

            // PUT: Recalculate packing plan
            group.MapPut("/{url}", async (string url, UpdatePackingCommand command, IMediator mediator) =>
            {
                var result = await mediator.Send(command with { Url = url });

                return Results.Ok(new PackingResultWithPlan(
                    true,
                    $"/packing/{url}",
                    result
                ));
            })
            .WithName("UpdatePacking");
        }
    }
}
