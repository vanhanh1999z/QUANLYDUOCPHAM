#nullable disable
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using QUANLYDUOCPHAM.BaseController;
using QUANLYDUOCPHAM.Models;
using QUANLYDUOCPHAM.ModelsDTO;

namespace QUANLYDUOCPHAM.Controllers
{
    [Route(UrlApi.khacHangUrl)]
    [ApiController]
    public class KhachHangController : ControllerBase
    {
        private readonly QUANLYKHODUOCPHAMContext _context;
        private readonly IMapper _mapper;
        private readonly string _conn = new ConnectDB().conn;

        public KhachHangController(QUANLYKHODUOCPHAMContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/AppDondatDTO
        [HttpGet]
        [Route("getall")]
        public async Task<ActionResult> GetAllKhachHang()
        {
            var kh = await new GenericRepository<AppKhachhangDTO>(NameTable.KhachHang).GetAllAsync();
            try
            {
                return Ok(new ResultMessageResponse()
                {
                    success = true,
                    data = kh,
                    totalCount = kh.Count()
                });
            }
            catch (Exception)
            {
                return Ok(new ResultMessageResponse()
                {
                    success = false,
                    message = "Error" + NameTable.KhachHang
                });
            }
        }

        [HttpGet]
        [Route("seeddata")]
        public async Task<ActionResult> SeedData()
        {
            List<AppKhachhangDTO> kh = new List<AppKhachhangDTO>();

            for (int i = 0; i < 20; i++)
            {
                var id = Convert.ToString(Faker.RandomNumber.Next(200, 200000));
                var isCheck = kh.Find(x => x.Id.Equals(id));
                if (isCheck == null)
                {
                    kh.Add(new AppKhachhangDTO()
                    {
                        Id = id,
                        Tenkh = Faker.Name.FullName(),
                        Diachi = Faker.Address.StreetName(),
                        Dienthoai = "0915400230"
                    });
                }
            }
            kh.ForEach(x =>
            {
                var result = _mapper.Map<AppKhachhang>(x);
                _context.AddAsync(result);
            });
            await _context.SaveChangesAsync();
            return Ok("ok");
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult> GetById(string id)
        {
            var res = await new GenericRepository<AppKhachhangDTO>(NameTable.KhachHang).GetAsync(id);
            try
            {

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
                    message = "Error" + NameTable.KhachHang
                });
            }
        }

        [HttpPost]
        [Route("update")]
        public async Task<ActionResult> UpdateDonDat([FromBody] AppKhachhangDTO kh)
        {
            using (var connection = new SqlConnection(_conn))
            {
                try
                {
                    var query = String.Format("UPDATE APP_KHACHHANG SET ID = '{0}', TENKH = N'{1}', DIACHI = N'{2}', DIENTHOAI = N'{3}' WHERE ID = {0}",
                        kh.Id, kh.Tenkh, kh.Diachi, kh.Dienthoai);
                    var khachhang = await connection.QueryAsync(query);
                    var res = new ResultMessageResponse()
                    {
                        success = true,
                        message = "Thành công",
                        data = khachhang
                    };
                    return Ok(res);
                }
                catch (Exception)
                {

                    var res = new ResultMessageResponse()
                    {
                        success = false,
                        message = "Error!",
                    };
                    return Ok(res); ;
                }
            }
        }

        [HttpPost]
        [Route("add")]
        public async Task<ActionResult> AddDongmua([FromBody] AppKhachhangDTO kh)
        {

            var khachhang = await _context.AppDonmuas.AsNoTracking().FirstOrDefaultAsync(x => x.Id.Equals(kh.Id));
            if (khachhang != null)
            {
                return Ok(new ResultMessageResponse()
                {
                    success = false,
                    message = "Mã khách hàng đã tồn tại, vui lòng thử lại!"
                });
            }


            var result = _mapper.Map<AppKhachhang>(kh);
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
        public async Task<IActionResult> DeleteKhachHang(string id)
        {

            var donDat = await _context.AppDondats.AsNoTracking().FirstOrDefaultAsync(x => x.Makh.Equals(id));
            var phieuThu = await _context.AppPhieuthus.AsNoTracking().FirstOrDefaultAsync(x => x.Id.Equals(id));

            if (donDat != null || phieuThu != null)
            {
                return Ok(new ResultMessageResponse()
                {
                    message = "Không thể xóa khách hàng, vui lòng thử lại sau",
                    success = false
                });
            }
            var khachHang = await _context.AppKhachhangs.AsNoTracking().FirstOrDefaultAsync(x => x.Id.Equals(id));
            if (khachHang == null)
            {
                return Ok(new ResultMessageResponse()
                {
                    message = "Không tồn khách hàng hiện tại, vui lòng thử lại sau",
                    success = false
                });
            }
            _context.AppKhachhangs.Remove(khachHang);
            await _context.SaveChangesAsync();
            return Ok(new ResultMessageResponse()
            {
                message = "Xóa thành công!",
                success = true,
            });
        }


    }
}
