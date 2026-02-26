using MediatR;
using Microsoft.AspNetCore.Mvc;
using SmartLoad.Application.Interfaces;
using SmartLoad.Application.Common;
using SmartLoad.Application.Packing.Commands;
using SmartLoad.Application.Packing.DTOs;
using SmartLoad.Application.Services;

namespace SmartLoad.Api.Endpoints
{
    public static class PackingEndpoints
    {
        public static void MapPackingEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/api/packing");

            // POST: Trigger calculation
            group.MapPost("/", async (CalculateLoadPlanCommand command, IMediator mediator, UrlShortenerService urlShortener) =>
            {
                try
                {
                    var result = await mediator.Send(command);
                    var shortUrl = urlShortener.GenerateUrlFromGuid(result.Id);

                    var packingResult = new PackingResultSimple(
                        true,
                        $"/packing/{shortUrl}"
                    );

                    return Results.Ok(packingResult);
                }
                catch (Exception ex)
                {
                    return Results.Ok(new PackingResultSimple(false, ""));
                }
            })
            .WithName("CalculatePacking")
            .WithOpenApi();

            // GET: Retrieve loading plan by short URL for frontend visualization
            group.MapGet("/{url}", async (string url, ILoadPlanRepository repository) =>
            {
                try
                {
                    var plan = await repository.GetByUrlAsync(url);
                    return Results.Ok(plan.ToLoadingPlanResponse());
                }
                catch (KeyNotFoundException)
                {
                    return Results.NotFound();
                }
            })
            .WithName("GetLoadingPlanByUrl")
            .WithOpenApi();

            // PUT: Recalculate packing plan (update existing)
            group.MapPut("/{url}", async (string url, UpdatePackingCommand command, IMediator mediator) =>
            {
                try
                {
                    // Set the short URL on the command
                    var updatedCommand = command with { Url = url };
                    var result = await mediator.Send(updatedCommand);

                    // Return the updated loading plan directly
                    return Results.Ok(new PackingResultWithPlan(
                        true,
                        $"/packing/{url}",
                        result
                    ));
                }
                catch (KeyNotFoundException)
                {
                    return Results.NotFound();
                }
                catch (Exception ex)
                {
                    return Results.Ok(new PackingResultSimple(false, $"/packing/{url}"));
                }
            })
            .WithName("UpdatePacking")
            .WithOpenApi();

            // GET: Retrieve result by ID (backward compatibility)
            // group.MapGet("/{id:guid}", async (Guid id, ILoadPlanRepository repository) =>
            // {
            //     try
            //     {
            //         var plan = await repository.GetByIdAsync(id);
            //         return Results.Ok(plan.ToResponse());
            //     }
            //     catch (KeyNotFoundException)
            //     {
            //         return Results.NotFound();
            //     }
            // })
            // .WithName("GetPackingResult")
            // .WithOpenApi();
        }
    }
}
