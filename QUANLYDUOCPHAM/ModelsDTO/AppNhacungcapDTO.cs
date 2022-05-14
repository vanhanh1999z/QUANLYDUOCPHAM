using System;
using System.Collections.Generic;

namespace QUANLYDUOCPHAM.ModelsDTO
{
    public partial class AppNhacungcapDTO
    {
        public string Id { get; set; } = null!;
        public string Tenncc { get; set; } = null!;
        public string? Diachi { get; set; }
        public string? Dienthoai { get; set; }
    }
}
