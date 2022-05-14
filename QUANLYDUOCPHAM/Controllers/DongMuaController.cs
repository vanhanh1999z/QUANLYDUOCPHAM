#nullable disable
using System.Data.SqlClient;
using AutoMapper;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QUANLYDUOCPHAM.Extensions;
using QUANLYDUOCPHAM.Models;
using QUANLYDUOCPHAM.ModelsDTO;

namespace QUANLYDUOCPHAM.Controllers
{
    [Route(UrlApi.dongMuaUrl)]
    [ApiController]
    public class DongMuaController : ControllerBase
    {
        private readonly QUANLYKHODUOCPHAMContext _context;
        private readonly IMapper _mapper;
        private readonly RandomString randomString;
        public DongMuaController(QUANLYKHODUOCPHAMContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/DonMua
        [HttpGet]
        [Route("getall")]
        public async Task<ActionResult> GetListAll()
        {
            using (var connection = new SqlConnection(new ConnectDB().conn))
            {
                try
                {
                    var query = @"SELECT        dbo.APP_DONGMUA.IDDONMUA AS iddonmua, dbo.APP_DONMUA.NGAYMUA AS ngaymua, dbo.APP_DONMUA.IDNCC AS idncc, dbo.APP_NHACUNGCAP.TENNCC AS tenncc, dbo.APP_NHACUNGCAP.DIACHI AS diachi,
                            dbo.APP_NHACUNGCAP.DIENTHOAI AS dienthoai, dbo.APP_DONGMUA.IDHANG AS idhang, dbo.APP_HANG.TENHANG AS tenhang, dbo.APP_HANG.MOTA AS mota, dbo.APP_HANG.DONVI AS donvi,
                            dbo.APP_DONGMUA.SOLUONG AS soluong
                            FROM            dbo.APP_DONGMUA INNER JOIN
                            dbo.APP_DONMUA ON dbo.APP_DONGMUA.IDDONMUA = dbo.APP_DONMUA.ID INNER JOIN
                            dbo.APP_HANG ON dbo.APP_DONGMUA.IDHANG = dbo.APP_HANG.ID INNER JOIN
                            dbo.APP_NHACUNGCAP ON dbo.APP_DONMUA.IDNCC = dbo.APP_NHACUNGCAP.ID
                                ";
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
                        message = "Error" + NameTable.DonMua
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
                    var query = @"SELECT        dbo.APP_DONGMUA.IDDONMUA AS iddonmua, dbo.APP_DONMUA.NGAYMUA AS ngaymua, dbo.APP_DONMUA.IDNCC AS idncc, dbo.APP_NHACUNGCAP.TENNCC AS tenncc, dbo.APP_NHACUNGCAP.DIACHI AS diachi,
                         dbo.APP_NHACUNGCAP.DIENTHOAI AS dienthoai, dbo.APP_DONGMUA.IDHANG AS idhang, dbo.APP_HANG.TENHANG AS tenhang, dbo.APP_HANG.MOTA AS mota, dbo.APP_HANG.DONVI AS donvi,
                         dbo.APP_DONGMUA.SOLUONG AS soluong
FROM            dbo.APP_DONGMUA INNER JOIN
                         dbo.APP_DONMUA ON dbo.APP_DONGMUA.IDDONMUA = dbo.APP_DONMUA.ID INNER JOIN
                         dbo.APP_HANG ON dbo.APP_DONGMUA.IDHANG = dbo.APP_HANG.ID INNER JOIN
                         dbo.APP_NHACUNGCAP ON dbo.APP_DONMUA.IDNCC = dbo.APP_NHACUNGCAP.ID AND dbo.APP_DONGMUA.IDDONMUA  = '" + id + "'";
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
                        message = "Error" + NameTable.DonMua
                    });
                }
            }
        }
        // POST: api/DonMua
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754

        [HttpGet]
        [Route("seeddata")]
        public async Task<ActionResult> SeedData()
        {
            var nccs = await _context.AppNhacungcaps.ToListAsync();
            List<AppDonmuaDTO> kh = new List<AppDonmuaDTO>();


            for (int i = 0; i < 500; i++)
            {
                kh.Add(new AppDonmuaDTO()
                {
                    Id = randomString.Random(6),
                    Ngaymua = DateTime.Now,
                    Idncc = Convert.ToString(nccs[Faker.RandomNumber.Next(1, nccs.Count())].Id)
                });
            }
            kh.ForEach(x =>
            {
                var result = _mapper.Map<AppDonmua>(x);
                _context.AddAsync(result);
            });
            await _context.SaveChangesAsync();
            return Ok("ok");
        }
        [HttpPost]
        [Route("add")]
        public async Task<ActionResult> Add([FromBody] AppDongmuaDTO dongMua)
        {

            var result = _mapper.Map<AppDongmua>(dongMua);
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
        [HttpPost]
        [Route("update")]
        public async Task<ActionResult> Update([FromBody] AppDongmuaDTO dongMua)
        {
            using (var connection = new SqlConnection(new ConnectDB().conn))
            {
                try
                {
                    var query = @"UPDATE APP_DONGMUA SET IDHANG = '" + dongMua.Idhang + @"',
                    SOLUONG =" + dongMua.Soluong + @"
                    WHERE IDDONMUA = '" + dongMua.Iddonmua + "'";
                    var res = await connection.QueryAsync(query);
                    return Ok(new ResultMessageResponse()
                    {
                        success = true,
                        data = res,
                        message = "Thành công!",
                        totalCount = res.Count(),
                    });
                }
                catch (Exception)
                {

                    return Ok(new ResultMessageResponse()
                    {
                        success = false,
                        message = "Error" + NameTable.DonMua
                    });
                }
            }
        }

        // DELETE: api/DonMua/5
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteAppDongmua(string id)
        {
            var isCheck = await _context.AppDongmuas.AsNoTracking().FirstOrDefaultAsync(x => x.Iddonmua.Equals(id));
            if (isCheck == null)
            {
                return Ok(new ResultMessageResponse()
                {
                    message = "Không tồn tại phiếu mua hàng trên, vui lòng thử lại!",
                    success = false
                });
            }
            _context.AppDongmuas.Remove(isCheck);
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
