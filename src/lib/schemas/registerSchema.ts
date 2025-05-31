import { z } from "zod";

export const registerSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters"
    }),
});

export type RegisterSchema = z.infer<typeof registerSchema>
