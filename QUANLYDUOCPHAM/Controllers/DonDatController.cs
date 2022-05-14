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
using QUANLYDUOCPHAM.BaseController;

namespace QUANLYDUOCPHAM.AutoMapper
{
    [Route(UrlApi.donDatUrl)]
    [ApiController]
    public class DonDatController : ControllerBase
    {
        private readonly QUANLYKHODUOCPHAMContext _context;
        private readonly IMapper _mapper;

        public DonDatController(QUANLYKHODUOCPHAMContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        [Route("getall")]
        public async Task<ActionResult> GetAppDondatDTO()
        {
            try
            {
                var res = await new GenericRepository<AppDondatDTO>(NameTable.DonDat).GetAllAsync();
                var re = new ResultMessageResponse()
                {
                    data = res,
                    success = true,
                };
                return Ok(re);
            }
            catch (Exception)
            {
                return Ok(new ResultMessageResponse()
                {
                    success = false,
                    message = "Error" + NameTable.DonDat
                });

            }
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult> GetById(string id)
        {
            try
            {
                var res = await new GenericRepository<AppDondatDTO>(NameTable.DonDat).GetAsync(id);
                var re = new ResultMessageResponse()
                {
                    data = res,
                    success = true,
                };
                return Ok(re);
            }
            catch (Exception)
            {

                var re = new ResultMessageResponse()
                {
                    success = false,
                    message = "Error" + NameTable.DonDat
                };
                return Ok(re);
            }
        }
        private static Random random = new Random();

        public static string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }


        [HttpGet]
        [Route("seeddata")]
        public async Task<ActionResult> SeedData()
        {
            var khang = await _context.AppKhachhangs.ToListAsync();
            List<AppDondatDTO> kh = new List<AppDondatDTO>();

            for (int i = 0; i < 100; i++)
            {
                kh.Add(new AppDondatDTO()
                {
                    Id = RandomString(6),
                    Makh = Convert.ToString(khang[Faker.RandomNumber.Next(1, khang.Count())].Id),
                    Ngaydat = new DateTime(2022, 2, 7),
                });
            }
            kh.ForEach(x =>
            {
                var result = _mapper.Map<AppDondat>(x);
                _context.AddAsync(result);
                Console.WriteLine(x);
            });
            await _context.SaveChangesAsync();
            return Ok("ok");
        }
        [HttpPost]
        [Route("update")]
        public async Task<ActionResult> UpdateDonDat([FromBody] AppDondatDTO donDat)
        {
            var isCheckDonDat = await _context.AppDonmuas.AsNoTracking().FirstOrDefaultAsync(x => x.Id.Equals(donDat.Id));
            var isCheckNCC = await _context.AppKhachhangs.AsNoTracking().FirstOrDefaultAsync(x => x.Id.Equals(donDat.Makh));
            if (isCheckDonDat == null)
            {
                return Ok(new ResultMessageResponse()
                {
                    success = false,
                    message = "Mã phiếu đơn đặt không tồn tại, vui vòng nhập mã khác!"
                });
            }

            if (isCheckNCC == null)
            {
                return Ok(new ResultMessageResponse()
                {
                    success = false,
                    message = "Không tồn tại khách hàng trên, vui lòng thử lại!"
                });
            }
            var result = _mapper.Map<AppDondat>(donDat);
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
        public async Task<ActionResult> AddDongmua([FromBody] AppDondatDTO donDat)
        {
            var isCheckDonDat = await _context.AppDondats.AsNoTracking().FirstOrDefaultAsync(x => x.Id.Equals(donDat.Id));
            var isCheckKh = await _context.AppKhachhangs.AsNoTracking().FirstOrDefaultAsync(x => x.Id.Equals(donDat.Makh));
            if (isCheckDonDat != null)
            {
                return Ok(new ResultMessageResponse()
                {
                    success = false,
                    message = "Mã phiếu đơn đặt bị trùng, vui lòng thử lại!"
                });
            }

            if (isCheckKh == null)
            {
                return Ok(new ResultMessageResponse()
                {
                    success = false,
                    message = "Không tồn khách hàng, vui lòng thử lại!"
                });
            }

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
        [HttpDelete("delete/{id}")]
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
