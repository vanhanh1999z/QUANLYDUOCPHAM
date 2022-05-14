using FluentValidation;
using QUANLYDUOCPHAM.Extensions;
using QUANLYDUOCPHAM.ModelsDTO;
namespace QUANLYDUOCPHAM.Validator
{
    public class PhieuNhapValidator : AbstractValidator<AppPhieunhapDTO>
    {
        public PhieuNhapValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Mã phiếu nhập"));
            RuleFor(x => x.Id).MaximumLength(6).WithMessage("Mã phiếu nhập không thể lớn hơn 6 ký tự!");
            RuleFor(x => x.Ngaynhap).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Ngày nhập hàng"));
            RuleFor(x => x.Idkho).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Mã kho"));
            RuleFor(x => x.Idkho).MaximumLength(6).WithMessage("Mã kho hàng không thể lớn hơn 6 ký tự!");
            RuleFor(x => x.Iddonmua).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Mã đơn mua"));
            RuleFor(x => x.Iddonmua).MaximumLength(6).WithMessage("Mã đơn mua thể lớn hơn 6 ký tự!");
        }
    }
}
