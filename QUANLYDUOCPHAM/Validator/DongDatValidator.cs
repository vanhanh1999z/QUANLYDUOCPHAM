using FluentValidation;
using QUANLYDUOCPHAM.Extensions;
using QUANLYDUOCPHAM.ModelsDTO;
namespace QUANLYDUOCPHAM.Validator
{
    public class DongDatValidator : AbstractValidator<AppDongdatDTO>
    {
        public DongDatValidator()
        {
            RuleFor(x => x.Iddondat).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Mã đơn đặt"));
            RuleFor(x => x.Iddondat).MaximumLength(6).WithMessage("Mã đơn đặt không thể lớn hơn 6 ký tự!");
            RuleFor(x => x.Idhang).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Mã hàng"));
            RuleFor(x => x.Idhang).MaximumLength(6).WithMessage("Mã hàng không thể lớn hơn 6 ký tự");
        }
    }
}
