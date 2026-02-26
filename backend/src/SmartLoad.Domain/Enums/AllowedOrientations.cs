using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartLoad.Domain.Enums
{
    [Flags]
    public enum AllowedOrientations
    {
        UprightOnly = 1,
        CanLieOnSide = 2,
        FullyFlexible = 4
    }
}
