using System;
using System.Collections.Generic;

namespace QUANLYDUOCPHAM.Models
{
    public partial class AppKhachhang
    {
        public AppKhachhang()
        {
            AppDondats = new HashSet<AppDondat>();
            AppPhieuthus = new HashSet<AppPhieuthu>();
        }

        public string Id { get; set; } = null!;
        public string Tenkh { get; set; } = null!;
        public string? Diachi { get; set; }
        public string? Dienthoai { get; set; }

        public virtual ICollection<AppDondat> AppDondats { get; set; }
        public virtual ICollection<AppPhieuthu> AppPhieuthus { get; set; }
    }
}
