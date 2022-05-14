using System;
using System.Collections.Generic;

namespace QUANLYDUOCPHAM.Models
{
    public partial class AppDongmua
    {
        public string Iddonmua { get; set; } = null!;
        public string Idhang { get; set; } = null!;
        public int? Soluong { get; set; }

        public virtual AppDonmua IddonmuaNavigation { get; set; } = null!;
        public virtual AppHang IdhangNavigation { get; set; } = null!;
    }
}
