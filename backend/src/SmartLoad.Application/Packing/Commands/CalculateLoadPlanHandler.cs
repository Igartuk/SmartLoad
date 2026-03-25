using MediatR;
using SmartLoad.Application.Common;
using SmartLoad.Application.Interfaces;
using SmartLoad.Application.Packing.Commands.Base;
using SmartLoad.Application.Packing.DTOs;
using SmartLoad.Application.Services;
using SmartLoad.Domain.Services;
using System.Text.Json;

namespace SmartLoad.Application.Packing.Commands
{
 public class CalculateLoadPlanHandler : PackingHandlerBase, IRequestHandler<CalculateLoadPlanCommand, LoadPlanResponse>
 {
 private readonly UrlShortenerService _urlShortener;

 public CalculateLoadPlanHandler(IPackingStrategy strategy, ILoadPlanRepository repo, UrlShortenerService urlShortener)
 : base(strategy, repo) => _urlShortener = urlShortener;

 public async Task<LoadPlanResponse> Handle(CalculateLoadPlanCommand request, CancellationToken ct)
 {
 // Use global calculation logic from base class
 var loadPlan = PerformCalculation(request.Vehicle, request.Boxes);

 loadPlan.SetUrl(_urlShortener.GenerateUrlFromGuid(loadPlan.Id));
 loadPlan.SetOriginalRequest(JsonSerializer.Serialize(request));

 await _repository.SaveAsync(loadPlan);
 return loadPlan.ToResponse();
 }
 }
}
