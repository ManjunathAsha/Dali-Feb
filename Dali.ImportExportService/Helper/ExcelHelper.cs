using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using OfficeOpenXml;

namespace Dali.ImportExportService.Helper
{
    public interface IExcelHelper
    {
        Task<ExcelPackage> GetExcelPackageAsync(IFormFile file);
        Task<Dictionary<string, string>> GetRowDataAsync(ExcelWorksheet worksheet, int rowNumber, List<string> headers);
        List<string> GetHeaders(ExcelWorksheet worksheet);
    }

    public class ExcelHelper : IExcelHelper
    {
        public async Task<ExcelPackage> GetExcelPackageAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("No file was uploaded");
            }

            using var stream = new MemoryStream();
            await file.CopyToAsync(stream);
            return new ExcelPackage(stream);
        }

        public async Task<Dictionary<string, string>> GetRowDataAsync(ExcelWorksheet worksheet, int rowNumber, List<string> headers)
        {
            var rowData = new Dictionary<string, string>();
            for (int col = 1; col <= worksheet.Dimension.End.Column; col++)
            {
                var header = headers[col - 1];
                var value = worksheet.Cells[rowNumber, col].Text?.Trim();
                rowData[header] = value ?? string.Empty;
            }
            return rowData;
        }

        public List<string> GetHeaders(ExcelWorksheet worksheet)
        {
            var headers = new List<string>();
            for (int col = 1; col <= worksheet.Dimension.End.Column; col++)
            {
                var header = worksheet.Cells[1, col].Text?.Trim() ?? string.Empty;
                headers.Add(header);
            }
            return headers;
        }
    }
} 