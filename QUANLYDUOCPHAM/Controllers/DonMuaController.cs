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
using QUANLYDUOCPHAM.Extensions;
using QUANLYDUOCPHAM.Models;
using QUANLYDUOCPHAM.ModelsDTO;

namespace QUANLYDUOCPHAM.Controllers
{
    [Route(UrlApi.donMuaUrl)]
    [ApiController]
    public class DonMuaController : ControllerBase
    {
        private readonly QUANLYKHODUOCPHAMContext _context;
        private readonly IMapper _mapper;
        private readonly RandomString randomString;
        public DonMuaController(QUANLYKHODUOCPHAMContext context, IMapper mapper)
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
                    var query = @"SELECT DM.ID AS id, DM.NGAYMUA as ngaymua, NCC.TENNCC as tenncc, NCC.DIACHI as diachi, NCC.DIENTHOAI as dienthoai 
                                FROM APP_DONMUA AS DM, APP_NHACUNGCAP AS NCC 
                                WHERE DM.IDNCC = NCC.ID
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
                    var query = @"SELECT DM.ID AS id, DM.NGAYMUA as ngaymua, NCC.ID AS idncc, NCC.TENNCC as tenncc, NCC.DIACHI as diachi, NCC.DIENTHOAI as dienthoai 
                                FROM APP_DONMUA AS DM, APP_NHACUNGCAP AS NCC 
                                WHERE DM.IDNCC = NCC.ID AND DM.ID ='" + id + "'";
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
        public async Task<ActionResult> UpdateDonMua([FromBody] AppDonmuaDTO donMua)
        {
            var isCheckDonMua = await _context.AppDonmuas.AsNoTracking().FirstOrDefaultAsync(x => x.Id.Equals(donMua.Id));
            var isCheckNCC = await _context.AppNhacungcaps.AsNoTracking().FirstOrDefaultAsync(x => x.Id.Equals(donMua.Idncc));
            if (isCheckDonMua != null)
            {
                return Ok(new ResultMessageResponse()
                {
                    success = false,
                    message = "Mã phiếu đơn mua bị trùng, vui vòng nhập mã khác!"
                });
            }

            if (isCheckNCC == null)
            {
                return Ok(new ResultMessageResponse()
                {
                    success = false,
                    message = "Không tồn tại nhà cung cấp trên, vui lòng thử lại!"
                });
            }
            var result = _mapper.Map<AppDonmua>(donMua);
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
        public async Task<ActionResult> AddDongmua([FromBody] AppDonmuaDTO donMua)
        {
            var isCheckDonMua = await _context.AppDonmuas.AsNoTracking().FirstOrDefaultAsync(x => x.Id.Equals(donMua.Id));
            var isCheckNCC = await _context.AppNhacungcaps.AsNoTracking().FirstOrDefaultAsync(x => x.Id.Equals(donMua.Idncc));
            if (isCheckDonMua == null)
            {
                return Ok(new ResultMessageResponse()
                {
                    success = false,
                    message = "Mã phiếu đơn mua không tồn tại!"
                });
            }

            if (isCheckNCC == null)
            {
                return Ok(new ResultMessageResponse()
                {
                    success = false,
                    message = "Không tồn tại nhà cung cấp trên, vui lòng thử lại!"
                });
            }
            var result = _mapper.Map<AppDonmua>(donMua);
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

        // DELETE: api/DonMua/5
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteAppDongmua(string id)
        {
            var isCheck = await _context.AppDonmuas.AsNoTracking().FirstOrDefaultAsync(x => x.Id.Equals(id));
            if (isCheck == null)
            {
                return Ok(new ResultMessageResponse()
                {
                    message = "Không tồn tại phiếu mua hàng trên, vui lòng thử lại!",
                    success = false
                });
            }
            _context.AppDonmuas.Remove(isCheck);
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
