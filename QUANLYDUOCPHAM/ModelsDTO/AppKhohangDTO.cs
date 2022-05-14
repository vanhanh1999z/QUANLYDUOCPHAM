using System;
using System.Collections.Generic;

namespace QUANLYDUOCPHAM.ModelsDTO
{
    public partial class AppKhohangDTO
    {
        public string Idkho { get; set; } = null!;
        public string Idhang { get; set; } = null!;
        public int Slnhap { get; set; }
        public int Slgiao { get; set; }
        public int? Tonkho { get; set; }
    }
}
