using System;
using System.Collections.Generic;

namespace QUANLYDUOCPHAM.Models
{
    public partial class AppKho
    {
        public AppKho()
        {
            AppKhohangs = new HashSet<AppKhohang>();
            AppPhieugiaos = new HashSet<AppPhieugiao>();
            AppPhieunhaps = new HashSet<AppPhieunhap>();
        }

        public string Id { get; set; } = null!;
        public string Tenkho { get; set; } = null!;
        public string? Diachi { get; set; }

        public virtual ICollection<AppKhohang> AppKhohangs { get; set; }
        public virtual ICollection<AppPhieugiao> AppPhieugiaos { get; set; }
        public virtual ICollection<AppPhieunhap> AppPhieunhaps { get; set; }
    }
}
