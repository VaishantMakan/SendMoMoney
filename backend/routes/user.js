const express = require("express");
const zod = require("zod");
const { User } = require("../db");
const { Account } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../secrets");

const argon2 = require("argon2");
const { authMiddleware } = require("../middleware");

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

    //give the new user a dummy balance
    try {
      await Account.create({
        userId: userId,
        balance: Math.floor(Math.random() * 10000) + 1,
      });
    } catch (err) {
      console.error("Error creating user: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }

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
    return res.status(411).json({
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
          message: "User logged in successfully",
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

//for updating pass, firstName, lastname
// defining zod schema for updates
const updateBody = zod.object({
  password: zod.string().optional(), //optional as user may or may not give
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

router.put("/", authMiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Error while updating information",
    });
  }

  try {
    await User.updateOne({ _id: req.userId }, req.body);

    res.json({
      message: "Updated successfully",
    });
  } catch (err) {
    return res.status(411).json({
      message: "Error while updating information",
    });
  }
});

//route to get users from the backend, filterable via firstName/lastName

router.get("/bulk", async (req, res) => {
  //get the filter given by user
  const filter = req.query.filter || "";

  //fetch the users based on the given filter
  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

module.exports = router;
