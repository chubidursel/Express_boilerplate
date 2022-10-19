import PostModel from '../models/Post.js'

export const getAll = async(req, res)=>{
    try {
        //conncet article and user and return them all
        const posts = await PostModel.find().populate('user').exec();

        res.json(posts)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Failed get all articles",
        })
    }
};

export const remove = async(req, res)=>{
    try {
        const postId = req.params.id;

        PostModel.findOneAndDelete({
            _id: postId
        }, (err, doc)=>{
            if(err){
                console.log(err)
                res.status(500).json({
                    message: "Coulnt delete article",
                }) 
            }
            if(!doc){
                return res.status(404).json({
                    message: "Opps, Article was not found"
                })
            }
            res.json({
                success: true,
            })
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Failed get all articles",
        })
    }
};

export const getOne = async(req, res)=>{
    try {
        const postId = req.params.id;

        PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: {viewsCount: 1},
            },
            {
                returnDocument: 'after',
            },
            (err, doc)=>{
                if(err){
                    console.log(error)
                    return res.status(500).json({
                        message: "Something happend!",
                    })
                }
                if(!doc){
                    return res.status(404).json({
                        message: "Article has not found"
                    })
                }

                res.json(doc)
            }
        )

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Failed get this article",
        })
    }
};


export const create = async(req, res) =>{
   try {
    const doc = new PostModel({
        title: req.body.title,
        text: req.body.text,
        imgUrl: req.body.imgUrl,
        tags: req.body.tags,
        user: req.userId,
    });

    const post = await doc.save();

    res.json(post)

   } catch (error) {
    console.log(error)
    res.status(500).json({
        message: "Post article creation Failed",
    })
   } 
};

export const update = async(req, res) =>{
    try {

        const postId = req.params.id;

        await PostModel.updateOne({
            _id: postId,
        }, {
            title: req.body.title,
            text: req.body.text,
            imgUrl: req.body.imgUrl,
            tags: req.body.tags,
            user: req.userId,
        });

        res.json({message: "success"})

     } catch (error) {
     console.log(error)
     res.status(500).json({
         message: "Could not update article",
     })
    } 
 }
 