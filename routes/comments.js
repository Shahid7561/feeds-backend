const {Post} = require('../models/posts');
const {Comment} = require('../models/comments');
const express = require('express');
const mongoose = require('mongoose');
const { User} = require('../models/user');
const router = express.Router();


router.post('/create', async (req,res)=>{
    
    let postId = req.body.postId;
    
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).send('invalid post id!')
    }

    Post.findOne({_id:postId}).then(async (post)=>{
        if (!post) {
            return res.status(400).send('no post found!')
        } else {
            let comment = new Comment({
                comment: req.body.comment,
                postId: req.body.postId,
                userId: req.body.userId
            })
            comment = await comment.save();

            await Post.updateOne(
                {_id: postId},
                {$push: {comments: comment._id}}
            )

            return res.status(200).send({
                message: "comment added",
                data: comment
            });
        }
    }).catch((err)=>{
        console.log(err);
        return res.status(400).send({
            message: err.message,
            data: err
        })
    });
});

router.get('/:postId', async (req, res) =>{
    console.log("..............");

    let postId = req.params.postId;
    console.log(postId);
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).send('invalid post id!')
    }

    Post.findOne({_id:postId}).then(async (post)=>{
        if (!post) {
            return res.status(400).send('no post found!')
        } else {
            let query = [
                {
                    $lookup: {
                        from: User.collection.name,
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    },
                },
                {
                    $unwind: '$user'
                },
                {
                    $match: {
                        'postId': mongoose.Types.ObjectId(postId)
                    }
                }
            ];

        await  Comment.aggregate(query).then((result) => {
                if (!result) {
                    return res.status(400).send('no comments found!')
                } else {
                    return res.send({
                        message: "comments successfully fetched ",
                        data: {
                            comments: result
                        }
                    });
                }
            }).catch((err) => {
                return res.status(400).send({
                    message: err.message,
                    data: err
                })
            });
        }
    }).catch((err)=>{
        // console.log(err);
        return res.status(400).send({
            message: err.message,
            data: err
        })
    });

})

module.exports =router;

// const addComment = () => {
//     let comment = new Comments({
//         comment: req.body.comment,
//         postId: req.body.postId,
//         userId: req.body.userId
//     })
//     let result = await comment.save();

//     return result;
// }

// router.get('/posts', async (req, res) =>{
//     try{
//         let pageNumber = parseInt(req.query.page, 10) || 10;
//         let limit = req.query.limit;
//         // let pageNumber = req.query.page;
//         const posts = await Post.find().lean().exec(); // .exec() returns a true Promise
//         res.json({posts});
//     } catch(err) {
//         res.status(500).json({success: false});
//     }
// })