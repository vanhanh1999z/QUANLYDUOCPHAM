using System;
using System.Collections.Generic;

namespace QUANLYDUOCPHAM.ModelsDTO
{
    public partial class AppDonmuaDTO
    {
        public string Id { get; set; } = null!;
        public string Idncc { get; set; } = null!;
        public DateTime Ngaymua { get; set; }
    }
}
