using FluentValidation;
using QUANLYDUOCPHAM.Extensions;
using QUANLYDUOCPHAM.ModelsDTO;
namespace QUANLYDUOCPHAM.Validator
{
    public class HangValidator : AbstractValidator<AppHangDTO>
    {
        public HangValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Mã hàng"));
            RuleFor(x => x.Id).NotNull().WithMessage(ValidatorString.GetMessageNotNull("Mã hàng"));
            RuleFor(x => x.Id).MaximumLength(6).WithMessage("Mã hàng không thể lớn hơn 6 ký tự!");

            RuleFor(x => x.Donvi).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Đơn vị"));
            RuleFor(x => x.Donvi).NotNull().WithMessage(ValidatorString.GetMessageNotNull("Đơn vị"));
            RuleFor(x => x.Donvi).MaximumLength(10).WithMessage("Đơn vị tính không thể lớn hơn 10 ký tự!");
        }
    }
}
