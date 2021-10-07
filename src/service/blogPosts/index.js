import express from "express"
import createHttpError from "http-errors"
import blogPostsModel from "./schema.js"
import commentModel from "./commentSchema.js";
import q2m from "query-to-mongo";

const blogPostsRouter = express.Router()

blogPostsRouter.post("/", async (req, res, next) => {
  try {
    const newblogPost = new blogPostsModel(req.body) 
    const { _id } = await newblogPost.save() 

    res.status(201).send({ _id })
  } catch (error) {
    console.log(error)
    next(error)
  }
})

blogPostsRouter.get("/", async (req, res, next) => {
  try {
    const blogPosts = await blogPostsModel.find()

    res.send(blogPosts)
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.get("/:blogPostsId", async (req, res, next) => {
  try {
    const blogPostsId = req.params.blogPostsId

    const blogPosts = await blogPostsModel.findById(blogPostsId) // similar to findOne, but findOne expects to receive a query as parameter

    if (blogPosts) {
      res.send(blogPosts)
    } else {
      next(createHttpError(404, `blogPosts with id ${blogPostsId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.put("/:blogPostsId", async (req, res, next) => {
  try {
    const blogPostsId = req.params.blogPostsId
    const modifiedBlogPosts = await blogPostsModel.findByIdAndUpdate(blogPostsId, req.body, {
      new: true, // returns the modified blogPosts
    })

    if (modifiedBlogPosts) {
      res.send(modifiedBlogPosts)
    } else {
      next(createHttpError(404, `blogPosts with id ${blogPostsId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.delete("/:blogPostsId", async (req, res, next) => {
  try {
    const blogPostsId = req.params.blogPostsId

    const deletedblogPosts = await blogPostsModel.findByIdAndDelete(blogPostsId)

    if (deletedblogPosts) {
      res.status(204).send()
    } else {
      next(createHttpError(404, `blogPosts with id ${blogPostsId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.post("/:blogPostsId/comments", async (req, res, next) => {
 try {
    console.log(req.body);
    
    console.log(newComment);
    const updatedBlogPost = await blogPostsModel.findByIdAndUpdate(
      req.params.blogPostsId,
      { $push: { comments: req.body } },
      { new: true }
    );
    if (updatedBlogPost) {
      res.send(updatedBlogPost);
    } else {
      next(createHttpError(404, `Blog Post with id ${id} not found!`));
    }
  } catch (error) {
    console.log(error)
    next(error);
  }
})

blogPostsRouter.get("/:blogPostsId/comments", async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.userId)
    if (user) {
      res.send(user.comments)
    } else {
      next(createHttpError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.get("/:blogPostsId/comments/:purchasedId", async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.userId)
    if (user) {
      const purchasedItem = user.comments.find(book => book._id.toString() === req.params.purchasedId) // I CANNOT compare an ObjectId (_id) with a string, _id needs to be converted into a string
      if (purchasedItem) {
        res.send(purchasedItem)
      } else {
        next(createHttpError(404, `Book with id ${req.params.purchasedId} not found in purchase history!`))
      }
    } else {
      next(createHttpError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.put("/:blogPostsId/comments/:purchasedId", async (req, res, next) => {
  try {
    // const user = await UserModel.findOneAndUpdate(
    //   { _id: req.params.userId, "comments._id": req.params.purchasedId },
    //   {
    //     "comments.$": req.body, // $ is the POSITIONAL OPERATOR, it represents the index of the book found in the query ("comments._id": req.params.purchasedId )
    //   },
    //   { new: true }
    // )
    // comments = [{}, {}, {}, {} ]
    // comments[2] = req.body
    // if (user) {
    //   res.send(user)
    // } else {
    //   next(createHttpError(404, `User with id ${req.params.userId} not found!`))
    // }

    const user = await UserModel.findById(req.params.userId) // user is a MONGOOSE DOCUMENT not a normal plain JS object

    if (user) {
      const index = user.comments.findIndex(p => p._id.toString() === req.params.purchasedId)

      if (index !== -1) {
        user.comments[index] = { ...user.comments[index].toObject(), ...req.body }
        await user.save()
        res.send(user)
      } else {
        next(createHttpError(404, `Book with id ${req.params.purchasedId} not found in purchase history!`))
      }
    } else {
      next(createHttpError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.delete("/:blogPostsId/comments/:purchasedId", async (req, res, next) => {
  try {
    const user = await UserModel.findByIdAndUpdate(
      req.params.userId, // WHO we want to modify
      { $pull: { comments: { _id: req.params.purchasedId } } }, // HOW we want to modify that user (remove a specified item from the comments array)
      { new: true } // options
    )
    if (user) {
      res.send(user)
    } else {
      next(createHttpError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})


export default blogPostsRouter