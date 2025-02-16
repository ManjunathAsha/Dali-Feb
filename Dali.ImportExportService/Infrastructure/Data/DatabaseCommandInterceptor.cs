using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Logging;
using System.Data.Common;

namespace Dali.ImportExportService.Infrastructure.Data;

public class DatabaseCommandInterceptor : DbCommandInterceptor
{
    private readonly ILogger<DatabaseCommandInterceptor> _logger;

    public DatabaseCommandInterceptor(ILogger<DatabaseCommandInterceptor> logger)
    {
        _logger = logger;
    }

    public override ValueTask<InterceptionResult<DbDataReader>> ReaderExecutingAsync(
        DbCommand command,
        CommandEventData eventData,
        InterceptionResult<DbDataReader> result,
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Executing SQL: {CommandText}", command.CommandText);
        return base.ReaderExecutingAsync(command, eventData, result, cancellationToken);
    }

    public override ValueTask<InterceptionResult<int>> NonQueryExecutingAsync(
        DbCommand command,
        CommandEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Executing NonQuery SQL: {CommandText}", command.CommandText);
        return base.NonQueryExecutingAsync(command, eventData, result, cancellationToken);
    }
} 