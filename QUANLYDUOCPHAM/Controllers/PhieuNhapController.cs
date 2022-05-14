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
    [Route(UrlApi.phieuNhapUrl)]
    [ApiController]
    public class PhieuNhapController : ControllerBase
    {
        private readonly QUANLYKHODUOCPHAMContext _context;
        private readonly IMapper _mapper;

        public PhieuNhapController(QUANLYKHODUOCPHAMContext context, IMapper mapper)
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
                    var query = @"SELECT PN.ID, PN.TONGTIENNHAP, PN.NGAYNHAP, K.DIACHI AS DIACHIKHO , K.TENKHO, DM.ID AS IDDONMUA, NCC.TENNCC, NCC.DIACHI AS DIACHINCC, NCC.DIENTHOAI AS DIENTHOAINCC, DM.NGAYMUA, PN.TRANGTHAINHAN
                                FROM APP_PHIEUNHAP AS PN, APP_KHO AS K, APP_DONMUA AS DM, APP_NHACUNGCAP AS NCC
                                WHERE PN.IDKHO = K.ID AND  PN.IDDONMUA  = DM.ID AND NCC.ID = DM.IDNCC";
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
                        message = "Error" + NameTable.PhieuNhap
                    });
                }
            }
            //var res = await new GenericRepository<AppPhieunhapDTO>(NameTable.PhieuNhap).GetAllAsync();
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
            //        message = "Error" + NameTable.PhieuNhap
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
                    var query = @"SELECT PN.ID, PN.TONGTIENNHAP, PN.NGAYNHAP, K.DIACHI AS DIACHIKHO ,K.ID AS IDKHO, K.TENKHO, DM.ID AS IDDONMUA, NCC.TENNCC, NCC.DIACHI AS DIACHINCC, NCC.DIENTHOAI AS DIENTHOAINCC, DM.NGAYMUA, PN.TRANGTHAINHAN
                                FROM APP_PHIEUNHAP AS PN, APP_KHO AS K, APP_DONMUA AS DM, APP_NHACUNGCAP AS NCC
                                WHERE PN.IDKHO = K.ID AND  PN.IDDONMUA  = DM.ID AND NCC.ID = DM.IDNCC and PN.ID='" + id + "'";
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
                        message = "Error" + NameTable.PhieuNhap
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
            var donmuas = await _context.AppDonmuas.ToListAsync();
            List<AppPhieunhapDTO> kh = new List<AppPhieunhapDTO>();
            for (int i = 0; i < 200; i++)
            {
                kh.Add(new AppPhieunhapDTO()
                {
                    Id = RandomString(6),
                    Ngaynhap = DateTime.Now,
                    Tongtiennhap = Faker.RandomNumber.Next(20000,2000000),
                    Trangthainhan = Faker.Boolean.Random(),
                    Idkho = Convert.ToString(khos[Faker.RandomNumber.Next(1, khos.Count())].Id),
                    Iddonmua = Convert.ToString(donmuas[Faker.RandomNumber.Next(1, donmuas.Count())].Id),
                });
            }
            kh.ForEach(x =>
            {
                var result = _mapper.Map<AppPhieunhap>(x);
                _context.AddAsync(result);
            });
            await _context.SaveChangesAsync();
            return Ok("ok");
        }
        [HttpPost]
        [Route("update")]
        public async Task<ActionResult> Update([FromBody] AppPhieunhapDTO phieunhap)
        {
            var phieuNhap = await _context.AppPhieunhaps.AsNoTracking().FirstOrDefaultAsync(x => x.Id == phieunhap.Id);
            if (phieuNhap == null)
            {
                return Ok(new ResultMessageResponse()
                {
                    success = false,
                    message = "Không tồn tại phiếu trên, vui lòng thử lại!"
                });
            }
            var result = _mapper.Map<AppPhieunhap>(phieunhap);
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
        public async Task<ActionResult> Add([FromBody] AppPhieunhapDTO phieunhap)
        {
            var phieuNhap = await _context.AppPhieunhaps.AsNoTracking().FirstOrDefaultAsync(x => x.Id == phieunhap.Id);
            if (phieuNhap != null)
            {
                return Ok(new ResultMessageResponse()
                {
                    success = false,
                    message = "Đã tồn tại phiếu trên, vui lòng thử lại!"
                });
            }
            var result = _mapper.Map<AppPhieunhap>(phieunhap);
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

            var phieuNhap = await _context.AppPhieunhaps.AsNoTracking().FirstOrDefaultAsync(x => x.Id.Equals(id));
            if (phieuNhap == null)
            {
                return Ok(new ResultMessageResponse()
                {
                    message = "Không tồn tại mã phiếu hiện tại, vui lòng thử lại!",
                    success = false
                });
            }
            _context.AppPhieunhaps.Remove(phieuNhap);
            await _context.SaveChangesAsync();
            return Ok(new ResultMessageResponse()
            {
                message = "Xóa thành công!",
                success = true,
            });
        }
    }
}
