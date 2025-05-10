import z from "zod";
import { DOMPurify } from "../server";

export const newArticleSchema = z.object({
    title: z.string().min(1, { message: "Title must be at least 1 character long" }).transform((title) => DOMPurify.sanitize(title)),
    body: z.string().min(1, { message: "Content must be at least 1 character long" }).transform((body) => DOMPurify.sanitize(body)),
    summary: z.string().min(1, { message: "Summary must be at least 1 character long" }).transform((summary) => DOMPurify.sanitize(summary)),
    category: z.string().min(1),
    tags: z.string().min(1, { message: "Tags must be at least 1 character long" }).transform((tags) => DOMPurify.sanitize(tags)),
    status: z.enum(['published', 'draft']).refine((type) => type === 'published' || type === 'draft', { message: "Type must be either 'published' or 'draft'" }),
});

export const newUserSchema = z.object({
    firstName: z.string().min(1, { message: "Invalid First Name" }).transform((name) => DOMPurify.sanitize(name)),
    lastName: z.string().min(1, { message: "Invalid Last Name" }).transform((name) => DOMPurify.sanitize(name)),
    email: z.string().email().min(1, { message: "Invalid Email" }).transform((email) => DOMPurify.sanitize(email)),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }).refine((password) => {
        const hasCapitalLetter = /[A-Z]/.test(password);
        const hasSpecialCharacter = /[!@#$%^&*]/.test(password);
        return hasCapitalLetter && hasSpecialCharacter;
    }, { message: "Password must contain at least one capital letter and one special character" }).transform((password) => DOMPurify.sanitize(password)),
});

export const loginSchema = z.object({
    email: z.string().email().min(1, { message: "Invalid Email" }).transform((email) => DOMPurify.sanitize(email)),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }).transform((password) => DOMPurify.sanitize(password)),
});

export const updateProfileSchema = z.object({
    username: z.string().min(1, { message: "Invalid First Name" }).transform((name) => DOMPurify.sanitize(name)),
    bio: z.string().transform((bio) => DOMPurify.sanitize(bio)),
    extendedBio: z.string().transform((bio) => DOMPurify.sanitize(bio)),
    location: z.string().transform((location) => DOMPurify.sanitize(location)),
    website: z.string().url().transform((website) => DOMPurify.sanitize(website)),
    birthdate: z.string().transform((birthdate) => DOMPurify.sanitize(birthdate)),
    gender: z.enum(['male', 'female', 'prefer not to say']).transform((gender) => DOMPurify.sanitize(gender)),
    social_links: z.array(z.object({
        platform: z.string().min(1, { message: "Invalid Platform" }).transform((platform) => DOMPurify.sanitize(platform)),
        url: z.string().url().transform((url) => DOMPurify.sanitize(url)),
    })),
    recovery_email: z.string().email().min(1, { message: "Invalid Email" }).transform((email) => DOMPurify.sanitize(email)),
    phone: z.string().min(1, { message: "Invalid Phone Number" }).transform((phone) => DOMPurify.sanitize(phone)),
});