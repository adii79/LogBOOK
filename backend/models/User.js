const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  supabaseId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    default: '' 
  },
  avatar: { 
    type: String, 
    default: '' 
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  lastLogin: { 
    type: Date, 
    default: Date.now 
  },
  preferences: {
    notifications: { 
      type: Boolean, 
      default: true 
    },
    theme: { 
      type: String, 
      enum: ['light', 'dark'], 
      default: 'light' 
    }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance method to get user's full name or email
userSchema.methods.getDisplayName = function() {
  return this.name || this.email;
};

// Static method to find user by Supabase ID
userSchema.statics.findBySupabaseId = function(supabaseId) {
  return this.findOne({ supabaseId });
};

// Static method to create or update user from Supabase
userSchema.statics.createOrUpdateFromSupabase = async function(supabaseUser) {
  const userData = {
    email: supabaseUser.email,
    supabaseId: supabaseUser.id,
    name: supabaseUser.user_metadata?.name || supabaseUser.user_metadata?.full_name || '',
    avatar: supabaseUser.user_metadata?.avatar_url || '',
    lastLogin: new Date()
  };

  return this.findOneAndUpdate(
    { supabaseId: supabaseUser.id },
    userData,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

module.exports = mongoose.model('User', userSchema);
