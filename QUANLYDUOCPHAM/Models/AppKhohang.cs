using System;
using System.Collections.Generic;

namespace QUANLYDUOCPHAM.Models
{
    public partial class AppKhohang
    {
        public string Idkho { get; set; } = null!;
        public string Idhang { get; set; } = null!;
        public int Slnhap { get; set; }
        public int Slgiao { get; set; }
        public int? Tonkho { get; set; }

        public virtual AppHang IdhangNavigation { get; set; } = null!;
        public virtual AppKho IdkhoNavigation { get; set; } = null!;
    }
}
