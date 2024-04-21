const request = require("supertest");
const { app, server } = require("../index");
const { deleteUserQuery } = require("../queries/auth");
const { connectionPool, closeDbConnection } = require("../config/dbConnection");

describe("All user endpoints test", () => {
  beforeAll(async () => {
    const email = "new4@gmail.com";
    const deletePost = await connectionPool.query(deleteUserQuery, [email]);

    const csrfResponse = await request(app).get("/csrf-token").expect(200);
    csrfToken = csrfResponse.body.csrfToken;
    console.log(csrfToken);
  });

  let csrfToken;

  const data = {
    first_name: "new",
    last_name: "new",
    email: "new4@gmail.com",
    password: "12345678",
    phone: "twitter",
    image: "avatar.png",
  };

  let id;

  it("should create a new user", async () => {
    const res = await request(app)
      .post("/user")
      .send(data)
      .set("CSRF-Token", csrfToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Account created successfully");
    expect(res.body?.data?.email).toBe(data.email);
    id = res?.body?.data?.id;
  });

  // it("should return a 200", async () => {
  //   const data = {
  //     email: "femade@gmail.com",
  //     password: "111111",
  //   };
  //   const res = await request(app)
  //     .post("/user/login")
  //     .send(data)
  //     .set("CSRF-Token", csrfToken);
  //   console.log("login check", res);
  //   expect(res.body.message).toBe("User login successfully");
  //   expect(res.statusCode).toBe(200);
  //   expect(res.body?.data?.email).toBe(data.email);
  // });

  it("should return a 404", async () => {
    const data = {
      email: "femiade@gmail.com",
      password: "11111111",
    };
    const res = await request(app)
      .post("/user/login")
      .send(data)
      .set("CSRF-Token", csrfToken);

    expect(res.statusCode).toBe(404);
  });

  // afterAll(async () => {
  //   await closeDbConnection(connectionPool);
  //   server.close();
  // });
});
