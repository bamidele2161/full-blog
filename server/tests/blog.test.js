const request = require("supertest");
const { app, server } = require("../index");
const { connectionPool, closeDbConnection } = require("../config/dbConnection");
const { deleteBlogByTitleQuery } = require("../queries/blog");

describe("All post endpoints test", () => {
  beforeAll(async () => {
    const title = "testing";
    const deletePost = await connectionPool.query(deleteBlogByTitleQuery, [
      title,
    ]);

    const csrfResponse = await request(app).get("/csrf-token").expect(200);
    csrfToken = csrfResponse.body.csrfToken;
    console.log(csrfToken);
  });

  let csrfToken;

  const data = {
    title: "testing",
    body: "this it the testing body",
    image: "avatar.png",
  };

  let id;

  it("should create a new post", async () => {
    const res = await request(app)
      .post("/blog")
      .send(data)
      .set("CSRF-Token", csrfToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Post created successfully");
    expect(res.body?.data?.title).toBe(data.title);
    id = res?.body?.data?.id;
  });

  it("should return all blogs", async () => {
    const res = await request(app).get("/blog");
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("should return a 200", async () => {
    const res = await request(app).get(`/blog/${id}`);
    expect(res.statusCode).toBe(200);
  });

  const w_id = "1000";
  it("should return a 400", async () => {
    const res = await request(app).get(`/blog/${w_id}`);
    expect(res.statusCode).toBe(400);
  });

  it("should update a blog", async () => {
    const res = await request(app)
      .put(`/blog/${id}`)
      .set("CSRF-Token", csrfToken)
      .send({
        title: "testing",
        body: "this it the testing body",
        image: "avatar.png",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Post updated successfully");
  });

  // afterAll(async () => {
  //   await closeDbConnection(connectionPool);
  //   server.close();
  // });
});
