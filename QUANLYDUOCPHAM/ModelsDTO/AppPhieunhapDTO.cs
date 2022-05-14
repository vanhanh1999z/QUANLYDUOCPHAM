using System;
using System.Collections.Generic;

namespace QUANLYDUOCPHAM.ModelsDTO
{
    public partial class AppPhieunhapDTO
    {
        public string Id { get; set; } = null!;
        public DateTime Ngaynhap { get; set; }
        public double? Tongtiennhap { get; set; }
        public string Idkho { get; set; } = null!;
        public string Iddonmua { get; set; } = null!;
        public bool? Trangthainhan { get; set; }

    }
}
