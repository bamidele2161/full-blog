const express = require("express");
const {
  CreatePost,
  GetAllPosts,
  GetAPost,
  UpdatePost,
  DeletePost,
  GetAllPostsByUserId,
} = require("../controller/blog");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post("/", authMiddleware, CreatePost);
router.get("/", GetAllPosts);
router.get("/user", authMiddleware, GetAllPostsByUserId);
router.get("/:postId", GetAPost);
router.put("/:postId", authMiddleware, UpdatePost);
router.delete("/:postId", authMiddleware, DeletePost);
module.exports = router;
