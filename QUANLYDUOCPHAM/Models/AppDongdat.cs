using System;
using System.Collections.Generic;

namespace QUANLYDUOCPHAM.Models
{
    public partial class AppDongdat
    {
        public string Iddondat { get; set; } = null!;
        public string Idhang { get; set; } = null!;
        public int Soluong { get; set; }

        public virtual AppDondat IddondatNavigation { get; set; } = null!;
        public virtual AppHang IdhangNavigation { get; set; } = null!;
    }
}
