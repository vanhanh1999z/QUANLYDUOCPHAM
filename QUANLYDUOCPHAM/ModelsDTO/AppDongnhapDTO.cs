using System;
using System.Collections.Generic;

namespace QUANLYDUOCPHAM.ModelsDTO
{
    public partial class AppDongnhapDTO
    {
        public string Idphieunhap { get; set; } = null!;
        public string Idhang { get; set; } = null!;
        public int? Soluong { get; set; }
        public double? Gianhap { get; set; }
    }
}
