using AutoMapper;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QUANLYDUOCPHAM.BaseController;
using QUANLYDUOCPHAM.Models;
using QUANLYDUOCPHAM.ModelsDTO;
using System.Data.SqlClient;

namespace QUANLYDUOCPHAM.Controllers
{
    public class HangController : Controller
    {
        public const string routeApi = "v1/api/hang";
        private readonly QUANLYKHODUOCPHAMContext _context;
        private readonly IMapper _mapper;

        public HangController(QUANLYKHODUOCPHAMContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        //#region READING
        [HttpPost]
        [Route(routeApi + "/getall")]
        public async Task<ActionResult> GetListDonHang([FromBody] Pager page)
        {
            using (var connection = new SqlConnection(new ConnectDB().conn))
            {
                var kh = await _context.AppHangs.ToListAsync();
                var query = @"SELECT * FROM " + NameTable.Hang + @"
                            ORDER BY ID
                            OFFSET @Offset ROWS
                            FETCH NEXT @Next ROWS ONLY";
                var res = await connection.QueryAsync<AppHangDTO>(query, page);
                try
                {
                    return Ok(new ResultMessageResponse()
                    {
                        success = true,
                        data = res,
                        totalCount = kh.Count()
                    });
                }
                catch (Exception)
                {
                    return Ok(new ResultMessageResponse()
                    {
                        success = false,
                        message = "Error" + NameTable.Hang
                    });
                }
            }
        }
        [HttpGet]
        [Route(routeApi + "/getallwithoutpaning")]
        public async Task<ActionResult> getAllWithoutPaning()
        {
            try
            {
                var res = await new GenericRepository<AppHangDTO>(NameTable.Hang).GetAllAsync();
                var re = new ResultMessageResponse()
                {
                    data = res,
                    success = true,
                    totalCount = res.Count()
                };
                return Ok(re);
            }
            catch (Exception)
            {
                return Ok(new ResultMessageResponse()
                {
                    success = false,
                    message = "Error" + NameTable.Hang,
                });

            }
        }


        [HttpGet]
        [Route(routeApi + "/{id}")]
        public async Task<ActionResult> GetById(string id)
        {
            var res = await new GenericRepository<AppHangDTO>(NameTable.Hang).GetAsync(id);
            try
            {
                return Ok(new ResultMessageResponse()
                {
                    success = true,
                    data = res,
                    totalCount = 1,
                });
            }
            catch (Exception)
            {
                return Ok(new ResultMessageResponse()
                {
                    success = false,
                    message = "Error" + NameTable.Hang
                });
            }

        }
        [HttpGet]
        [Route("seeddata")]
        public async Task<ActionResult> SeedData()
        {
            List<AppHangDTO> kh = new List<AppHangDTO>();

            for (int i = 0; i < 1000; i++)
            {
                var id = "S" + i;
                var isCheck = kh.Find(x => x.Id.Equals(id));
                if (isCheck == null)
                {
                    kh.Add(new AppHangDTO()
                    {
                        Id = id,
                        Donvi = "MO" + i,
                        Tenhang = Faker.Name.FullName(),
                    });
                }
            }
            kh.ForEach(x =>
            {
                var result = _mapper.Map<AppHang>(x);
                _context.AddAsync(result);
            });
            await _context.SaveChangesAsync();
            return Ok("ok");
        }
        //ADD
        [HttpPost]
        [Route(UrlApi.hangUrl + "/add")]
        public async Task<IActionResult> AddHang([FromBody] AppHangDTO hang)
        {
            var check = await _context.AppHangs.AsNoTracking().FirstOrDefaultAsync(x => x.Id.Equals(hang.Id));
            if (check != null)
            {
                var re = new ResultMessageResponse()
                {
                    message = "Mã hàng đã tồn lại",
                    success = false,
                };
                return Ok(re);
            }
            var result = _mapper.Map<AppHang>(hang);
            await _context.AddAsync(result);
            await _context.SaveChangesAsync();
            var res = new ResultMessageResponse()
            {
                message = "Thành công",
                data = result,
                success = true,
            };
            return Ok(res);
        }
        //UPDATE
        [HttpPost]
        [Route(UrlApi.hangUrl + "/update")]
        public async Task<IActionResult> UpdateHang([FromBody] AppHangDTO hang)
        {
            var check = await _context.AppHangs.AsNoTracking().FirstOrDefaultAsync(x => x.Id.Equals(hang.Id));
            if (check == null)
            {
                var re = new ResultMessageResponse()
                {
                    message = "Mã hàng không tồn lại vui lòng thử lại sau!",
                    success = false,
                };
                return Ok(re);
            }
            var result = _mapper.Map<AppHang>(hang);
            _context.Attach(result);
            _context.Entry(result).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            var res = new ResultMessageResponse()
            {
                message = "Thành công",
                data = result,
                success = true,
            };
            return Ok(res);
        }

        [HttpDelete]
        [Route(UrlApi.hangUrl + "/delete/{id}")]
        public async Task<IActionResult> DeleteHang(string id)
        {
            var isCheckDongGiao = await _context.AppDonggiaos.AsNoTracking().FirstOrDefaultAsync(x => x.Idhang.Equals(id));
            var isCheckDongMua = await _context.AppDongmuas.AsNoTracking().FirstOrDefaultAsync(x => x.Idhang.Equals(id));
            var isCheckDongNhap = await _context.AppDongnhaps.AsNoTracking().FirstOrDefaultAsync(x => x.Idhang.Equals(id));
            var isCheckKhoHang = await _context.AppKhohangs.AsNoTracking().FirstOrDefaultAsync(x => x.Idhang.Equals(id));

            if (isCheckDongGiao != null || isCheckDongMua != null || isCheckDongNhap != null || isCheckKhoHang != null)
            {
                object result = new ResultMessageResponse()
                {
                    success = false,
                    message = "Không thể xóa hàng có mã hàng: " + id + ". Vui lòng kiểm tra lại!"
                };
            }
            var hang = await _context.AppHangs.FindAsync(id);
            if (hang == null)
            {
                return Ok(new ResultMessageResponse()
                {
                    success = false,
                    message = "Không tìm thấy id có mã: " + id,
                });
            }

            _context.AppHangs.Remove(hang);
            await _context.SaveChangesAsync();

            return Ok(new ResultMessageResponse()
            {
                success = true,
                message = "Xóa thành công"
            });
        }

        [HttpDelete]
        [Route(UrlApi.hangUrl + "/all")]
        public async Task<IActionResult> DeleteAll()
        {
            foreach (var entity in _context.AppHangs)
                _context.AppHangs.Remove(entity);
            await _context.SaveChangesAsync();

            return Ok(new ResultMessageResponse()
            {
                success = true,
                message = "Xóa thành công"
            });
        }


        //endregion
    }
}
