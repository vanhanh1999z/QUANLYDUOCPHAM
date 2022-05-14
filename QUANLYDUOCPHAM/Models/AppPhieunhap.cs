using System;
using System.Collections.Generic;

namespace QUANLYDUOCPHAM.Models
{
    public partial class AppPhieunhap
    {
        public AppPhieunhap()
        {
            AppDongnhaps = new HashSet<AppDongnhap>();
            AppPhieuchis = new HashSet<AppPhieuchi>();
        }

        public string Id { get; set; } = null!;
        public DateTime Ngaynhap { get; set; }
        public double? Tongtiennhap { get; set; }
        public string Idkho { get; set; } = null!;
        public string Iddonmua { get; set; } = null!;
        public bool? Trangthainhan { get; set; }

        public virtual AppDonmua IddonmuaNavigation { get; set; } = null!;
        public virtual AppKho IdkhoNavigation { get; set; } = null!;
        public virtual ICollection<AppDongnhap> AppDongnhaps { get; set; }
        public virtual ICollection<AppPhieuchi> AppPhieuchis { get; set; }
    }
}
