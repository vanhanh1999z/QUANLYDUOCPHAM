using FluentValidation;
using QUANLYDUOCPHAM.Extensions;
using QUANLYDUOCPHAM.ModelsDTO;
namespace QUANLYDUOCPHAM.Validator
{
    public class NhaCungCapValidator : AbstractValidator<AppNhacungcapDTO>
    {
        public NhaCungCapValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Mã nhà cung cấp"));
            RuleFor(x => x.Id).MaximumLength(6).WithMessage(("Mã nhà cung cấp không thể lớn hơn 6 ký tự!"));
            RuleFor(x => x.Tenncc).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Tên nhà cung cấp"));
            RuleFor(x => x.Dienthoai).MaximumLength(10).WithMessage(("Số điện thoại không thể lớn hơn 10 ký tự!"));
        }
    }
}
