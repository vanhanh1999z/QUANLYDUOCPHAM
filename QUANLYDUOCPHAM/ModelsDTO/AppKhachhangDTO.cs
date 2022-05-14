using System;
using System.Collections.Generic;

namespace QUANLYDUOCPHAM.ModelsDTO
{
    public partial class AppKhachhangDTO
    {
        public string Id { get; set; } = null!;
        public string Tenkh { get; set; } = null!;
        public string? Diachi { get; set; }
        public string? Dienthoai { get; set; }
    }
}
