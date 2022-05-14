using FluentValidation;
using QUANLYDUOCPHAM.Extensions;
using QUANLYDUOCPHAM.ModelsDTO;
namespace QUANLYDUOCPHAM.Validator
{
    public class PhieuThuValidator : AbstractValidator<AppPhieuthuDTO>
    {
        public PhieuThuValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Mã phiếu thu"));
            RuleFor(x => x.Id).MaximumLength(6).WithMessage("Mã phiếu thu không thể lớn hơn 6 ký tự!");
            RuleFor(x => x.Ngaythu).NotEmpty().WithMessage("Ngày lập phiếu thu không thể bỏ trống!");
            RuleFor(x => x.Idkhach).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Mã khách hàng"));
            RuleFor(x => x.Idkhach).MaximumLength(6).WithMessage("Mã khách hàng không thể lớn hơn 6 ký tự!");
            RuleFor(x => x.Idphieugiao).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Mã phiếu giao"));
            RuleFor(x => x.Idphieugiao).MaximumLength(6).WithMessage("Mã phiếu giao không thể lớn hơn 6 ký tự!");

        }
    }
}
