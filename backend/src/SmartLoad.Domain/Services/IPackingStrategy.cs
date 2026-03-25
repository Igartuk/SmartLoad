using SmartLoad.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartLoad.Domain.Services
{
    public interface IPackingStrategy
    {
        LoadPlan Calculate(Vehicle vehicle, List<Box> boxes);
        LoadPlan CalculateBestFit(IEnumerable<Vehicle> candidates, List<Box> boxes);
    }
}
