const express = require("express");
const zod = require("zod");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../secrets");

const argon2 = require("argon2");

const router = express.Router();

//Define zod structure for signup
const signupBody = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});

router.post("/signup", async (req, res) => {
  const { success } = signupBody.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Incorrect input given",
    });
  }

  //check db if user already exists
  const existingUser = await User.findOne({
    username: req.body.username,
  });

  if (existingUser) {
    return res.status(411).json({
      message: "Email/user already taken",
    });
  }

  try {
    // Hash the password before storing in the db using Argon2
    const hashedPassword = await argon2.hash(req.body.password);

    const user = await User.create({
      username: req.body.username,
      password: hashedPassword, //storing the hashed pass
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });

    //storing the unique id returned by mongo db record
    const userId = user._id;

    //create the jwt token
    const token = jwt.sign(
      {
        userId,
      },
      JWT_SECRET
    );

    res.json({
      message: "User created successfully",
      token: token,
    });
  } catch (error) {
    console.error("Error creating user: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Defining zod structure for signin body
const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

router.post("/signin", async (req, res) => {
  //validate the input via zod
  const { success } = signinBody.safeParse(req.body);

  if (!success) {
    res.status(411).json({
      message: "Error while logging in",
    });
  }

  try {
    //find the user in db
    const user = await User.findOne({
      username: req.body.username,
    });

    if (user) {
      // Verify hashed password using argon2.verify
      const passwordVerify = await argon2.verify(
        user.password,
        req.body.password
      );

      if (passwordVerify) {
        const token = jwt.sign(
          {
            userId: user._id,
          },
          JWT_SECRET
        );

        res.json({
          token: token,
        });

        return;
      }
    }

    res.status(411).json({
      message: "Error while logging in",
    });
  } catch (error) {
    console.error("Error signing in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
