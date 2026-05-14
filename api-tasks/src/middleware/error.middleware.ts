import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly isOperational = true
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const isDev = process.env.NODE_ENV === 'development';

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(isDev && { stack: err.stack })
    });
    return;
  }

  if (err.message?.includes('PGRST')) {
    res.status(400).json({ success: false, message: 'Error en la consulta a la base de datos' });
    return;
  }

  console.error('[UNHANDLED ERROR]', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    ...(isDev && { stack: err.stack, name: err.name })
  });
};