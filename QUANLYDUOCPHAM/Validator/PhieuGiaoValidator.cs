using FluentValidation;
using QUANLYDUOCPHAM.Extensions;
using QUANLYDUOCPHAM.ModelsDTO;
namespace QUANLYDUOCPHAM.Validator
{
    public class PhieuGiaoValidator : AbstractValidator<AppPhieugiaoDTO>
    {
        public PhieuGiaoValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Mã phiếu giao"));
            RuleFor(x => x.Id).MaximumLength(6).WithMessage("Mã phiếu giao không thể lớn hơn 6 ký tự!"); 
            RuleFor(x => x.Idkho).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Mã kho"));
            RuleFor(x => x.Idkho).MaximumLength(6).WithMessage("Mã kho không thể lớn hơn 6 ký tự!");
            RuleFor(x => x.Iddondat).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Mã đơn đặt"));
            RuleFor(x => x.Iddondat).MaximumLength(6).WithMessage("Mã đơn đặt không thể lớn hơn 6 ký tự!");
            RuleFor(x => x.Ngaygiao).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Ngày giao"));
        }
    }
}
