const { mockUserModel } = require("../../../../utils/mocks/Users.js");

const request = require("supertest");
const { STATUS_CODES } = require("http");
const app = require("../../../../app");

describe("/signout", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "secret";
  });
  afterAll(() => {
    delete process.env.JWT_SECRET;
  });
  it("401 - Auth cookie not present", async () => {
    const response = await request(app).get("/auth/signout");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: STATUS_CODES[400],
      message: "Failed to validate user session",
      statusCode: 400,
    });
  });

  it("205 - Successful signout", async () => {
    const mockJWT = mockUserModel.generateJWT();
    const response = await request(app).get("/auth/signout").set("Cookie", `jwt=${mockJWT}`);

    expect(response.status).toBe(205);
    // Should contain jwt=; in the set-cookie value
    expect(response.headers["set-cookie"][0]).toMatch(/jwt=;*/);
  });
});
