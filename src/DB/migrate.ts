import { slugify } from '../lib/helpers';
import { blogPosts } from './initialContent';
import { Post } from './schemas';

//for initial db setup
export const migratePosts = () => {
  console.log('Migrating posts...');

  blogPosts.forEach(async (post) => {
    const newPost = new Post({ ...post, slug: slugify(post.title) });
    await newPost.save();
    console.log(`Migrated post: ${newPost.title}`);
  });
};
