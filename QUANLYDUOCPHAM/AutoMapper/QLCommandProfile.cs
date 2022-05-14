using AutoMapper;
using QUANLYDUOCPHAM.Models;
using QUANLYDUOCPHAM.ModelsDTO;

namespace QUANLYDUOCPHAM.AutoMapper
{
    public class QLCommandProfile : Profile
    {
        public QLCommandProfile()
        {
            CreateMap<AppDondatDTO, AppDondat>()
                .ForMember(x => x.MakhNavigation, opt => opt.Ignore())
                .ForMember(x => x.AppPhieugiaos, opt => opt.Ignore());
            CreateMap<AppDondat, AppDondatDTO>();

            CreateMap<AppHangDTO, AppHang>()
                .ForMember(x => x.AppDonggiaos, opt => opt.Ignore())
                .ForMember(x => x.AppDongmuas, opt => opt.Ignore())
                .ForMember(x => x.AppDongnhaps, opt => opt.Ignore())
                .ForMember(x => x.AppKhohangs, opt => opt.Ignore());
            CreateMap<AppHang, AppHangDTO>();

            CreateMap<AppDongdatDTO, AppDongdat>()
                .ForMember(x => x.IddondatNavigation, opt => opt.Ignore())
                .ForMember(x => x.IdhangNavigation, opt => opt.Ignore());
            CreateMap<AppDongdat, AppDongdatDTO>();

            CreateMap<AppDonggiaoDTO, AppDonggiao>()
                .ForMember(x => x.IdhangNavigation, opt => opt.Ignore())
                .ForMember(x => x.IdphieugiaoNavigation, opt => opt.Ignore());
            CreateMap<AppDonggiao, AppDonggiaoDTO>();

            CreateMap<AppDongmuaDTO, AppDongmua>()
                .ForMember(x => x.IddonmuaNavigation, opt => opt.Ignore())
                .ForMember(x => x.IdhangNavigation, opt => opt.Ignore());
            CreateMap<AppDongmua, AppDongmuaDTO>();

            CreateMap<AppDongnhapDTO, AppDongnhap>()
                .ForMember(x => x.IdhangNavigation, opt => opt.Ignore())
                .ForMember(x => x.IdphieunhapNavigation, opt => opt.Ignore());
            CreateMap<AppDongnhap, AppDongnhapDTO>();

            CreateMap<AppDonmuaDTO, AppDonmua>()
                .ForMember(x => x.IdnccNavigation, opt => opt.Ignore())
                .ForMember(x => x.AppDongmuas, opt => opt.Ignore())
                .ForMember(x => x.AppPhieunhaps, opt => opt.Ignore());
            CreateMap<AppDonmua, AppDonmuaDTO>();

            CreateMap<AppKhachhangDTO, AppKhachhang>()
                .ForMember(x => x.AppDondats, opt => opt.Ignore())
                .ForMember(x => x.AppPhieuthus, opt => opt.Ignore());
            CreateMap<AppKhachhang, AppKhachhangDTO>();

            CreateMap<AppKhoDTO, AppKho>()
                .ForMember(x => x.AppKhohangs, opt => opt.Ignore())
                .ForMember(x => x.AppPhieugiaos, opt => opt.Ignore())
                .ForMember(x => x.AppPhieunhaps, opt => opt.Ignore());
            CreateMap<AppKho, AppKhoDTO>();

            CreateMap<AppKhohangDTO, AppKhohang>()
                .ForMember(x => x.IdhangNavigation, opt => opt.Ignore())
                .ForMember(x => x.IdkhoNavigation, opt => opt.Ignore());
            CreateMap<AppKhohang, AppKhohangDTO>();

            CreateMap<AppNhacungcapDTO, AppNhacungcap>()
                .ForMember(x => x.AppDonmuas, opt => opt.Ignore())
                .ForMember(x => x.AppPhieuchis, opt => opt.Ignore());
            CreateMap<AppNhacungcap, AppNhacungcapDTO>();

            CreateMap<AppPhieuchiDTO, AppPhieuchi>()
                .ForMember(x => x.IdnccNavigation, opt => opt.Ignore())
                .ForMember(x => x.IdphieunhapNavigation, opt => opt.Ignore());
            CreateMap<AppPhieuchi, AppPhieuchiDTO>();

            CreateMap<AppPhieugiaoDTO, AppPhieugiao>()
                .ForMember(x => x.IddondatNavigation, opt => opt.Ignore())
                .ForMember(x => x.AppDonggiaos, opt => opt.Ignore())
                .ForMember(x => x.AppPhieuthus, opt => opt.Ignore())
                .ForMember(x => x.IdkhoNavigation, opt => opt.Ignore());
            CreateMap<AppPhieugiao, AppPhieugiaoDTO>();

            CreateMap<AppPhieunhapDTO, AppPhieunhap>()
                .ForMember(x => x.IddonmuaNavigation, opt => opt.Ignore())
                .ForMember(x => x.IdkhoNavigation, opt => opt.Ignore())
                .ForMember(x => x.AppDongnhaps, opt => opt.Ignore())
                .ForMember(x => x.AppPhieuchis, opt => opt.Ignore());
            CreateMap<AppPhieunhap, AppPhieunhapDTO>();

            CreateMap<AppPhieuthuDTO, AppPhieuthu>()
               .ForMember(x => x.IdkhachNavigation, opt => opt.Ignore())
               .ForMember(x => x.IdphieugiaoNavigation, opt => opt.Ignore());
            CreateMap<AppPhieuthu, AppPhieuthuDTO>();
        }
    }
}
