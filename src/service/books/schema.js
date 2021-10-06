import mongoose from "mongoose"

const { Schema, model } = mongoose

const bookSchema = new Schema(

  {
	    asin:
	    category: { type: String, required: true },
	    title: { type: String, required: true },
	    cover:{ type: String, required: true },
	    readTime: {
	      value: { type: Number, required: true },
	      unit: { type: String, required: true }
	    },
	    author: {
	      name: { type: String, required: true },
	      avatar:{ type: String, required: true },
	    },
	    content: { type: String, required: true },         
},
{
  timestamps: true, // adds createdAt and updatedAt automatically
}
)

export default model("BlogPost", blogPostsSchema) 