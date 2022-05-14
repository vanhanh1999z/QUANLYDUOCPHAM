#nullable disable
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QUANLYDUOCPHAM.Models;

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
            var khohang = await _context.AppKhohangs.ToListAsync();
            var re = new ResultMessageResponse()
            {
                data = khohang,
                success = true,
                totalCount = khohang.Count()
            };
            return Ok(re);
        }
        private bool AppDongmuaExists(string id)
        {
            return _context.AppDongmuas.Any(e => e.Iddonmua == id);
        }
    }
}
