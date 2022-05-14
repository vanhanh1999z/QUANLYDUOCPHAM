using System;
using System.Collections.Generic;

namespace QUANLYDUOCPHAM.ModelsDTO
{
    public partial class AppKhoDTO
    {
        public string Id { get; set; } = null!;
        public string Tenkho { get; set; } = null!;
        public string? Diachi { get; set; }
    }
}
