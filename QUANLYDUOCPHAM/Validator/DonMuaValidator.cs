using FluentValidation;
using QUANLYDUOCPHAM.Extensions;
using QUANLYDUOCPHAM.ModelsDTO;
namespace QUANLYDUOCPHAM.Validator
{
    public class DonMuaValidator : AbstractValidator<AppDonmuaDTO>
    {
        public DonMuaValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Mã đơn mua"));
            RuleFor(x => x.Id).MaximumLength(6).WithMessage("Mã đơn mua không thể lớn hơn 6 ký tự");
            RuleFor(x => x.Idncc).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Mã nhà cung cấp"));
            RuleFor(x => x.Idncc).MaximumLength(6).WithMessage("Mã nhà cung cấp không thể lớn hơn 6 ký tự");
            RuleFor(x => x.Ngaymua).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Ngày mua không thể để trống"));

        }
    }
}
