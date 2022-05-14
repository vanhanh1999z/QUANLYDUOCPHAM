using FluentValidation;
using FluentValidation.AspNetCore;
using QUANLYDUOCPHAM.ModelsDTO;

namespace QUANLYDUOCPHAM.Validator.ConfigureServices
{
    public static class ConfigureServices
    {

        public static void AddValidator(this IServiceCollection services)
        {
            services.AddFluentValidation();
            services.AddTransient<IValidator<AppDondatDTO>, DonDatValidator>();
            services.AddTransient<IValidator<AppDongdatDTO>, DongDatValidator>();
            services.AddTransient<IValidator<AppDonggiaoDTO>, DongGiaoValidator>();
            services.AddTransient<IValidator<AppDongmuaDTO>, DongMuaValidator>();
            services.AddTransient<IValidator<AppDongnhapDTO>, DongNhapValidator>();
            services.AddTransient<IValidator<AppDonmuaDTO>, DonMuaValidator>();
            services.AddTransient<IValidator<AppHangDTO>, HangValidator>();
            services.AddTransient<IValidator<AppKhachhangDTO>, KhacHangValidator>();
            services.AddTransient<IValidator<AppKhohangDTO>, KhoHangValidator>();
            services.AddTransient<IValidator<AppKhoDTO>, KhoValidator>();
            services.AddTransient<IValidator<AppNhacungcapDTO>, NhaCungCapValidator>();
            services.AddTransient<IValidator<AppPhieuchiDTO>, PhieuChiValidator>();
            services.AddTransient<IValidator<AppPhieugiaoDTO>, PhieuGiaoValidator>();
            services.AddTransient<IValidator<AppPhieunhapDTO>, PhieuNhapValidator>();
            services.AddTransient<IValidator<AppPhieuthuDTO>, PhieuThuValidator>();

        }
    }
}
