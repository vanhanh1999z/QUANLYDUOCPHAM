using System;
using System.Collections.Generic;

namespace QUANLYDUOCPHAM.ModelsDTO
{
    public partial class AppPhieugiaoDTO
    {
        public string Id { get; set; } = null!;
        public DateTime Ngaygiao { get; set; }
        public double? Tongtiengiao { get; set; }
        public string Idkho { get; set; } = null!;
        public string Iddondat { get; set; } = null!;
        public bool? Trangthainhan { get; set; }
    }
}
