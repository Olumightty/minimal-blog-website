import express from 'express';
import { getUserId } from '../lib/helpers';
import { Post, Profile } from '../DB/schemas';
import { upload } from './articleRoute';
import { UserAction } from '../controllers/UserController';

export const userRouter = express.Router();

userRouter.get('/profile', async (req, res) => {
  try {
    const id = await getUserId(req.session.user!.email);
    if (!id) throw new Error('User not found');
    const profile = await Profile.findOne({ user_id: id }).populate('user_id');
    if (!profile) throw new Error('User profile not found');
    res.render('user/profile', { profile });
  } catch (error) {
    throw new Error(`Could not fetch the user ${error}`);
  }
});

userRouter.patch(
  '/profile',
  upload.single('avatar'),
  UserAction.UpdateProfile as undefined
);

userRouter.get('/drafts', async (req, res) => {
  try {
    const id = await getUserId(req.session.user!.email);
    if (!id) throw new Error('User not found');
    const profile = await Profile.findOne({ user_id: id });
    if (!profile) throw new Error('User profile not found');
    const data = await Post.find({ author_id: profile.id, status: 'draft' });
    const drafts = data.map((draft) => {
      return {
        id: draft.id,
        title: draft.title,
        slug: draft.slug,
        created_at: draft.created_at,
        updatedAt: draft.updatedAt,
        summary: draft.summary,
        body: draft.body,
        category: draft.category,
        tags: draft.tags,
        author_id: draft.author_id,
        likes: draft.likes,
        status: draft.status,
        imageUrl: draft.imageUrl,
      };
    });
    res.render('user/drafts', { drafts: JSON.stringify(drafts) || [] });
  } catch (error) {
    throw new Error(`Could not fetch the drafts ${error}`);
  }
});

userRouter.get('/drafts/edit/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const post = await Post.findOne({ status: 'draft', _id: id });
    // console.log(post);
    if (!post) throw new Error('Post not found');
    const profile = await Profile.findById(post.author_id).populate('user_id');
    if (!profile) throw new Error('User profile not found');
    const user_id = await getUserId(req.session.user!.email);
    if (!user_id) throw new Error('User not found');
    if (profile.user_id.id != user_id) {
      throw new Error('Unauthorized to view draft');
    }
    res.render('user/draftEdit', { post });
  } catch (error) {
    res.render('404');
    throw new Error(`Could not fetch the user ${error}`);
  }
});

userRouter.patch(
  '/drafts/edit/:id',
  upload.single('image'),
  UserAction.UpdateArticle as undefined
);

// userRouter.get('/drafts/delete/:id', UserAction.DeleteArticle as undefined);

userRouter.get('/articles', async (req, res) => {
  try {
    const id = await getUserId(req.session.user!.email);
    if (!id) throw new Error('User not found');
    const profile = await Profile.findOne({ user_id: id });
    if (!profile) throw new Error('User profile not found');
    const data = await Post.find({
      author_id: profile.id,
      status: 'published',
    });
    const articles = data.map((article) => {
      return {
        id: article.id,
        title: article.title,
        slug: article.slug,
        created_at: article.created_at,
        updatedAt: article.updatedAt,
        summary: article.summary,
        body: article.body,
        category: article.category,
        tags: article.tags,
        author_id: article.author_id,
        likes: article.likes,
        status: article.status,
        imageUrl: article.imageUrl,
      };
    });
    res.render('user/myArticles', { articles: JSON.stringify(articles) || [] });
  } catch (error) {
    throw new Error(`Could not fetch the articles ${error}`);
  }
});
