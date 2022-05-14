using FluentValidation;
using QUANLYDUOCPHAM.Extensions;
using QUANLYDUOCPHAM.ModelsDTO;
namespace QUANLYDUOCPHAM.Validator
{
    public class PhieuChiValidator : AbstractValidator<AppPhieuchiDTO>
    {
        public PhieuChiValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Mã phiếu chi"));
            RuleFor(x => x.Id).MaximumLength(6).WithMessage("Mã phiếu chi không thể lớn hơn 6 ký tự!");
            RuleFor(x => x.Ngaychi).NotEmpty().WithMessage("Ngày lập phiếu chi không thể bỏ trống!");
            RuleFor(x => x.Idncc).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Mã nhà cung cấp"));
            RuleFor(x => x.Idncc).MaximumLength(6).WithMessage("Mã nhà cung cấp không thể lớn hơn 6 ký tự!");
            RuleFor(x => x.Idphieunhap).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Mã phiếu nhập"));
            RuleFor(x => x.Idphieunhap).MaximumLength(6).WithMessage("Mã phiếu nhập không thể lớn hơn 6 ký tự!");

        }
    }
}
