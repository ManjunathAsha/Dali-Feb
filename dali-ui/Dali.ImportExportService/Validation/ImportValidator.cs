using System;
using System.Collections.Generic;
using System.Linq;
using Dali.ImportExportService.DTO;
using OfficeOpenXml;

namespace Dali.ImportExportService.Validation
{
    public interface IImportValidator
    {
        ImportResult ValidateExcelFile(ExcelPackage package);
        ImportResult ValidateSpecificationsSheet(ExcelWorksheet sheet);
        ImportResult ValidateLinksSheet(ExcelWorksheet sheet);
        ImportResult ValidateFilesSheet(ExcelWorksheet sheet);
    }

    public class ImportValidator : IImportValidator
    {
        private readonly string[] _requiredSpecificationsColumns = new[]
        {
             "Hoofdstuk",         // Section (Required)
                    "Niveau",            // Stage (Required)
                    "Gemeente",          // Client (Required)
                    "Woonkern",          // Location (Required)
                    "Gebiedsoort/Straatsoort/Elementsoort",   // Area (Required)
                    "Onderwerp",         // Topic (Required)
                    "Subonderwerp",      // Subtopic (Optional)
                    "Hardheid",          // EnforcementLevel (Required)
                    "Bronverwijzing",    // Links (Optional)
                    "Bijlage(-n)",       // Files (Optional)
                    "Eis",               // Document Description (Required)
        };

        private readonly string[] _requiredLinksColumns = new[]
        {
            "Omschrijving",     // Description
            "Url"               // URL
        };

        private readonly string[] _requiredFilesColumns = new[]
        {
            "Omschrijving",     // Description
            "Bestandspad",      // FilePath
            "Bestandstype"      // FileType
        };

        public ImportResult ValidateExcelFile(ExcelPackage package)
        {
            var result = new ImportResult();

            // Check if file contains required sheets
            var sheets = package.Workbook.Worksheets.ToList();
            if (!sheets.Any(s => s.Name == "Specificaties"))
            {
                result.Errors.Add(new ImportError
                {
                    Field = "Sheets",
                    Message = "Required sheet 'Specificaties' not found",
                    Type = "Validation"
                });
            }

            // Validate each sheet if present
            var specificationsSheet = sheets.FirstOrDefault(s => s.Name == "Specificaties");
            if (specificationsSheet != null)
            {
                var sheetResult = ValidateSpecificationsSheet(specificationsSheet);
                result.Errors.AddRange(sheetResult.Errors);
                result.Messages.AddRange(sheetResult.Messages);
            }

            var linksSheet = sheets.FirstOrDefault(s => s.Name == "Bronverwijzingen");
            if (linksSheet != null)
            {
                var sheetResult = ValidateLinksSheet(linksSheet);
                result.Errors.AddRange(sheetResult.Errors);
                result.Messages.AddRange(sheetResult.Messages);
            }

            var filesSheet = sheets.FirstOrDefault(s => s.Name == "Bijlagen");
            if (filesSheet != null)
            {
                var sheetResult = ValidateFilesSheet(filesSheet);
                result.Errors.AddRange(sheetResult.Errors);
                result.Messages.AddRange(sheetResult.Messages);
            }

            result.Success = !result.Errors.Any();
            return result;
        }

        public ImportResult ValidateSpecificationsSheet(ExcelWorksheet sheet)
        {
            var result = new ImportResult();

            // Validate headers
            var headers = GetSheetHeaders(sheet);
            var missingColumns = _requiredSpecificationsColumns.Where(col => !headers.Contains(col)).ToList();
            
            if (missingColumns.Any())
            {
                result.Errors.Add(new ImportError
                {
                    Field = "Headers",
                    Message = $"Missing required columns in Specifications sheet: {string.Join(", ", missingColumns)}",
                    Type = "Validation"
                });
            }

            // Validate data rows
            if (sheet.Dimension?.Rows > 1)
            {
                for (int row = 2; row <= sheet.Dimension.Rows; row++)
                {
                    ValidateSpecificationsRow(sheet, row, headers, result);
                }
            }
            else
            {
                result.Errors.Add(new ImportError
                {
                    Field = "Data",
                    Message = "Specifications sheet contains no data rows",
                    Type = "Validation"
                });
            }

            return result;
        }

        public ImportResult ValidateLinksSheet(ExcelWorksheet sheet)
        {
            var result = new ImportResult();

            // Validate headers
            var headers = GetSheetHeaders(sheet);
            var missingColumns = _requiredLinksColumns.Where(col => !headers.Contains(col)).ToList();
            
            if (missingColumns.Any())
            {
                result.Errors.Add(new ImportError
                {
                    Field = "Headers",
                    Message = $"Missing required columns in Links sheet: {string.Join(", ", missingColumns)}",
                    Type = "Validation"
                });
            }

            // Validate data rows
            if (sheet.Dimension?.Rows > 1)
            {
                for (int row = 2; row <= sheet.Dimension.Rows; row++)
                {
                    ValidateLinksRow(sheet, row, headers, result);
                }
            }

            return result;
        }

        public ImportResult ValidateFilesSheet(ExcelWorksheet sheet)
        {
            var result = new ImportResult();

            // Validate headers
            var headers = GetSheetHeaders(sheet);
            var missingColumns = _requiredFilesColumns.Where(col => !headers.Contains(col)).ToList();
            
            if (missingColumns.Any())
            {
                result.Errors.Add(new ImportError
                {
                    Field = "Headers",
                    Message = $"Missing required columns in Files sheet: {string.Join(", ", missingColumns)}",
                    Type = "Validation"
                });
            }

            // Validate data rows
            if (sheet.Dimension?.Rows > 1)
            {
                for (int row = 2; row <= sheet.Dimension.Rows; row++)
                {
                    ValidateFilesRow(sheet, row, headers, result);
                }
            }

            return result;
        }

        private List<string> GetSheetHeaders(ExcelWorksheet sheet)
        {
            var headers = new List<string>();
            if (sheet.Dimension?.Columns > 0)
            {
                for (int col = 1; col <= sheet.Dimension.Columns; col++)
                {
                    var header = sheet.Cells[1, col].Text?.Trim();
                    if (!string.IsNullOrEmpty(header))
                    {
                        headers.Add(header);
                    }
                }
            }
            return headers;
        }

        private void ValidateSpecificationsRow(ExcelWorksheet sheet, int row, List<string> headers, ImportResult result)
        {
            // Validate required fields
            foreach (var column in _requiredSpecificationsColumns)
            {
                var colIndex = headers.IndexOf(column) + 1;
                if (colIndex > 0)
                {
                    var value = sheet.Cells[row, colIndex].Text?.Trim();
                    if (string.IsNullOrEmpty(value))
                    {
                        result.Errors.Add(new ImportError
                        {
                            Field = column,
                            Message = $"Missing required value in row {row}",
                            Type = "Validation",
                            RowNumber = row
                        });
                    }
                }
            }

            // Validate Links references
            var linksColIndex = headers.IndexOf("Bronv") + 1;
            if (linksColIndex > 0)
            {
                var links = sheet.Cells[row, linksColIndex].Text?.Trim();
                if (!string.IsNullOrEmpty(links))
                {
                    var linkIds = links.Split(';', StringSplitOptions.RemoveEmptyEntries);
                    if (linkIds.Any(id => string.IsNullOrWhiteSpace(id)))
                    {
                        result.Errors.Add(new ImportError
                        {
                            Field = "Bronv",
                            Message = $"Invalid link reference format in row {row}",
                            Type = "Validation",
                            RowNumber = row
                        });
                    }
                }
            }

            // Validate Files references
            var filesColIndex = headers.IndexOf("Bijlage(-n)") + 1;
            if (filesColIndex > 0)
            {
                var files = sheet.Cells[row, filesColIndex].Text?.Trim();
                if (!string.IsNullOrEmpty(files))
                {
                    var fileIds = files.Split(';', StringSplitOptions.RemoveEmptyEntries);
                    if (fileIds.Any(id => string.IsNullOrWhiteSpace(id)))
                    {
                        result.Errors.Add(new ImportError
                        {
                            Field = "Bijlage(-n)",
                            Message = $"Invalid file reference format in row {row}",
                            Type = "Validation",
                            RowNumber = row
                        });
                    }
                }
            }
        }

        private void ValidateLinksRow(ExcelWorksheet sheet, int row, List<string> headers, ImportResult result)
        {
            foreach (var column in _requiredLinksColumns)
            {
                var colIndex = headers.IndexOf(column) + 1;
                if (colIndex > 0)
                {
                    var value = sheet.Cells[row, colIndex].Text?.Trim();
                    if (string.IsNullOrEmpty(value))
                    {
                        result.Errors.Add(new ImportError
                        {
                            Field = column,
                            Message = $"Missing required value in row {row}",
                            Type = "Validation",
                            RowNumber = row
                        });
                    }
                }
            }

            // Validate URL format
            var urlColIndex = headers.IndexOf("Url") + 1;
            if (urlColIndex > 0)
            {
                var url = sheet.Cells[row, urlColIndex].Text?.Trim();
                if (!string.IsNullOrEmpty(url) && !Uri.IsWellFormedUriString(url, UriKind.Absolute))
                {
                    result.Errors.Add(new ImportError
                    {
                        Field = "Url",
                        Message = $"Invalid URL format in row {row}",
                        Type = "Validation",
                        RowNumber = row
                    });
                }
            }
        }

        private void ValidateFilesRow(ExcelWorksheet sheet, int row, List<string> headers, ImportResult result)
        {
            foreach (var column in _requiredFilesColumns)
            {
                var colIndex = headers.IndexOf(column) + 1;
                if (colIndex > 0)
                {
                    var value = sheet.Cells[row, colIndex].Text?.Trim();
                    if (string.IsNullOrEmpty(value))
                    {
                        result.Errors.Add(new ImportError
                        {
                            Field = column,
                            Message = $"Missing required value in row {row}",
                            Type = "Validation",
                            RowNumber = row
                        });
                    }
                }
            }
        }
    }
} 