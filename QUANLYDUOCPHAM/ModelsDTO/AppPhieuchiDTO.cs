using System;
using System.Collections.Generic;

namespace QUANLYDUOCPHAM.ModelsDTO
{
    public partial class AppPhieuchiDTO
    {
        public string Id { get; set; } = null!;
        public DateTime Ngaychi { get; set; }
        public double? Sotientra { get; set; }
        public string Idncc { get; set; } = null!;
        public string Tenquanly { get; set; } = null!;
        public string Idphieunhap { get; set; } = null!;
    }
}
