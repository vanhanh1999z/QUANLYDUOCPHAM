using FluentValidation;
using QUANLYDUOCPHAM.Extensions;
using QUANLYDUOCPHAM.ModelsDTO;
namespace QUANLYDUOCPHAM.Validator
{
    public class DongNhapValidator : AbstractValidator<AppDongnhapDTO>
    {
        public DongNhapValidator()
        {
            RuleFor(x => x.Idphieunhap).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Mã phiếu nhập"));
            RuleFor(x => x.Idphieunhap).MaximumLength(6).WithMessage("Mã phiếu nhập không thể lớn hơn 6 ký tự!");
            RuleFor(x => x.Idhang).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Mã hàng"));
            RuleFor(x => x.Idhang).MaximumLength(6).WithMessage("Mã hàng không thể lớn hơn 6 ký tự");
        }
    }
}
