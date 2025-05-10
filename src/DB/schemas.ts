import { model, Schema } from 'mongoose';

export const PostSchema = new Schema({
  title: String, // String is shorthand for {type: String}
  author_id: { type: Schema.Types.ObjectId, ref: 'Profile' },
  summary: String,
  body: String,
  created_at: { type: Date, default: Date.now },
  category: {
    type: String,
    enum: ['design', 'technology', 'lifestyle', 'productivity', 'creativity'],
  },
  tags: String,
  imageUrl: String,
  slug: { type: String, unique: true },
  status: {
    type: String,
    enum: ['published', 'draft', 'archived'],
    default: 'draft',
  },
  updatedAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
});

export const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: String,
  verified: { type: Boolean, default: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: {
    type: String,
    default:
      'https://res.cloudinary.com/dwxqkk8gd/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1745894943/profile_zqog5s.png',
  }, //fetch from oauth service if available
  verificationToken: String,
  created_at: { type: Date, default: Date.now },
});

export const ProfileSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  username: { type: String, required: true, unique: true },
  avatar: String,
  demographics: {
    phone: { type: String },
    location: { type: String },
    website: { type: String },
    birthday: { type: Date },
    gender: {
      type: String,
      enum: ['male', 'female', 'prefer not to say'],
      default: 'prefer not to say',
    },
  },
  bio: {
    short: { type: String, maxlength: 160 },
    extended: { type: String },
  },
  socialLinks: [
    {
      platform: { type: String },
      url: { type: String },
    },
  ],
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    profileVisibility: { type: Boolean, default: true },
    showEmail: { type: Boolean, default: false },
    theme: { type: String, default: 'light' },
    articleDisplay: { type: String, default: 'grid' },
  },
  accountRecovery: {
    recoveryEmail: { type: String },
    securityQuestion: { type: String },
    securityAnswerHash: { type: String },
  },
  accountStatus: {
    status: {
      type: String,
      enum: ['active', 'deactivated', 'deleted'],
      default: 'active',
    },
    statusChangedAt: { type: Date },
  },
});

export const Post = model('Post', PostSchema);
export const User = model('User', UserSchema);
export const Profile = model('Profile', ProfileSchema);
