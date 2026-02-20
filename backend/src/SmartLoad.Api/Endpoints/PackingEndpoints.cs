using MediatR;
using Microsoft.AspNetCore.Mvc;
using SmartLoad.Application.Interfaces;
using SmartLoad.Application.Common;
using SmartLoad.Application.Packing.Commands;

namespace SmartLoad.Api.Endpoints
{
    public static class PackingEndpoints
    {
        public static void MapPackingEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/api/packing");

            // POST: Trigger calculation
            group.MapPost("/", async (CalculateLoadPlanCommand command, IMediator mediator) =>
            {
                var result = await mediator.Send(command);
                return Results.Created($"/api/packing/{result.Id}", result);
            })
            .WithName("CalculatePacking")
            .WithOpenApi();

            // GET: Retrieve result for 3D Frontend
            group.MapGet("/{id:guid}", async (Guid id, ILoadPlanRepository repository) =>
            {
                try
                {
                    var plan = await repository.GetByIdAsync(id);
                    return Results.Ok(plan.ToResponse());
                }
                catch (KeyNotFoundException)
                {
                    return Results.NotFound();
                }
            })
            .WithName("GetPackingResult")
            .WithOpenApi();
        }
    }
}
