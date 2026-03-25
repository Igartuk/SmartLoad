using SmartLoad.Application.Interfaces;
using SmartLoad.Application.Packing.DTOs;
using SmartLoad.Application.Packing.Mapping;
using SmartLoad.Domain.Entities;
using SmartLoad.Domain.Services;

namespace SmartLoad.Application.Packing.Commands.Base
{
 public abstract class PackingHandlerBase
 {
 protected readonly IPackingStrategy _strategy;
 protected readonly ILoadPlanRepository _repository;

 protected PackingHandlerBase(IPackingStrategy strategy, ILoadPlanRepository repository)
 {
 _strategy = strategy;
 _repository = repository;
 }

 ///<summary>
 /// Global calculation logic that handles both explicit vehicle and auto-selection scenarios.
 /// When no vehicle is provided or vehicle has no dimensions, selects the best fit from standard templates.
 ///</summary>
 protected LoadPlan PerformCalculation(VehicleRequest? vehicleReq, List<BoxRequest> boxesReq)
 {
 var boxes = boxesReq.ToDomainList();

 // Auto-select vehicle when no vehicle provided or vehicle has no dimensions
 if (vehicleReq == null || IsVehicleRequestEmpty(vehicleReq))
 {
 var templates = Vehicle.GetStandardTemplates();
 return _strategy.CalculateBestFit(templates, boxes);
 }

 var vehicle = vehicleReq.ToDomain();
 return _strategy.Calculate(vehicle, boxes);
 }

 private static bool IsVehicleRequestEmpty(VehicleRequest vehicleReq)
 {
 return string.IsNullOrEmpty(vehicleReq.TemplateType) 
 && !vehicleReq.Width.HasValue 
 && !vehicleReq.Height.HasValue 
 && !vehicleReq.Depth.HasValue;
 }
 }
}
