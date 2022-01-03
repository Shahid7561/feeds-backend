const {Post} = require('../models/posts');
const express = require('express');
const { User } = require('../models/user');
const { Comment } = require('../models/comments');

const router = express.Router();


router.post('/create', async (req,res)=>{
    let post = new Post({
        text: req.body.text,
        postedUser: req.body.postedUser
    })
    post = await post.save();

    if(!post)
    return res.status(400).send('the post cannot be created!')

    res.send(post);
})

router.get('/', async (req, res) => {
    let query = [
        // {
        //     $lookup: {
        //         from: Comment.collection.name,
        //         localField: '_id',
        //         foreignField: 'postId',
        //         as: 'commentData'
        //     },
        // },
        // {
        //     $unwind: {
        //         path: "$commentData",
        //         preserveNullAndEmptyArrays: true
        //       }
        // },
        // {
        //     $lookup: {
        //         from: User.collection.name,
        //         localField: 'commentData.userId',
        //         foreignField: '_id',
        //         as: 'commentData.user'
        //     }
        // },
        // {
        //     $unwind: '$commentData.user'
        // },
        {
            $lookup: {
                from: User.collection.name,
                localField: 'postedUser',
                foreignField: '_id',
                as: 'user'
            },
        },
        {
            $unwind: '$user'
        },
        // {
        //     $group: {
        //         _id : "$_id",
        //         image: { $first: "$image" },
        //         user: {$first: "$user"},
        //         text: {$first: "$text"},
        //         commentData: {$push: "$commentData"},
        //         comments_count: {$first: {$size: {"$ifNull": ["$comments", []]}}},
        //         likes_count: {$first: {$size: {"$ifNull": ["$likedby", []]}}},
        //     }
        // },
        {
            $project: {
                "id": 1,
                "image": 1,
                "text": 1,
                "updated_at": 1,
                "dCreatedDate":1,
                "comments_count": 1,
                "likes_count": 1,
                "user": 1,
                "commentData": 1
            }
        }
    ]
    await Post.aggregate(query).then((result) => {
        if (!result) {
            return res.status(400).send('no post found!')
        } else {
            return res.send({
                message: "posts successfully fetched",
                data: result
            })
        }
    }).catch((err) => {
        return res.status(400).send({
            message: err.message,
            data: err
        })
    });
})

// router.get('/:postId', async (req, res) =>{
//     console.log("..............");
//     try{
//         let pageNumber = parseInt(req.query.page, 10) || 10;
//         let limit = req.query.limit;
//         const posts = await Post.find().lean().exec(); // .exec() returns a true Promise
//         res.json({posts});
//     } catch(err) {
//         res.status(500).json({success: false});
//     }
// })

module.exports =router;