import express from "express"
import createHttpError from "http-errors"
import blogPostsModel from "./schema.js"

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

export default blogPostsRouter