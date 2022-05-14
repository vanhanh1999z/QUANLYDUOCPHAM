#nullable disable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QUANLYDUOCPHAM.BaseController;
using QUANLYDUOCPHAM.Models;
using QUANLYDUOCPHAM.ModelsDTO;

namespace QUANLYDUOCPHAM.Controllers
{
    [Route(UrlApi.phieuthuUrl)]
    [ApiController]
    public class PhieuThuController : ControllerBase
    {
        private readonly QUANLYKHODUOCPHAMContext _context;
        private readonly IMapper _mapper;

        public PhieuThuController(QUANLYKHODUOCPHAMContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/AppDondatDTO
        [HttpGet]
        [Route("getall")]
        public async Task<ActionResult> GetAllList()
        {
            var res = await new GenericRepository<AppPhieuthuDTO>(NameTable.PhieuThu).GetAllAsync();
            try
            {
                return Ok(new ResultMessageResponse()
                {
                    success = true,
                    data = res,
                    totalCount = res.Count(),
                });
            }
            catch (Exception)
            {
                return Ok(new ResultMessageResponse()
                {
                    success = false,
                    message = "Error" + NameTable.PhieuThu
                });
            }
        }


        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult> GetById(string id)
        {
            var res = await new GenericRepository<AppPhieuthuDTO>(NameTable.PhieuThu).GetAsync(id);
            try
            {
                return Ok(new ResultMessageResponse()
                {
                    success = true,
                    data = res,
                    totalCount = 1
                });
            }
            catch (Exception)
            {
                return Ok(new ResultMessageResponse()
                {
                    success = false,
                    message = "Error" + NameTable.PhieuThu
                });
            }
        }

        [HttpPost]
        [Route("update")]
        public async Task<ActionResult> Update([FromBody] AppPhieuthuDTO appPhieuthu)
        {
            var phieuThu = await _context.AppPhieuthus.AsNoTracking().FirstOrDefaultAsync(x => x.Id == appPhieuthu.Id);
            if (phieuThu == null)
            {
                return Ok(new ResultMessageResponse()
                {
                    success = false,
                    message = "Không tồn tại phiếu trên, vui lòng thử lại!"
                });
            }
            var result = _mapper.Map<AppPhieuthu>(phieuThu);
            _context.Attach(result);
            _context.Entry(result).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            var res = new ResultMessageResponse()
            {
                success = true,
                message = "Thành công",
                data = result
            };
            return Ok(res);
        }

        //[HttpGet]
        //[Route("seeddata")]
        //public async Task<ActionResult> SeedData()
        //{
        //    for (int i = 0; i < 10; i++)
        //    {
        //        AppNhacungcapDTO nccDTO = new AppNhacungcapDTO()
        //        {
        //            Id = "NCC" + i,
        //            Tenncc = "Nha Cung Cap " + (i + 1),
        //            Diachi = "Dia chi " + (i + 1),
        //            Dienthoai = "091540023" + i
        //        };
        //        var result = _mapper.Map<AppNhacungcap>(nccDTO);
        //        await _context.AddAsync(result);
        //    }
        //    await _context.SaveChangesAsync();
        //    return Ok("ahihi");
        //}
        [HttpPost]
        [Route("add")]
        public async Task<ActionResult> Add([FromBody] AppPhieuthuDTO appPhieuthu)
        {
            var phieuThu = await _context.AppPhieuthus.AsNoTracking().FirstOrDefaultAsync(x => x.Id == appPhieuthu.Id);
            if (phieuThu != null)
            {
                return Ok(new ResultMessageResponse()
                {
                    success = false,
                    message = "Đã tồn tại phiếu trên, vui lòng thử lại!"
                });
            }
            var result = _mapper.Map<AppPhieuthu>(phieuThu);
            await _context.AddAsync(result);
            await _context.SaveChangesAsync();
            var res = new ResultMessageResponse()
            {
                success = true,
                message = "Thành công",
                data = result
            };
            return Ok(res);
        }

        // DELETE: api/DonMua/5
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(string id)
        {

            var phieuThu = await _context.AppPhieuthus.AsNoTracking().FirstOrDefaultAsync(x => x.Id.Equals(id));
            if (phieuThu == null)
            {
                return Ok(new ResultMessageResponse()
                {
                    message = "Không tồn tại mã phiếu hiện tại, vui lòng thử lại!",
                    success = false
                });
            }
            _context.AppPhieuthus.Remove(phieuThu);
            await _context.SaveChangesAsync();
            return Ok(new ResultMessageResponse()
            {
                message = "Xóa thành công!",
                success = true,
            });
        }
    }
}
