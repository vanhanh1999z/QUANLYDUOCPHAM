using FluentValidation;
using QUANLYDUOCPHAM.Extensions;
using QUANLYDUOCPHAM.ModelsDTO;
namespace QUANLYDUOCPHAM.Validator
{
    public class KhoHangValidator : AbstractValidator<AppKhohangDTO>
    {
        public KhoHangValidator()
        {
            RuleFor(x => x.Idkho).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Mã kho"));
            RuleFor(x => x.Idkho).MaximumLength(6).WithMessage("Mã kho không thể lớn hơn 6 ký tự!");
            RuleFor(x => x.Idhang).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Mã hàng"));
            RuleFor(x => x.Idhang).MaximumLength(6).WithMessage("Mã hàng không thể lớn hơn 6 ký tự");
            RuleFor(x => x.Slnhap).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Số lượng nhập"));
        }
    }
}
