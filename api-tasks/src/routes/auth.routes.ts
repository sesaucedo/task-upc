import { Router } from 'express';
import { supabase } from '../config/database';
import { authLimiter } from '../middleware/rateLimiter';
import { z } from 'zod';
import { validateBody } from '../middleware/validate.middleware';

const authSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(6),
});

export const authRouter = Router();

authRouter.post('/register', authLimiter, validateBody(authSchema),
  async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    res.status(201).json({
      success: true,
      message: 'Registro exitoso. Revisa tu email para confirmar.',
      data: { id: data.user?.id, email: data.user?.email }
    });
  }
);

authRouter.post('/login', authLimiter, validateBody(authSchema),
  async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    res.json({
      success: true,
      token: data.session?.access_token,
      expires_in: data.session?.expires_in
    });
  }
);