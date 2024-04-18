const getBlogById = `SELECT * FROM posts WHERE id = $1`;
const getBlogByIdByUserId = `SELECT * FROM posts WHERE userId = $1`;
const getBlogByIdById = `SELECT * FROM posts WHERE id = $1`;
const getBlogs = `SELECT * FROM posts`;
const createBlogQuery = `
INSERT INTO "posts" 
(title, body, image, userId) 
VALUES ($1, $2, $3, $4) 
RETURNING *`;
const updateBlogQuery = `
  UPDATE "posts"
  SET title = $1,
      body = $2,
      image = $3
  WHERE id = $4 AND userId = $5
  RETURNING *
`;
const deleteBlogQuery = `
  DELETE FROM "posts"
  WHERE id = $1
  RETURNING *
`;

module.exports = {
  getBlogById,
  getBlogByIdByUserId,
  createBlogQuery,
  getBlogs,
  getBlogByIdById,
  updateBlogQuery,
  deleteBlogQuery,
};
