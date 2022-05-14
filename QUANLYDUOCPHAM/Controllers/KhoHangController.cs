#nullable disable
using System.Data.SqlClient;
using AutoMapper;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using QUANLYDUOCPHAM.Models;
using QUANLYDUOCPHAM.ModelsDTO;

namespace QUANLYDUOCPHAM.Controllers
{
    [Route(UrlApi.khoHangUrl)]
    [ApiController]
    public class KhoHangController : ControllerBase
    {
        private readonly QUANLYKHODUOCPHAMContext _context;
        private readonly IMapper _mapper;

        public KhoHangController(QUANLYKHODUOCPHAMContext context, IMapper mapper)
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
                    var query = @"SELECT dbo.APP_KHO.ID AS idkho, dbo.APP_KHO.TENKHO AS tenkho, dbo.APP_KHO.DIACHI AS diachi, dbo.APP_HANG.ID AS idhang, dbo.APP_HANG.TENHANG AS tenhang, dbo.APP_HANG.MOTA AS mota,
                        dbo.APP_HANG.DONVI AS donvi
                        FROM            dbo.APP_KHO INNER JOIN
                        dbo.APP_HANG ON dbo.APP_KHO.ID = dbo.APP_HANG.ID";
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
                        message = "Error" + NameTable.KhoHang
                    });
                }
            }
        }

        [HttpPost]
        [Route("add")]
        public async Task<ActionResult> Add([FromBody] AppKhohangDTO khoHang)
        {
            var result = _mapper.Map<AppKhohang>(khoHang);
            await _context.AddAsync(result);
            await _context.SaveChangesAsync();
            var res = new ResultMessageResponse()
            {
                success = true,
                message = "Thành công",
                data = khoHang
            };
            return Ok(res);
        }

    }
}
