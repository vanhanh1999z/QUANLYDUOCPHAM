using FluentValidation;
using QUANLYDUOCPHAM.Extensions;
using QUANLYDUOCPHAM.ModelsDTO;
namespace QUANLYDUOCPHAM.Validator
{
    public class KhacHangValidator : AbstractValidator<AppKhachhangDTO>
    {
        public KhacHangValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Mã đơn đặt"));
            RuleFor(x => x.Id).NotNull().WithMessage(ValidatorString.GetMessageNotNull("Mã đơn đặt"));
            RuleFor(x => x.Id).MaximumLength(6).WithMessage("Mã đơn đặt không thể lớn hơn 6 ký tự!");
            RuleFor(x => x.Dienthoai).MaximumLength(10).WithMessage("Số điện thoại không thể lớn hơn 10 số!");
        }
    }
}
