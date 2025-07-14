import express from 'express';
import { Post } from '../DB/schemas';
import { Article } from '../controllers/ArticleController';
import multer from 'multer';
import path from 'path';
import { isSignedIn } from './middlewares';

const storage = multer.diskStorage({
  //ensures multipart/form-data is parsed
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const baseName = path.parse(file.originalname).name;
    cb(null, baseName + '.jpg'); // just force .jpg extension
  },
});

export const upload = multer({ storage });
export const articleRouter = express.Router();

articleRouter.get('/', async (req, res) => {
  const currentPage = Number(req.query.page) || 1;
  const currentCategory = req.query.category || 'all';
  const pageSize = 6;
  let totalPages = 1;
  try {
    if (currentCategory === 'all') {
      totalPages =
        (await Post.countDocuments({ status: 'published' })) % 6 == 0
          ? (await Post.countDocuments({ status: 'published' })) / 6
          : Math.ceil((await Post.countDocuments({ status: 'published' })) / 6);
    } else {
      totalPages =
        (await Post.find({
          category: currentCategory,
          status: 'published',
        }).countDocuments()) %
          6 ==
        0
          ? (await Post.find({
              category: currentCategory,
              status: 'published',
            }).countDocuments()) / 6
          : Math.ceil(
              (await Post.find({
                category: currentCategory,
                status: 'published',
              }).countDocuments()) / 6
            );
    }

    const posts =
      currentCategory === 'all'
        ? await Post.find({ status: 'published' })
            .limit(pageSize)
            .skip((currentPage - 1) * pageSize)
        : await Post.find({ category: currentCategory, status: 'published' })
            .limit(pageSize)
            .skip((currentPage - 1) * pageSize);

    res.render('article/articles', {
      posts,
      currentPage,
      totalPages,
      currentCategory,
    });
  } catch (error) {
    res.render('404');
    throw new Error(`Could not fetch the articles ${error}`);
  }
});

articleRouter.get('/new', isSignedIn, (req, res) => {
  res.render('article/new');
});

articleRouter.get('/:slug', async (req, res) => {
  const slug = req.params.slug;

  try {
    const post = await Post.findOne({
      slug: slug,
      status: 'published',
    }).populate('author_id');
    // console.log(post);

    if (!post) {
      res.status(404).render('404');
    } else {
      res.render('article/articlePage', { post });
    }
  } catch (error) {
    res.render('404');
    throw new Error(`Could not fetch the article ${error}`);
  }
});

articleRouter.post('/new', upload.single('image'), Article.NewArticle);
