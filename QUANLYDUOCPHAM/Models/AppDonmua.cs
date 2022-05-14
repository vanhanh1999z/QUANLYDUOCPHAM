using System;
using System.Collections.Generic;

namespace QUANLYDUOCPHAM.Models
{
    public partial class AppDonmua
    {
        public AppDonmua()
        {
            AppDongmuas = new HashSet<AppDongmua>();
            AppPhieunhaps = new HashSet<AppPhieunhap>();
        }

        public string Id { get; set; } = null!;
        public string Idncc { get; set; } = null!;
        public DateTime Ngaymua { get; set; }

        public virtual AppNhacungcap IdnccNavigation { get; set; } = null!;
        public virtual ICollection<AppDongmua> AppDongmuas { get; set; }
        public virtual ICollection<AppPhieunhap> AppPhieunhaps { get; set; }
    }
}
