// =============================================================================
// Winston Logger Configuration
// =============================================================================

import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';

export function createLoggerConfig(): WinstonModuleOptions {
  const isProduction = process.env['NODE_ENV'] === 'production';

  const transports: winston.transport[] = [
    new winston.transports.Console({
      format: isProduction
        ? winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.json(),
          )
        : winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({ format: 'HH:mm:ss' }),
            winston.format.printf(({ level, message, timestamp, context, ...meta }) => {
              const ctx = context ? `[${String(context)}]` : '';
              const extra = Object.keys(meta).length ? JSON.stringify(meta) : '';
              return `${String(timestamp)} ${level} ${ctx} ${String(message)} ${extra}`;
            }),
          ),
    }),
  ];

  if (isProduction) {
    // In production, you'd add a file or external log transport here
    transports.push(
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
        maxsize: 10 * 1024 * 1024, // 10MB
        maxFiles: 5,
      }),
    );
  }

  return {
    level: process.env['LOG_LEVEL'] ?? 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      // Redact sensitive fields
      winston.format((info) => {
        if (typeof info['password'] !== 'undefined') info['password'] = '[REDACTED]';
        if (typeof info['authorization'] !== 'undefined') info['authorization'] = '[REDACTED]';
        if (typeof info['token'] !== 'undefined') info['token'] = '[REDACTED]';
        return info;
      })(),
    ),
    transports,
  };
}
