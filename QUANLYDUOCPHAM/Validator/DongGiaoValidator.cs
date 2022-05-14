using FluentValidation;
using QUANLYDUOCPHAM.Extensions;
using QUANLYDUOCPHAM.ModelsDTO;
namespace QUANLYDUOCPHAM.Validator
{
    public class DongGiaoValidator : AbstractValidator<AppDonggiaoDTO>
    {
        public DongGiaoValidator()
        {
            RuleFor(x => x.Idphieugiao).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Mã phiếu giao"));
            RuleFor(x => x.Idphieugiao).MaximumLength(6).WithMessage("Mã phiếu giao không thể lớn hơn 6 ký tự!");
            RuleFor(x => x.Idhang).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Mã hàng"));
            RuleFor(x => x.Idhang).MaximumLength(6).WithMessage("Mã hàng không thể lớn hơn 6 ký tự");
        }
    }
}
