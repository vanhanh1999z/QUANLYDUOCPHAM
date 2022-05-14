using System;
using System.Collections.Generic;

namespace QUANLYDUOCPHAM.Models
{
    public partial class AppPhieuthu
    {
        public string Id { get; set; } = null!;
        public DateTime Ngaythu { get; set; }
        public double? Sotiennop { get; set; }
        public string Idkhach { get; set; } = null!;
        public string Tenquanly { get; set; } = null!;
        public string Idphieugiao { get; set; } = null!;

        public virtual AppKhachhang IdkhachNavigation { get; set; } = null!;
        public virtual AppPhieugiao IdphieugiaoNavigation { get; set; } = null!;
    }
}
