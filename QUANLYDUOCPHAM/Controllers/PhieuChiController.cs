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
using Microsoft.EntityFrameworkCore;
using QUANLYDUOCPHAM.BaseController;
using QUANLYDUOCPHAM.Models;
using QUANLYDUOCPHAM.ModelsDTO;

namespace QUANLYDUOCPHAM.Controllers
{
    [Route(UrlApi.phieuChiUrl)]
    [ApiController]
    public class PhieuChiController : ControllerBase
    {
        private readonly QUANLYKHODUOCPHAMContext _context;
        private readonly IMapper _mapper;

        public PhieuChiController(QUANLYKHODUOCPHAMContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/AppDondatDTO
        [HttpGet]
        [Route("getall")]
        public async Task<ActionResult> GetAllList()
        {
            using (var connection = new SqlConnection(new ConnectDB().conn))
            {
                try
                {
                    var query = @"SELECT   dbo.APP_PHIEUCHI.ID AS id, dbo.APP_PHIEUCHI.NGAYCHI AS ngaychi, dbo.APP_PHIEUCHI.SOTIENTRA AS sotientra, dbo.APP_PHIEUCHI.TENQUANLY AS tenquanly, 
                         dbo.APP_PHIEUCHI.IDNCC AS idncc, dbo.APP_PHIEUCHI.IDPHIEUNHAP AS idphieunhap, dbo.APP_NHACUNGCAP.TENNCC AS tenncc, dbo.APP_NHACUNGCAP.DIACHI AS diachi, 
                         dbo.APP_NHACUNGCAP.DIENTHOAI AS dienthoai, dbo.APP_PHIEUNHAP.NGAYNHAP AS ngaynhap, dbo.APP_PHIEUNHAP.TONGTIENNHAP AS tongtiennhap, 
                         dbo.APP_PHIEUNHAP.IDDONMUA AS iddonmua, dbo.APP_PHIEUNHAP.TRANGTHAINHAN AS trangthainhan, dbo.APP_KHO.TENKHO AS tenkho, 
                         dbo.APP_KHO.DIACHI AS diachikho
                         FROM         dbo.APP_PHIEUCHI INNER JOIN
                         dbo.APP_NHACUNGCAP ON dbo.APP_PHIEUCHI.IDNCC = dbo.APP_NHACUNGCAP.ID INNER JOIN
                         dbo.APP_PHIEUNHAP ON dbo.APP_PHIEUCHI.IDPHIEUNHAP = dbo.APP_PHIEUNHAP.ID INNER JOIN
                         dbo.APP_KHO ON dbo.APP_PHIEUNHAP.IDKHO = dbo.APP_KHO.ID";
                    var res = await connection.QueryAsync(query);
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
                        message = "Error" + NameTable.PhieuChi
                    });
                }
            }
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult> GetById(string id)
        {
            using (var connection = new SqlConnection(new ConnectDB().conn))
            {
                try
                {
                    var query = @"SELECT   dbo.APP_PHIEUCHI.ID AS id, dbo.APP_PHIEUCHI.NGAYCHI AS ngaychi, dbo.APP_PHIEUCHI.SOTIENTRA AS sotientra, dbo.APP_PHIEUCHI.TENQUANLY AS tenquanly, 
                         dbo.APP_PHIEUCHI.IDNCC AS idncc, dbo.APP_PHIEUCHI.IDPHIEUNHAP AS idphieunhap, dbo.APP_NHACUNGCAP.TENNCC AS tenncc, dbo.APP_NHACUNGCAP.DIACHI AS diachi, 
                         dbo.APP_NHACUNGCAP.DIENTHOAI AS dienthoai, dbo.APP_PHIEUNHAP.NGAYNHAP AS ngaynhap, dbo.APP_PHIEUNHAP.TONGTIENNHAP AS tongtiennhan, 
                         dbo.APP_PHIEUNHAP.IDDONMUA AS iddonmua, dbo.APP_PHIEUNHAP.TRANGTHAINHAN AS tongtiennhap, dbo.APP_KHO.TENKHO AS tenkho, 
                         dbo.APP_KHO.DIACHI AS diachikho
                         FROM         dbo.APP_PHIEUCHI INNER JOIN
                         dbo.APP_NHACUNGCAP ON dbo.APP_PHIEUCHI.IDNCC = dbo.APP_NHACUNGCAP.ID INNER JOIN
                         dbo.APP_PHIEUNHAP ON dbo.APP_PHIEUCHI.IDPHIEUNHAP = dbo.APP_PHIEUNHAP.ID INNER JOIN
                         dbo.APP_KHO ON dbo.APP_PHIEUNHAP.IDKHO = dbo.APP_KHO.ID AND dbo.APP_PHIEUCHI.ID='"+id+"'";
                    var res = await connection.QueryAsync(query);
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
                        message = "Error" + NameTable.PhieuChi
                    });
                }
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
            var nccs = await _context.AppNhacungcaps.ToListAsync();
            var phieunhaps = await _context.AppPhieunhaps.ToListAsync();
            List<AppPhieuchiDTO> kh = new List<AppPhieuchiDTO>();
            for (int i = 0; i < 200; i++)
            {
                kh.Add(new AppPhieuchiDTO()
                {
                    Id = RandomString(6),
                    Idncc = Convert.ToString(nccs[Faker.RandomNumber.Next(1, nccs.Count())].Id),
                    Idphieunhap = Convert.ToString(phieunhaps[Faker.RandomNumber.Next(1, nccs.Count())].Id),
                    Ngaychi = new DateTime(2020, 2, 7),
                    Sotientra = Faker.RandomNumber.Next(250000, 600000000),
                    Tenquanly = Faker.Name.FullName()
                }) ;
            }
            kh.ForEach(x =>
            {
                var result = _mapper.Map<AppPhieuchi>(x);
                _context.AddAsync(result);
            });
            await _context.SaveChangesAsync();
            return Ok("ok");
        }

        [HttpPost]
        [Route("update")]
        public async Task<ActionResult> Update([FromBody] AppPhieuchiDTO phieuchi)
        {
            var phieuChi = await _context.AppPhieuchis.AsNoTracking().FirstOrDefaultAsync(x => x.Id == phieuchi.Id);
            if (phieuChi == null)
            {
                return Ok(new ResultMessageResponse()
                {
                    success = false,
                    message = "Không tồn tại phiếu chi trên, vui lòng gthử lại!"
                });
            }
            var result = _mapper.Map<AppPhieuchi>(phieuchi);
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
        public async Task<ActionResult> ADD([FromBody] AppPhieuchiDTO phieuchi)
        {
            var phieuChi = await _context.AppPhieuchis.AsNoTracking().FirstOrDefaultAsync(x => x.Id == phieuchi.Id);
            if (phieuChi != null)
            {
                return Ok(new ResultMessageResponse()
                {
                    success = false,
                    message = "Đã tồn tại mã phiếu trên, vui lòng thử lại!"
                });
            }
            var result = _mapper.Map<AppPhieuchi>(phieuchi);
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
           
            var phieuChi = await _context.AppPhieuchis.AsNoTracking().FirstOrDefaultAsync(x => x.Id.Equals(id));
            if (phieuChi == null)
            {
                return Ok(new ResultMessageResponse()
                {
                    message = "Không tồn tại mã phiếu hiện tại, vui lòng thử lại!",
                    success = false
                });
            }
            _context.AppPhieuchis.Remove(phieuChi);
            await _context.SaveChangesAsync();
            return Ok(new ResultMessageResponse()
            {
                message = "Xóa thành công!",
                success = true,
            });
        }
    }
}
