using System;
using System.Collections.Generic;

namespace QUANLYDUOCPHAM.Models
{
    public partial class AppDonggiao
    {
        public string Idphieugiao { get; set; } = null!;
        public string Idhang { get; set; } = null!;
        public int? Soluong { get; set; }
        public double? Gia { get; set; }

        public virtual AppHang IdhangNavigation { get; set; } = null!;
        public virtual AppPhieugiao IdphieugiaoNavigation { get; set; } = null!;
    }
}
