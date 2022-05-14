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
            var res = from x in _context.AppKhohangs
                      select new AppKhohangDTO
                      {
                          Idkho = x.Idkho,
                          Idhang = x.Idhang,
                          Slgiao = x.Slgiao,
                          Slnhap = x.Slnhap,
                          Tonkho = x.Tonkho,
                      };
            var re = new ResultMessageResponse()
            {
                data = res,
                success = true,
                totalCount = res.Count()
            };
            return Ok(re);
        }
        private bool AppDongmuaExists(string id)
        {
            return _context.AppDongmuas.Any(e => e.Iddonmua == id);
        }
    }
}
