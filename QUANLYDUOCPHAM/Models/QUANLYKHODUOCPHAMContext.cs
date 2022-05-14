using Microsoft.EntityFrameworkCore;

namespace QUANLYDUOCPHAM.Models
{
    public partial class QUANLYKHODUOCPHAMContext : DbContext
    {
        public QUANLYKHODUOCPHAMContext()
        {
        }

        public QUANLYKHODUOCPHAMContext(DbContextOptions<QUANLYKHODUOCPHAMContext> options)
            : base(options)
        {
        }

        public virtual DbSet<AppDondat> AppDondats { get; set; } = null!;
        public virtual DbSet<AppDongdat> AppDongdats { get; set; } = null!;
        public virtual DbSet<AppDonggiao> AppDonggiaos { get; set; } = null!;
        public virtual DbSet<AppDongmua> AppDongmuas { get; set; } = null!;
        public virtual DbSet<AppDongnhap> AppDongnhaps { get; set; } = null!;
        public virtual DbSet<AppDonmua> AppDonmuas { get; set; } = null!;
        public virtual DbSet<AppHang> AppHangs { get; set; } = null!;
        public virtual DbSet<AppKhachhang> AppKhachhangs { get; set; } = null!;
        public virtual DbSet<AppKho> AppKhos { get; set; } = null!;
        public virtual DbSet<AppKhohang> AppKhohangs { get; set; } = null!;
        public virtual DbSet<AppNhacungcap> AppNhacungcaps { get; set; } = null!;
        public virtual DbSet<AppPhieuchi> AppPhieuchis { get; set; } = null!;
        public virtual DbSet<AppPhieugiao> AppPhieugiaos { get; set; } = null!;
        public virtual DbSet<AppPhieunhap> AppPhieunhaps { get; set; } = null!;
        public virtual DbSet<AppPhieuthu> AppPhieuthus { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Server=LAPTOP-CEB8VU23\\HLGAUKL;Database=QUANLYKHODUOCPHAM;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AppDondat>(entity =>
            {
                entity.ToTable("APP_DONDAT");

                entity.Property(e => e.Id)
                    .HasMaxLength(6)
                    .IsUnicode(false)
                    .HasColumnName("ID")
                    .IsFixedLength();

                entity.Property(e => e.Makh)
                    .HasMaxLength(6)
                    .IsUnicode(false)
                    .HasColumnName("MAKH")
                    .IsFixedLength();

                entity.Property(e => e.Ngaydat)
                    .HasColumnType("date")
                    .HasColumnName("NGAYDAT");

                entity.HasOne(d => d.MakhNavigation)
                    .WithMany(p => p.AppDondats)
                    .HasForeignKey(d => d.Makh)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__APP_DONDAT__MAKH__2B3F6F97");
            });

            modelBuilder.Entity<AppDongdat>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("APP_DONGDAT");

                entity.Property(e => e.Iddondat)
                    .HasMaxLength(6)
                    .IsUnicode(false)
                    .HasColumnName("IDDONDAT")
                    .IsFixedLength();

                entity.Property(e => e.Idhang)
                    .HasMaxLength(6)
                    .IsUnicode(false)
                    .HasColumnName("IDHANG")
                    .IsFixedLength();

                entity.Property(e => e.Soluong).HasColumnName("SOLUONG");

                entity.HasOne(d => d.IddondatNavigation)
                    .WithMany()
                    .HasForeignKey(d => d.Iddondat)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__APP_DONGD__IDDON__34C8D9D1");

                entity.HasOne(d => d.IdhangNavigation)
                    .WithMany()
                    .HasForeignKey(d => d.Idhang)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__APP_DONGD__IDHAN__35BCFE0A");
            });

            modelBuilder.Entity<AppDonggiao>(entity =>
            {
                entity.HasKey(e => new { e.Idphieugiao, e.Idhang })
                    .HasName("PK__APP_DONG__665C1D90C97A0093");

                entity.ToTable("APP_DONGGIAO");

                entity.Property(e => e.Idphieugiao)
                    .HasMaxLength(6)
                    .IsUnicode(false)
                    .HasColumnName("IDPHIEUGIAO")
                    .IsFixedLength();

                entity.Property(e => e.Idhang)
                    .HasMaxLength(6)
                    .IsUnicode(false)
                    .HasColumnName("IDHANG")
                    .IsFixedLength();

                entity.Property(e => e.Gia).HasColumnName("GIA");

                entity.Property(e => e.Soluong).HasColumnName("SOLUONG");

                entity.HasOne(d => d.IdhangNavigation)
                    .WithMany(p => p.AppDonggiaos)
                    .HasForeignKey(d => d.Idhang)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__APP_DONGG__IDHAN__48CFD27E");

                entity.HasOne(d => d.IdphieugiaoNavigation)
                    .WithMany(p => p.AppDonggiaos)
                    .HasForeignKey(d => d.Idphieugiao)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__APP_DONGG__IDPHI__47DBAE45");
            });

            modelBuilder.Entity<AppDongmua>(entity =>
            {
                entity.HasKey(e => new { e.Iddonmua, e.Idhang })
                    .HasName("PK__APP_DONG__F9B2000CC7A83A55");

                entity.ToTable("APP_DONGMUA");

                entity.Property(e => e.Iddonmua)
                    .HasMaxLength(6)
                    .IsUnicode(false)
                    .HasColumnName("IDDONMUA")
                    .IsFixedLength();

                entity.Property(e => e.Idhang)
                    .HasMaxLength(6)
                    .IsUnicode(false)
                    .HasColumnName("IDHANG")
                    .IsFixedLength();

                entity.Property(e => e.Soluong).HasColumnName("SOLUONG");

                entity.HasOne(d => d.IddonmuaNavigation)
                    .WithMany(p => p.AppDongmuas)
                    .HasForeignKey(d => d.Iddonmua)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__APP_DONGM__IDDON__31EC6D26");

                entity.HasOne(d => d.IdhangNavigation)
                    .WithMany(p => p.AppDongmuas)
                    .HasForeignKey(d => d.Idhang)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__APP_DONGM__IDHAN__32E0915F");
            });

            modelBuilder.Entity<AppDongnhap>(entity =>
            {
                entity.HasKey(e => new { e.Idphieunhap, e.Idhang })
                    .HasName("PK__APP_DONG__3D81C580B3C5E0C8");

                entity.ToTable("APP_DONGNHAP");

                entity.Property(e => e.Idphieunhap)
                    .HasMaxLength(6)
                    .IsUnicode(false)
                    .HasColumnName("IDPHIEUNHAP")
                    .IsFixedLength();

                entity.Property(e => e.Idhang)
                    .HasMaxLength(6)
                    .IsUnicode(false)
                    .HasColumnName("IDHANG")
                    .IsFixedLength();

                entity.Property(e => e.Gianhap).HasColumnName("GIANHAP");

                entity.Property(e => e.Soluong).HasColumnName("SOLUONG");

                entity.HasOne(d => d.IdhangNavigation)
                    .WithMany(p => p.AppDongnhaps)
                    .HasForeignKey(d => d.Idhang)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__APP_DONGN__IDHAN__412EB0B6");

                entity.HasOne(d => d.IdphieunhapNavigation)
                    .WithMany(p => p.AppDongnhaps)
                    .HasForeignKey(d => d.Idphieunhap)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__APP_DONGN__IDPHI__403A8C7D");
            });

            modelBuilder.Entity<AppDonmua>(entity =>
            {
                entity.ToTable("APP_DONMUA");

                entity.Property(e => e.Id)
                    .HasMaxLength(6)
                    .IsUnicode(false)
                    .HasColumnName("ID")
                    .IsFixedLength();

                entity.Property(e => e.Idncc)
                    .HasMaxLength(6)
                    .IsUnicode(false)
                    .HasColumnName("IDNCC")
                    .IsFixedLength();

                entity.Property(e => e.Ngaymua)
                    .HasColumnType("date")
                    .HasColumnName("NGAYMUA");

                entity.HasOne(d => d.IdnccNavigation)
                    .WithMany(p => p.AppDonmuas)
                    .HasForeignKey(d => d.Idncc)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__APP_DONMU__IDNCC__286302EC");
            });

            modelBuilder.Entity<AppHang>(entity =>
            {
                entity.ToTable("APP_HANG");

                entity.Property(e => e.Id)
                    .HasMaxLength(6)
                    .IsUnicode(false)
                    .HasColumnName("ID");

                entity.Property(e => e.Donvi)
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .HasColumnName("DONVI");

                entity.Property(e => e.Mota)
                    .HasColumnType("ntext")
                    .HasColumnName("MOTA");

                entity.Property(e => e.Tenhang)
                    .HasMaxLength(255)
                    .HasColumnName("TENHANG");
            });

            modelBuilder.Entity<AppKhachhang>(entity =>
            {
                entity.ToTable("APP_KHACHHANG");

                entity.Property(e => e.Id)
                    .HasMaxLength(6)
                    .IsUnicode(false)
                    .HasColumnName("ID")
                    .IsFixedLength();

                entity.Property(e => e.Diachi)
                    .HasColumnType("ntext")
                    .HasColumnName("DIACHI");

                entity.Property(e => e.Dienthoai)
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .HasColumnName("DIENTHOAI")
                    .IsFixedLength();

                entity.Property(e => e.Tenkh)
                    .HasMaxLength(255)
                    .HasColumnName("TENKH");
            });

            modelBuilder.Entity<AppKho>(entity =>
            {
                entity.ToTable("APP_KHO");

                entity.Property(e => e.Id)
                    .HasMaxLength(6)
                    .IsUnicode(false)
                    .HasColumnName("ID")
                    .IsFixedLength();

                entity.Property(e => e.Diachi)
                    .HasColumnType("ntext")
                    .HasColumnName("DIACHI");

                entity.Property(e => e.Tenkho)
                    .HasMaxLength(255)
                    .HasColumnName("TENKHO");
            });

            modelBuilder.Entity<AppKhohang>(entity =>
            {
                entity.HasKey(e => new { e.Idkho, e.Idhang })
                    .HasName("PK__APP_KHOH__6FC5AEEFBEB1D05F");

                entity.ToTable("APP_KHOHANG");

                entity.Property(e => e.Idkho)
                    .HasMaxLength(6)
                    .IsUnicode(false)
                    .HasColumnName("IDKHO")
                    .IsFixedLength();

                entity.Property(e => e.Idhang)
                    .HasMaxLength(6)
                    .IsUnicode(false)
                    .HasColumnName("IDHANG")
                    .IsFixedLength();

                entity.Property(e => e.Slgiao).HasColumnName("SLGIAO");

                entity.Property(e => e.Slnhap).HasColumnName("SLNHAP");

                entity.Property(e => e.Tonkho).HasColumnName("TONKHO");

                entity.HasOne(d => d.IdhangNavigation)
                    .WithMany(p => p.AppKhohangs)
                    .HasForeignKey(d => d.Idhang)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__APP_KHOHA__IDHAN__398D8EEE");

                entity.HasOne(d => d.IdkhoNavigation)
                    .WithMany(p => p.AppKhohangs)
                    .HasForeignKey(d => d.Idkho)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__APP_KHOHA__IDKHO__38996AB5");
            });

            modelBuilder.Entity<AppNhacungcap>(entity =>
            {
                entity.ToTable("APP_NHACUNGCAP");

                entity.Property(e => e.Id)
                    .HasMaxLength(6)
                    .IsUnicode(false)
                    .HasColumnName("ID")
                    .IsFixedLength();

                entity.Property(e => e.Diachi)
                    .HasColumnType("ntext")
                    .HasColumnName("DIACHI");

                entity.Property(e => e.Dienthoai)
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .HasColumnName("DIENTHOAI")
                    .IsFixedLength();

                entity.Property(e => e.Tenncc)
                    .HasMaxLength(255)
                    .HasColumnName("TENNCC");
            });

            modelBuilder.Entity<AppPhieuchi>(entity =>
            {
                entity.ToTable("APP_PHIEUCHI");

                entity.Property(e => e.Id)
                    .HasMaxLength(6)
                    .IsUnicode(false)
                    .HasColumnName("ID")
                    .IsFixedLength();

                entity.Property(e => e.Idncc)
                    .HasMaxLength(6)
                    .IsUnicode(false)
                    .HasColumnName("IDNCC")
                    .IsFixedLength();

                entity.Property(e => e.Idphieunhap)
                    .HasMaxLength(6)
                    .IsUnicode(false)
                    .HasColumnName("IDPHIEUNHAP")
                    .IsFixedLength();

                entity.Property(e => e.Ngaychi)
                    .HasColumnType("date")
                    .HasColumnName("NGAYCHI");

                entity.Property(e => e.Sotientra).HasColumnName("SOTIENTRA");

                entity.Property(e => e.Tenquanly)
                    .HasMaxLength(255)
                    .HasColumnName("TENQUANLY");

                entity.HasOne(d => d.IdnccNavigation)
                    .WithMany(p => p.AppPhieuchis)
                    .HasForeignKey(d => d.Idncc)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__APP_PHIEU__IDNCC__4BAC3F29");

                entity.HasOne(d => d.IdphieunhapNavigation)
                    .WithMany(p => p.AppPhieuchis)
                    .HasForeignKey(d => d.Idphieunhap)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__APP_PHIEU__IDPHI__4CA06362");
            });

            modelBuilder.Entity<AppPhieugiao>(entity =>
            {
                entity.ToTable("APP_PHIEUGIAO");

                entity.Property(e => e.Id)
                    .HasMaxLength(6)
                    .IsUnicode(false)
                    .HasColumnName("ID")
                    .IsFixedLength();

                entity.Property(e => e.Iddondat)
                    .HasMaxLength(6)
                    .IsUnicode(false)
                    .HasColumnName("IDDONDAT")
                    .IsFixedLength();

                entity.Property(e => e.Idkho)
                    .HasMaxLength(6)
                    .IsUnicode(false)
                    .HasColumnName("IDKHO")
                    .IsFixedLength();

                entity.Property(e => e.Ngaygiao)
                    .HasColumnType("date")
                    .HasColumnName("NGAYGIAO");

                entity.Property(e => e.Tongtiengiao).HasColumnName("TONGTIENGIAO");

                entity.Property(e => e.Trangthainhan).HasColumnName("TRANGTHAINHAN");

                entity.HasOne(d => d.IddondatNavigation)
                    .WithMany(p => p.AppPhieugiaos)
                    .HasForeignKey(d => d.Iddondat)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__APP_PHIEU__IDDON__44FF419A");

                entity.HasOne(d => d.IdkhoNavigation)
                    .WithMany(p => p.AppPhieugiaos)
                    .HasForeignKey(d => d.Idkho)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__APP_PHIEU__IDKHO__440B1D61");
            });

            modelBuilder.Entity<AppPhieunhap>(entity =>
            {
                entity.ToTable("APP_PHIEUNHAP");

                entity.Property(e => e.Id)
                    .HasMaxLength(6)
                    .IsUnicode(false)
                    .HasColumnName("ID")
                    .IsFixedLength();

                entity.Property(e => e.Iddonmua)
                    .HasMaxLength(6)
                    .IsUnicode(false)
                    .HasColumnName("IDDONMUA")
                    .IsFixedLength();

                entity.Property(e => e.Idkho)
                    .HasMaxLength(6)
                    .IsUnicode(false)
                    .HasColumnName("IDKHO")
                    .IsFixedLength();

                entity.Property(e => e.Ngaynhap)
                    .HasColumnType("date")
                    .HasColumnName("NGAYNHAP");

                entity.Property(e => e.Tongtiennhap).HasColumnName("TONGTIENNHAP");

                entity.Property(e => e.Trangthainhan).HasColumnName("TRANGTHAINHAN");

                entity.HasOne(d => d.IddonmuaNavigation)
                    .WithMany(p => p.AppPhieunhaps)
                    .HasForeignKey(d => d.Iddonmua)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__APP_PHIEU__IDDON__3D5E1FD2");

                entity.HasOne(d => d.IdkhoNavigation)
                    .WithMany(p => p.AppPhieunhaps)
                    .HasForeignKey(d => d.Idkho)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__APP_PHIEU__IDKHO__3C69FB99");
            });

            modelBuilder.Entity<AppPhieuthu>(entity =>
            {
                entity.ToTable("APP_PHIEUTHU");

                entity.Property(e => e.Id)
                    .HasMaxLength(6)
                    .IsUnicode(false)
                    .HasColumnName("ID")
                    .IsFixedLength();

                entity.Property(e => e.Idkhach)
                    .HasMaxLength(6)
                    .IsUnicode(false)
                    .HasColumnName("IDKHACH")
                    .IsFixedLength();

                entity.Property(e => e.Idphieugiao)
                    .HasMaxLength(6)
                    .IsUnicode(false)
                    .HasColumnName("IDPHIEUGIAO")
                    .IsFixedLength();

                entity.Property(e => e.Ngaythu)
                    .HasColumnType("date")
                    .HasColumnName("NGAYTHU");

                entity.Property(e => e.Sotiennop).HasColumnName("SOTIENNOP");

                entity.Property(e => e.Tenquanly)
                    .HasMaxLength(255)
                    .HasColumnName("TENQUANLY");

                entity.HasOne(d => d.IdkhachNavigation)
                    .WithMany(p => p.AppPhieuthus)
                    .HasForeignKey(d => d.Idkhach)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__APP_PHIEU__IDKHA__4F7CD00D");

                entity.HasOne(d => d.IdphieugiaoNavigation)
                    .WithMany(p => p.AppPhieuthus)
                    .HasForeignKey(d => d.Idphieugiao)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__APP_PHIEU__IDPHI__5070F446");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);

        public DbSet<QUANLYDUOCPHAM.ModelsDTO.AppDondatDTO> AppDondatDTO { get; set; }
    }
}
