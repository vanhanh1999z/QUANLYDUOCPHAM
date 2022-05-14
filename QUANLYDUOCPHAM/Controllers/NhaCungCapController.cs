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
    [Route(UrlApi.nhacCungCapUrl)]
    [ApiController]
    public class NhaCungCapController : ControllerBase
    {
        private readonly QUANLYKHODUOCPHAMContext _context;
        private readonly IMapper _mapper;

        public NhaCungCapController(QUANLYKHODUOCPHAMContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/AppDondatDTO
        [HttpGet]
        [Route("getall")]
        public async Task<ActionResult> GetAllList()
        {
            var res = await new GenericRepository<AppNhacungcapDTO>(NameTable.NhaCungCap).GetAllAsync();
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
                    message = "Error" + NameTable.NhaCungCap
                });
            }
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult> GetById(string id)
        {
            var res = await new GenericRepository<AppNhacungcapDTO>(NameTable.NhaCungCap).GetAsync(id);
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
                    message = "Error" + NameTable.NhaCungCap
                });
            }
        }

        [HttpPost]
        [Route("update")]
        public async Task<ActionResult> Update([FromBody] AppNhacungcapDTO Ncc)
        {
            var ncc = await _context.AppNhacungcaps.AsNoTracking().FirstOrDefaultAsync(x => x.Id == Ncc.Id);
            if (ncc == null)
            {
                return Ok(new ResultMessageResponse()
                {
                    success = false,
                    message = "Không tồn tại nhà cung cấp trên, vui lòng gthử lại!"
                });
            }
            var result = _mapper.Map<AppNhacungcap>(Ncc);
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

        [HttpGet]
        [Route("seeddata")]
        public async Task<ActionResult> SeedData()
        {
            List<AppNhacungcapDTO> kh = new List<AppNhacungcapDTO>();

            for (int i = 0; i < 20; i++)
            {
                var id = Convert.ToString(Faker.RandomNumber.Next(200, 200000));
                var isCheck = kh.Find(x => x.Id.Equals(id));
                if (isCheck == null)
                {
                    kh.Add(new AppNhacungcapDTO()
                    {
                        Id = id,
                        Tenncc = Faker.Name.FullName(),
                        Diachi = Faker.Address.StreetName(),
                        Dienthoai = "0234567890"
                    });
                }
            }
            kh.ForEach(x =>
            {
                var result = _mapper.Map<AppNhacungcap>(x);
                _context.AddAsync(result);
            });
            await _context.SaveChangesAsync();
            return Ok("ok");
        }
        [HttpPost]
        [Route("add")]
        public async Task<ActionResult> ADD([FromBody] AppNhacungcapDTO Ncc)
        {
            var ncc = await _context.AppNhacungcaps.AsNoTracking().FirstOrDefaultAsync(x => x.Id == Ncc.Id);
            if (ncc != null)
            {
                return Ok(new ResultMessageResponse()
                {
                    success = false,
                    message = "Đã tồn tại nhà cung cấp trên, vui lòng thử lại!"
                });
            }
            var result = _mapper.Map<AppNhacungcap>(Ncc);
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
            var donMua = await _context.AppDonmuas.AsNoTracking().FirstOrDefaultAsync(x => x.Idncc.Equals(id));
            var phieuChi = await _context.AppPhieuchis.AsNoTracking().FirstOrDefaultAsync(x => x.Idncc.Equals(id));
            if (phieuChi != null || donMua != null)
            {
                return Ok(new ResultMessageResponse()
                {
                    message = "Không thể xóa nhà cung cấp hiện tại, vui lòng thử lại!",
                    success = false
                });
            }
            var ncc = await _context.AppNhacungcaps.AsNoTracking().FirstOrDefaultAsync(x => x.Id.Equals(id));
            if (ncc == null)
            {
                return Ok(new ResultMessageResponse()
                {
                    message = "Không tồn tại nhà cung cấp hiện tại, vui lòng thử lại!",
                    success = false
                });
            }
            _context.AppNhacungcaps.Remove(ncc);
            await _context.SaveChangesAsync();
            return Ok(new ResultMessageResponse()
            {
                message = "Xóa thành công!",
                success = true,
            });
        }
    }
}
