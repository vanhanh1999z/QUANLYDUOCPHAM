using System;
using System.Collections.Generic;

namespace QUANLYDUOCPHAM.Models
{
    public partial class AppPhieuchi
    {
        public string Id { get; set; } = null!;
        public DateTime Ngaychi { get; set; }
        public double? Sotientra { get; set; }
        public string Idncc { get; set; } = null!;
        public string Tenquanly { get; set; } = null!;
        public string Idphieunhap { get; set; } = null!;

        public virtual AppNhacungcap IdnccNavigation { get; set; } = null!;
        public virtual AppPhieunhap IdphieunhapNavigation { get; set; } = null!;
    }
}
