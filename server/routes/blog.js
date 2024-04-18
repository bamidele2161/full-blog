const express = require("express");
const {
  CreatePost,
  GetAllPosts,
  GetAPost,
  UpdatePost,
  DeletePost,
  GetAllPostsByUserId,
} = require("../controller/blog");

const router = express.Router();

router.post("/:userId", CreatePost);
router.get("/", GetAllPosts);
router.get("/user/:userId", GetAllPostsByUserId);
router.get("/:postId", GetAPost);
router.put("/:userId/:postId", UpdatePost);
router.delete("/:userId/:postId", DeletePost);
module.exports = router;
