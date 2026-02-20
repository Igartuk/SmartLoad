using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartLoad.Domain.Common
{
    public record Result<T>(T? Value, bool IsSuccess, string Error = "")
    {
        public static Result<T> Success(T value) => new(value, true);
        public static Result<T> Failure(string error) => new(default, false, error);
    }
}
