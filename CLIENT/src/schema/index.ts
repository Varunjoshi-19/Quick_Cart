import z from "zod";


export const UserSignUpSchema = z.object({
    name: z.string().min(1, "name is required"),
    email: z.string().min(1, "email is required").email("Invalid email format"),
    password: z.string().min(1 , "password required")

})

export const UserSignInSchema  = z.object({
    email: z.string().email(""),
    password: z.string()

})

