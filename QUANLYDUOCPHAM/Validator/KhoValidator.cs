using FluentValidation;
using QUANLYDUOCPHAM.Extensions;
using QUANLYDUOCPHAM.ModelsDTO;
namespace QUANLYDUOCPHAM.Validator
{
    public class KhoValidator : AbstractValidator<AppKhoDTO>
    {
        public KhoValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage(ValidatorString.GetMessageNotNull("Mã kho"));
            RuleFor(x => x.Id).MaximumLength(6).WithMessage("Mã kho không thể lớn hơn 6 ký tự!");
        }
    }
}
