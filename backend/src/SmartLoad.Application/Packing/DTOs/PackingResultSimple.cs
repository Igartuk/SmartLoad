using System;
using System.Collections.Generic;

namespace SmartLoad.Application.Packing.DTOs
{
    /// <summary>
    /// Simple packing result for initial calculation response (without loading plan)
    /// </summary>
    public record PackingResultSimple(
        bool Success,
        string Url
    );
}