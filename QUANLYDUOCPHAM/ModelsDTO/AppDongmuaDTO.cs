using System;
using System.Collections.Generic;

namespace QUANLYDUOCPHAM.ModelsDTO
{
    public partial class AppDongmuaDTO
    {
        public string Iddonmua { get; set; } = null!;
        public string Idhang { get; set; } = null!;
        public int? Soluong { get; set; }
    }
}
