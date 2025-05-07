import { User } from "../DB/schemas";


export function slugify(title: string): string {
    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')         // Replace spaces with hyphens
      .replace(/-+/g, '-');         // Remove duplicate hyphens
  
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  
    return `${baseSlug}-${randomNumber}`;
  }

  export function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').trim();
  }


export const getUserId = async(email: string) => {
  try {
    const user = await User.findOne({email})
    if(!user) throw new Error('User not found');
    return user._id
  } catch (error) {
    return false
  }
    
     
}
