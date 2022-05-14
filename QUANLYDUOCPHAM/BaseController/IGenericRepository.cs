namespace QUANLYDUOCPHAM.BaseController
{
    public interface IGenericRepository<T>
    {
        
        Task<IEnumerable<T>> GetAllAsync();
        Task DeleteRowAsync(string id);
        Task<T> GetAsync(string id);
        Task<int> SaveRangeAsync(IEnumerable<T> list);
        Task UpdateAsync(T t);
        Task InsertAsync(T t);
    }
}
