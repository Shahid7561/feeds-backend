const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    companyName: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    dCreatedDate: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  oFacebookLogin: {
    eStatus: { type: String, enum: ['y', 'n'], default: 'n' },
    sFaceBookId: { type: String, default: '' }
  },
  oGoogleLogin: {
    eStatus: { type: String, enum: ['y', 'n'], default: 'n' },
    sGoogleId: { type: String, default: '' }
  },
  aJwtToken: [{
    sDeviceToken: String,
    sPushToken: String,
    sDeviceType: String,
    dLastLogin: {
      type: Date,
      default: Date.now
    },
}]

});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
});

exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;
