using FluentValidation;
using QUANLYDUOCPHAM.Extensions;
using QUANLYDUOCPHAM.ModelsDTO;
namespace QUANLYDUOCPHAM.Validator
{
    public class DongMuaValidator : AbstractValidator<AppDongmuaDTO>
    {
        public DongMuaValidator()
        {
            RuleFor(x => x.Iddonmua).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Mã đơn mua"));
            RuleFor(x => x.Iddonmua).MaximumLength(6).WithMessage("Mã đơn mua không thể lớn hơn 6 ký tự!");
            RuleFor(x => x.Idhang).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Mã hàng"));
            RuleFor(x => x.Idhang).MaximumLength(6).WithMessage("Mã hàng không thể lớn hơn 6 ký tự");
        }
    }
}
