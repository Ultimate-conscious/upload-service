import z from 'zod';

export const SignupSchema = z.object({
    email: z.string().email(),
    name: z.string(),
    password: z.string(),
});

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});