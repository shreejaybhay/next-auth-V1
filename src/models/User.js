import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },

  password: {
    type: String,
    select: false,
    required: function () {
      return !this.googleId && !this.githubId;
    },
  },

  emailVerified: {
    type: Boolean,
    default: false,
  },

  emailVerificationToken: String,
  emailVerificationExpires: Date,

  passwordResetToken: String,
  passwordResetExpires: Date,

  googleId: {
    type: String,
    sparse: true,
  },

  githubId: {
    type: String,
    sparse: true,
  },

  image: String,

  provider: {
    type: String,
    enum: ['credentials', 'google', 'github'],
    default: 'credentials',
  },
}, { timestamps: true });

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.generateEmailVerificationToken = function () {
  const token = crypto.randomBytes(32).toString('hex');

  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;

  return token;
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
