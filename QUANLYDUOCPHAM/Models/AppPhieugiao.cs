using System;
using System.Collections.Generic;

namespace QUANLYDUOCPHAM.Models
{
    public partial class AppPhieugiao
    {
        public AppPhieugiao()
        {
            AppDonggiaos = new HashSet<AppDonggiao>();
            AppPhieuthus = new HashSet<AppPhieuthu>();
        }

        public string Id { get; set; } = null!;
        public DateTime Ngaygiao { get; set; }
        public double? Tongtiengiao { get; set; }
        public string Idkho { get; set; } = null!;
        public string Iddondat { get; set; } = null!;
        public bool? Trangthainhan { get; set; }

        public virtual AppDondat IddondatNavigation { get; set; } = null!;
        public virtual AppKho IdkhoNavigation { get; set; } = null!;
        public virtual ICollection<AppDonggiao> AppDonggiaos { get; set; }
        public virtual ICollection<AppPhieuthu> AppPhieuthus { get; set; }
    }
}
