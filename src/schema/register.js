import { z } from "zod"; 

export const registerSchema = z.object({
    username: z.string() .min(1,('username is required')),
    email: z.string() .email("invalid email address"),
    password: z.string() .min(6,("password must be at least six characters"))
     
})
