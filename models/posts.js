const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default:'',
    },
    postedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    likedby: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    dCreatedDate: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});


postSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

postSchema.set('toJSON', {
    virtuals: true,
});


exports.Post = mongoose.model('Post', postSchema);
exports.postSchema = postSchema;