import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/database';

export const authMiddleware = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Token de acceso requerido' });
    return;
  }

  const token = authHeader.slice(7);

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    res.status(401).json({ success: false, message: 'Token inválido o expirado' });
    return;
  }

  req.user = user;
  next();
};