const express = require("express");
const Account = require("../db");
const mongoose = require("mongoose");
const { authMiddleware } = require("../middleware");
const router = express.Router();

//endpoint to fetch the user's balance
router.get("/balance", authMiddleware, async (req, res) => {
  const account = await Account.findOne({
    userId: req.userId,
  });

  res.json({
    balance: account.balance,
  });
});

//endpoint to transfer money to another account
router.post("/transfer", authMiddleware, async (req, res) => {
  //using mongodb transactions feature for handling concurrent requests and failures in a better manner

  //create the session for transaction
  const session = await mongoose.startSession();

  try {
    //start the transaction
    session.startTransaction();

    const { amount, to } = req.body;

    //Fetch the accounts within the transaction
    const account = await Account.findOne({ userId: req.userId }).session(
      session
    );

    if (!account) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Invalid account",
      });
    }

    if (account.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Invalid account",
      });
    }

    //performing the transfer
    await Account.updateOne(
      { userId: req.userId },
      {
        $inc: { balance: -amount },
      }
    ).session(session);

    await Account.updateOne(
      { userId: to },
      {
        $inc: { balance: amount },
      }
    ).session(session);

    //commit the transaction
    await session.commitTransaction();

    res.json({
      message: "Transfer successful",
    });
  } catch (err) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Internal error, please try again later",
    });
  }
});

module.exports = router;
