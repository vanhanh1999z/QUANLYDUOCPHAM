using FluentValidation;
using QUANLYDUOCPHAM.Extensions;
using QUANLYDUOCPHAM.ModelsDTO;
namespace QUANLYDUOCPHAM.Validator
{
    public class DonDatValidator : AbstractValidator<AppDondatDTO>
    {
        public DonDatValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Mã đơn đặt"));
            RuleFor(x => x.Id).MaximumLength(6).WithMessage("Mã đơn đặt không thể lớn hơn 6 ký tự!");
            RuleFor(x => x.Makh).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Mã khách hàng"));
            RuleFor(x => x.Makh).MaximumLength(6).WithMessage("Mã khách hàng không thể lớn hơn 6 ký tự");
            RuleFor(x => x.Ngaydat).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Ngày đặt"));
        }
    }
}
