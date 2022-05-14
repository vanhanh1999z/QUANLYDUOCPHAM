using System;
using System.Collections.Generic;

namespace QUANLYDUOCPHAM.Models
{
    public partial class AppDongnhap
    {
        public string Idphieunhap { get; set; } = null!;
        public string Idhang { get; set; } = null!;
        public int? Soluong { get; set; }
        public double? Gianhap { get; set; }

        public virtual AppHang IdhangNavigation { get; set; } = null!;
        public virtual AppPhieunhap IdphieunhapNavigation { get; set; } = null!;
    }
}
