const { connectionPool } = require("../config/dbConnection");
const { checkUserExistenceQueryById } = require("../queries/auth");
const {
  createBlogQuery,
  getBlogs,
  updateBlogQuery,
  deleteBlogQuery,
  getBlogById,
  getBlogByIdByUserId,
} = require("../queries/blog");
const { validateLength } = require("../utils/validation");

exports.CreatePost = async (req, res) => {
  try {
    const { title, body, image } = req.body;
    if (!validateLength(title, 3, 100)) {
      return res.status(400).json({
        error: "Your title must be between 3 and 30 characters.",
        statusCode: 400,
      });
    }
    const userId = req.user.id;

    const checkUserExistence = await connectionPool.query(
      checkUserExistenceQueryById,
      [userId]
    );

    if (!checkUserExistence.rowCount === 1) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }

    const values = [title, body, image, userId];

    const createBlog = await connectionPool.query(createBlogQuery, values);

    if (!createBlog) {
      return res.status(401).json({
        message: "Error occured while creating post",
      });
    }

    return res.status(200).json({
      message: "Post created successfully",
      data: createBlog.rows[0],
      statusCode: 200,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error occured!",
    });
  }
};

exports.GetAllPosts = async (req, res) => {
  try {
    const getAllPost = await connectionPool.query(getBlogs);

    if (getAllPost.rowCount < 1) {
      return res.status(400).json({
        message: "No record found",
      });
    }
    return res.status(200).json({
      message: "Posts fetched successfully",
      data: getAllPost.rows,
      statusCode: 200,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error occured!",
    });
  }
};

exports.GetAPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await connectionPool.query(getBlogById, [postId]);

    if (post.rowCount < 1) {
      return res.status(400).json({
        message: "No record found",
      });
    }
    return res.status(200).json({
      message: "Posts fetched successfully",
      data: post.rows,
      statusCode: 200,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error occured!",
    });
  }
};

exports.GetAllPostsByUserId = async (req, res) => {
  try {
    const userId = req.user.id;
    const getAllPostByUserId = await connectionPool.query(getBlogByIdByUserId, [
      userId,
    ]);

    if (getAllPostByUserId.rowCount < 1) {
      return res.status(400).json({
        message: "No record found",
      });
    }
    return res.status(200).json({
      message: "Posts fetched successfully",
      data: getAllPostByUserId.rows,
      statusCode: 200,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error occured!",
    });
  }
};

exports.GetAllPostsById = async (req, res) => {
  try {
    const id = req.params.id;
    const getAllPostById = await connectionPool.query(getBlogByIdByUserId, [
      id,
    ]);

    if (!getAllPostById.rowCount < 1) {
      return res.status(400).json({
        message: "No record found",
      });
    }
    return res.status(200).json({
      message: "Posts fetched successfully",
      data: getAllPostById.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error occured!",
    });
  }
};

exports.UpdatePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;
    const { title, body, image } = req.body;
    const checkUserExistence = await connectionPool.query(
      checkUserExistenceQueryById,
      [userId]
    );

    if (!checkUserExistence.rowCount === 1) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }
    const updatePost = await connectionPool.query(updateBlogQuery, [
      title,
      body,
      image,
      postId,
      userId,
    ]);

    if (!updatePost) {
      return res.status(400).json({
        message: "Error occured while updating post",
      });
    }

    return res.status(200).json({
      message: "Post updated successfully",
      data: updatePost.rows[0],
      statusCode: 200,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error occured!",
    });
  }
};

exports.DeletePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    const checkUserExistence = await connectionPool.query(
      checkUserExistenceQueryById,
      [userId]
    );

    if (!checkUserExistence.rowCount === 1) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }

    const deletePost = await connectionPool.query(deleteBlogQuery, [postId]);

    if (!deletePost) {
      return res.status(401).json({
        message: "Error occured while deleting post",
      });
    }
    return res.status(200).json({
      message: "Post deleted successfully",
      data: deletePost,
      statusCode: 200,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error occured!",
    });
  }
};
