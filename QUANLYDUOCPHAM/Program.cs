using Microsoft.EntityFrameworkCore;
using QUANLYDUOCPHAM.AutoMapper;
using QUANLYDUOCPHAM.Models;
using QUANLYDUOCPHAM.Validator.ConfigureServices;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddValidator();

builder.Services.AddDbContext<QUANLYKHODUOCPHAMContext>(
        options => options.UseSqlServer("name=ConnectionStrings:DapperConnection"), ServiceLifetime.Scoped);
builder.Services.AddAutoMapper(typeof(QLCommandProfile).Assembly);
var devCorsPolicy = "devCorsPolicy";
builder.Services.AddCors(options =>
{
    options.AddPolicy(devCorsPolicy, builder =>
    {
        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors(devCorsPolicy);
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
