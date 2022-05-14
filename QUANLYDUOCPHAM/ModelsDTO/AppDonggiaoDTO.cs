using System;
using System.Collections.Generic;

namespace QUANLYDUOCPHAM.ModelsDTO
{
    public partial class AppDonggiaoDTO
    {
        public string Idphieugiao { get; set; } = null!;
        public string Idhang { get; set; } = null!;
        public int? Soluong { get; set; }
        public double? Gia { get; set; }
    }
}
