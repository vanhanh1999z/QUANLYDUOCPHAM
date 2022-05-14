using System;
using System.Collections.Generic;

namespace QUANLYDUOCPHAM.Models
{
    public partial class AppHang
    {
        public AppHang()
        {
            AppDonggiaos = new HashSet<AppDonggiao>();
            AppDongmuas = new HashSet<AppDongmua>();
            AppDongnhaps = new HashSet<AppDongnhap>();
            AppKhohangs = new HashSet<AppKhohang>();
        }

        public string Id { get; set; } = null!;
        public string Tenhang { get; set; } = null!;
        public string? Mota { get; set; }
        public string Donvi { get; set; } = null!;

        public virtual ICollection<AppDonggiao> AppDonggiaos { get; set; }
        public virtual ICollection<AppDongmua> AppDongmuas { get; set; }
        public virtual ICollection<AppDongnhap> AppDongnhaps { get; set; }
        public virtual ICollection<AppKhohang> AppKhohangs { get; set; }
    }
}
