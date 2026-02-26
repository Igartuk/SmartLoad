using System;
using System.Collections.Generic;

namespace SmartLoad.Application.Packing.DTOs
{
    /// <summary>
    /// Full packing result with loading plan for recalculation responses
    /// </summary>
    public record PackingResultWithPlan(
        bool Success,
        string Url,
        LoadingPlanResponse LoadingPlan
    );
}
