using System;
using System.Collections.Generic;

namespace QUANLYDUOCPHAM.Models
{
    public partial class AppNhacungcap
    {
        public AppNhacungcap()
        {
            AppDonmuas = new HashSet<AppDonmua>();
            AppPhieuchis = new HashSet<AppPhieuchi>();
        }

        public string Id { get; set; } = null!;
        public string Tenncc { get; set; } = null!;
        public string? Diachi { get; set; }
        public string? Dienthoai { get; set; }

        public virtual ICollection<AppDonmua> AppDonmuas { get; set; }
        public virtual ICollection<AppPhieuchi> AppPhieuchis { get; set; }
    }
}
