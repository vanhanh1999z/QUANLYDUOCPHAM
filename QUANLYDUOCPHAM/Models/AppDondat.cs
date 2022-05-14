using System;
using System.Collections.Generic;

namespace QUANLYDUOCPHAM.Models
{
    public partial class AppDondat
    {
        public AppDondat()
        {
            AppPhieugiaos = new HashSet<AppPhieugiao>();
        }

        public string Id { get; set; } = null!;
        public string Makh { get; set; } = null!;
        public DateTime Ngaydat { get; set; }

        public virtual AppKhachhang MakhNavigation { get; set; } = null!;
        public virtual ICollection<AppPhieugiao> AppPhieugiaos { get; set; }
    }
}
