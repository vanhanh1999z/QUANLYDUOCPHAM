using System;
using System.Collections.Generic;

namespace QUANLYDUOCPHAM.ModelsDTO
{
    public partial class AppPhieuthuDTO
    {
        public string Id { get; set; } = null!;
        public DateTime Ngaythu { get; set; }
        public double? Sotiennop { get; set; }
        public string Idkhach { get; set; } = null!;
        public string Tenquanly { get; set; } = null!;
        public string Idphieugiao { get; set; } = null!;
    }
}
