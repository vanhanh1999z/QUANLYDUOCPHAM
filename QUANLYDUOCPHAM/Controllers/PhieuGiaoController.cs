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
    [Route(UrlApi.phieuGiaoUrl)]
    [ApiController]
    public class PhieuGiaoController : ControllerBase
    {
        private readonly QUANLYKHODUOCPHAMContext _context;
        private readonly IMapper _mapper;

        public PhieuGiaoController(QUANLYKHODUOCPHAMContext context, IMapper mapper)
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
                    var query = @"SELECT        TOP (100) PERCENT dbo.APP_PHIEUGIAO.ID AS id, dbo.APP_PHIEUGIAO.NGAYGIAO AS ngaygiao, dbo.APP_PHIEUGIAO.TONGTIENGIAO AS tongtiengiao, dbo.APP_PHIEUGIAO.IDKHO AS idkho, dbo.APP_KHO.TENKHO AS tenkho, 
                         dbo.APP_KHO.DIACHI AS diachi, dbo.APP_PHIEUGIAO.IDDONDAT AS iddondat, dbo.APP_DONDAT.NGAYDAT AS ngaydat, dbo.APP_DONDAT.MAKH AS makh, dbo.APP_KHACHHANG.TENKH AS tenkh, 
                         dbo.APP_KHACHHANG.DIACHI AS diachikh, dbo.APP_KHACHHANG.DIENTHOAI AS dienthoai, dbo.APP_PHIEUGIAO.TRANGTHAINHAN AS trangthainhan
                            FROM            dbo.APP_PHIEUGIAO INNER JOIN
                                                     dbo.APP_KHO ON dbo.APP_PHIEUGIAO.IDKHO = dbo.APP_KHO.ID INNER JOIN
                                                     dbo.APP_DONDAT ON dbo.APP_PHIEUGIAO.IDDONDAT = dbo.APP_DONDAT.ID INNER JOIN
                                                     dbo.APP_KHACHHANG ON dbo.APP_DONDAT.MAKH = dbo.APP_KHACHHANG.ID
                            ORDER BY ngaygiao DESC";
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
                        message = "Error" + NameTable.PhieuGiao
                    });
                }
            }
            //var res = await new GenericRepository<AppPhieugiaoDTO>(NameTable.PhieuGiao).GetAllAsync();
            //try
            //{
            //    return Ok(new ResultMessageResponse()
            //    {
            //        success = true,
            //        data = res,
            //        totalCount = res.Count(),
            //    });
            //}
            //catch (Exception)
            //{
            //    return Ok(new ResultMessageResponse()
            //    {
            //        success = false,
            //        message = "Error" + NameTable.PhieuGiao
            //    });
            //}
        }


        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult> GetById(string id)
        {
            using (var connection = new SqlConnection(new ConnectDB().conn))
            {
                try
                {
                    var query = @"SELECT        TOP (100) PERCENT dbo.APP_PHIEUGIAO.ID AS id, dbo.APP_PHIEUGIAO.NGAYGIAO AS ngaygiao, dbo.APP_PHIEUGIAO.TONGTIENGIAO AS tongtiengiao, dbo.APP_PHIEUGIAO.IDKHO AS idkho, dbo.APP_KHO.TENKHO AS tenkho, 
                         dbo.APP_KHO.DIACHI AS diachi, dbo.APP_PHIEUGIAO.IDDONDAT AS iddondat, dbo.APP_DONDAT.NGAYDAT AS ngaydat, dbo.APP_DONDAT.MAKH AS makh, dbo.APP_KHACHHANG.TENKH AS tenkh, 
                         dbo.APP_KHACHHANG.DIACHI AS diachikh, dbo.APP_KHACHHANG.DIENTHOAI AS dienthoai, dbo.APP_PHIEUGIAO.TRANGTHAINHAN AS trangthainhan
                        FROM            dbo.APP_PHIEUGIAO INNER JOIN
                                                 dbo.APP_KHO ON dbo.APP_PHIEUGIAO.IDKHO = dbo.APP_KHO.ID INNER JOIN
                                                 dbo.APP_DONDAT ON dbo.APP_PHIEUGIAO.IDDONDAT = dbo.APP_DONDAT.ID INNER JOIN
                                                 dbo.APP_KHACHHANG ON dbo.APP_DONDAT.MAKH = dbo.APP_KHACHHANG.ID
                        WHERE        (dbo.APP_PHIEUGIAO.ID = '" + id + @"')
                        ORDER BY ngaygiao DESC";
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
                        message = "Error" + NameTable.PhieuGiao
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
            var khos = await _context.AppKhos.ToListAsync();
            var dondats = await _context.AppDondats.ToListAsync();
            List<AppPhieugiaoDTO> kh = new List<AppPhieugiaoDTO>();
            //kh.Add(new AppPhieugiaoDTO()
            //{
            //    Id = RandomString(6),
            //    Idkho = Convert.ToString(khos[Faker.RandomNumber.Next(1, khos.Count())].Id),
            //    Iddondat = Convert.ToString(dondats[Faker.RandomNumber.Next(1, dondats.Count())].Id),
            //    Ngaygiao = new DateTime(2022, 2, 7),
            //    Tongtiengiao = Faker.RandomNumber.Next(250000, 600000000),
            //    Trangthainhan = Faker.Boolean.Random()
            //});
            for (int i = 0; i < 200; i++)
            {
                kh.Add(new AppPhieugiaoDTO()
                {
                    Id = RandomString(6),
                    Idkho = Convert.ToString(khos[Faker.RandomNumber.Next(1, khos.Count())].Id),
                    Iddondat = Convert.ToString(dondats[Faker.RandomNumber.Next(1, dondats.Count())].Id),
                    Ngaygiao = new DateTime(2022, 2, 7),
                    Tongtiengiao = Faker.RandomNumber.Next(250000, 600000000),
                    Trangthainhan = Faker.Boolean.Random()
                });
            }
            kh.ForEach(x =>
            {
                var result = _mapper.Map<AppPhieugiao>(x);
                _context.AddAsync(result);
                Console.WriteLine(x);
            });
            await _context.SaveChangesAsync();
            return Ok("ok");
        }

        [HttpPost]
        [Route("update")]
        public async Task<ActionResult> Update([FromBody] AppPhieugiaoDTO phieugiao)
        {
            var phieuGiao = await _context.AppPhieugiaos.AsNoTracking().FirstOrDefaultAsync(x => x.Id == phieugiao.Id);
            if (phieuGiao == null)
            {
                return Ok(new ResultMessageResponse()
                {
                    success = false,
                    message = "Không tồn tại phiếu giao trên, vui lòngg thử lại!"
                });
            }
            var result = _mapper.Map<AppPhieugiao>(phieugiao);
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
        public async Task<ActionResult> ADD([FromBody] AppPhieugiaoDTO phieugiao)
        {
            var phieuGiao = await _context.AppPhieuchis.AsNoTracking().FirstOrDefaultAsync(x => x.Id == phieugiao.Id);
            if (phieuGiao != null)
            {
                return Ok(new ResultMessageResponse()
                {
                    success = false,
                    message = "Đã tồn tại mã phiếu trên, vui lòng thử lại!"
                });
            }
            var result = _mapper.Map<AppPhieugiao>(phieugiao);
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

            var phieuGiao = await _context.AppPhieugiaos.AsNoTracking().FirstOrDefaultAsync(x => x.Id.Equals(id));
            if (phieuGiao == null)
            {
                return Ok(new ResultMessageResponse()
                {
                    message = "Không tồn tại mã phiếu hiện tại, vui lòng thử lại!",
                    success = false
                });
            }
            _context.AppPhieugiaos.Remove(phieuGiao);
            await _context.SaveChangesAsync();
            return Ok(new ResultMessageResponse()
            {
                message = "Xóa thành công!",
                success = true,
            });
        }
    }
}
