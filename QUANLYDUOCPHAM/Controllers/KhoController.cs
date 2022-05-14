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
using QUANLYDUOCPHAM.Extensions;
using QUANLYDUOCPHAM.Models;
using QUANLYDUOCPHAM.ModelsDTO;

namespace QUANLYDUOCPHAM.Controllers
{
    [Route(UrlApi.khoUrl)]
    [ApiController]
    public class KhoController : ControllerBase
    {
        private readonly QUANLYKHODUOCPHAMContext _context;
        private readonly IMapper _mapper;
        private readonly RandomString randomString;

        public KhoController(QUANLYKHODUOCPHAMContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/AppDondatDTO
        [HttpGet]
        [Route("getall")]
        public async Task<ActionResult> GetAllList()
        {
            var res = await new GenericRepository<AppKhoDTO>(NameTable.Kho).GetAllAsync();
            try
            {
                return Ok(new ResultMessageResponse()
                {
                    success = true,
                    data = res,
                    totalCount = res.Count()
                });
            }
            catch (Exception)
            {
                return Ok(new ResultMessageResponse()
                {
                    success = false,
                    message = "Error" + NameTable.Kho
                });
            }
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult> GetById(string id)
        {
            var res = await new GenericRepository<AppKhoDTO>(NameTable.Kho).GetAsync(id);
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
                    message = "Error" + NameTable.Kho
                });
            }
        }


        
        [HttpGet]
        [Route("seeddata")]
        public async Task<ActionResult> SeedData()
        {
            List<AppKhoDTO> kh = new List<AppKhoDTO>();

            for (int i = 0; i < 500; i++) {
                    kh.Add(new AppKhoDTO()
                    {
                        Id = randomString.Random(6),
                        Diachi = Faker.Address.StreetAddress(),
                        Tenkho = Faker.Name.FullName(),
                    });
            }
            kh.ForEach(x =>
            {
                var result = _mapper.Map<AppKho>(x);
                _context.AddAsync(result);
            });
            await _context.SaveChangesAsync();
            return Ok("ok");
        }

        [HttpPost]
        [Route("update")]
        public async Task<ActionResult> UpdateDonDat([FromBody] AppKhoDTO kho)
        {
            var k = await _context.AppKhos.AsNoTracking().FirstOrDefaultAsync(x=> x.Id == kho.Id);
            if (k == null)
            {
                return Ok(new ResultMessageResponse()
                {
                    success = false,
                    message = "Không tồn tại kho trên, vui lòng gthử lại!"
                });
            }
            var result = _mapper.Map<AppKho>(kho);
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

        [HttpPost]
        [Route("add")]
        public async Task<ActionResult> AddDongmua([FromBody] AppKhoDTO kho)
        {
            var k = await _context.AppKhos.AsNoTracking().FirstOrDefaultAsync(x => x.Id == kho.Id);

            if (k != null)
            {
                return Ok(new ResultMessageResponse()
                {
                    success = false,
                    message = "Đã tồn tại kho trên, vui lòng thử lại!"
                });
            }

            var result = _mapper.Map<AppKho>(kho);
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
        public async Task<IActionResult> DeleteAppDongDat(string id)
        {
            var khoHang = await _context.AppKhohangs.AsNoTracking().FirstOrDefaultAsync(x => x.Idkho.Equals(id));
            var phieuGiao = await _context.AppPhieugiaos.AsNoTracking().FirstOrDefaultAsync(x => x.Idkho.Equals(id));
            var phieuNhap = await _context.AppPhieunhaps.AsNoTracking().FirstOrDefaultAsync(x => x.Idkho.Equals(id));
            if (khoHang != null || phieuGiao != null || phieuNhap != null)
            {
                return Ok(new ResultMessageResponse()
                {
                    message = "Không thể xóa kho hiện tại, vui lòng thử lại!",
                    success = false
                });
            }
            var kho = await _context.AppKhos.AsNoTracking().FirstOrDefaultAsync(x => x.Id.Equals(id));
            if (kho == null)
            {
                return Ok(new ResultMessageResponse()
                {
                    message = "Không tồn tại kho hiện tại, vui lòng thử lại!",
                    success = false
                });
            }
            _context.AppKhos.Remove(kho);
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
