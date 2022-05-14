#nullable disable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QUANLYDUOCPHAM.Models;
using QUANLYDUOCPHAM.ModelsDTO;

namespace QUANLYDUOCPHAM.Controllers
{
    [Route(UrlApi.dongDatUrl)]
    [ApiController]
    public class DongDatController : ControllerBase
    {
        private readonly QUANLYKHODUOCPHAMContext _context;
        private readonly IMapper _mapper;

        public DongDatController(QUANLYKHODUOCPHAMContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        [Route("getall")]
        public async Task<ActionResult> GetAppDondatDTO()
        {
            var res = from x in _context.AppDongdats
                      select new AppDongdatDTO
                      {
                          Idhang = x.Idhang,
                          Iddondat = x.Iddondat,
                          Soluong = x.Soluong
                      };
            var re = new ResultMessageResponse()
            {
                data = res,
                success = true,
            };
            return Ok(re);
        }
   
        [HttpPost]
        [Route("add")]
        public async Task<ActionResult> AddDongmua([FromBody] AppDongdatDTO dongDat)
        {
            var result = _mapper.Map<AppDondat>(donDat);
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
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppDongDat(string id)
        {
            var isCheck = await _context.AppDondats.AsNoTracking().FirstOrDefaultAsync(x => x.Id.Equals(id));
            if (isCheck == null)
            {
                return Ok(new ResultMessageResponse()
                {
                    message = "Không tồn tại phiếu đặt hàng trên, vui lòng thử lại!",
                    success = false
                });
            }
            _context.AppDondats.Remove(isCheck);
            await _context.SaveChangesAsync();
            return Ok(new ResultMessageResponse()
            {
                message = "Xóa thành công!",
                success = true,
            });
        }

        private bool AppDongmuaExists(string id)
        {
            return _context.AppDongmuas.Any(e => e.Iddonmua == id);
        }
    }
}
