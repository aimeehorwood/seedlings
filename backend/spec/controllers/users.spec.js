const app = require("../../server");
const request = require("supertest");
const User = require("../../models/user_model");
const TokenGenerator = require ('../../models/token_generator')
require("../mongodb_helper");


describe("/signup", () => {
  afterEach(async () => {
    await User.deleteOne({ email: "person@person.com" });
  });

  describe("POST when all required signup information provided", () => {
    test("it can create a user", async () => {
      let response = await request(app).post("/signup").send({
        username: "person",
        password: "passwordQ123_12uij!",
        email: "person@person.com",
        fullName: "Person Person",
        address: "123,Person Street, N12 BWX",
      });
      expect(response.statusCode).toBe(201);
    });

    test("a user is created", async () => {
      await request(app).post("/signup").send({
        username: "person",
        password: "passwordQ123_12uij!",
        email: "person@person.com",
        fullName: "Person Person",
        address: "123,Person Street, N12 BWX",
      });
      let users = await User.find();
      expect(users.length).toEqual(1);
    });

    describe("POST, when password is missing", () => {
      test("response code is 400", async () => {
        let response = await request(app)
          .post("/signup")
          .send({ email: "person@person.com" });
        expect(response.statusCode).toBe(400);
      });

      test("does not create a user", async () => {
        await request(app).post("/signup").send({ email: "person@person.com" });
        let users = await User.find();
        expect(users.length).toEqual(0);
      });
    });

    describe("POST, when email is missing", () => {
      test("response code is 400", async () => {
        let response = await request(app)
          .post("/signup")
          .send({ password: "Password!12345678" });
        expect(response.statusCode).toBe(400);
      });

      test("does not create a user", async () => {
        await request(app)
          .post("/signup")
          .send({ password: "Password!12345678" });
        let users = await User.find();
        expect(users.length).toEqual(0);
      });
    });
});


describe("/login", () => {
    
    beforeEach(async () => {
      await request(app)
        .post("/signup")
        .send({
            username: "testperson",
            password: "passwordQ123_12uij!",
            email: "test@person.com",
            fullName: "Person Person",
            address: "123,Person Street, N12 BWX"
        });
    });

    afterEach(async () => {
      await User.deleteOne({ email: "test@person.com" });
    });

    //  xdescribe("POST, when email and password are provided", () => {
    //   test("the response code is 201", async () => {
    //     let response = await request(app)
    //       .post("/login")
    //       .send({ email: "test@person.com", password: "passwordQ123_12uij!" });
    //     expect(response.statusCode).toBe("201");
    //   });
    // }); 
 
    describe('POST, when password is missing', () => {
        test('response code is 400', async () => {
          let response = await request(app)
            .post("/login")
            .send({ email: 'test@person.com' })
          expect(response.statusCode).toBe(400)
        }) 
    })

    describe('POST, when email is missing', () => {
        test('response code is 400', async () => {
          let response = await request(app)
            .post('/login')
            .send({ password: "passwordQ123_12uij!" })
          expect(response.statusCode).toBe(400)
        })
      })
  });
});






