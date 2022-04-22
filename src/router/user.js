const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const axios = require("axios");

const User = require("../models/user");
const Genre = require("../models/genre");
const UserChoice = require("../models/userChoice");

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    const token = await user.generateAuthToken();
    await user.save();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Updates" });
  }
  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const userChoice = await UserChoice.findOne({
      userId: user._id.toString(),
    });
    res.send({ user: user.toJSON(), userChoice });
  } catch (e) {
    console.log(e);
    res.status(400).send();
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/genres", auth, async (req, res) => {
  const user = await User(req.user);
  try {
    user.isOnBoarding = true;
    await user.save();
    const isOnBoard_user = user.isOnBoarding
    let response;
    await axios
      .get(
        "https://api.themoviedb.org/3/genre/movie/list?api_key=838f0727d3b15585e4712294e486d8c5&language=en-US"
      )
      .then((res1) => {
        response = res1.data;
      })
      .catch((e) => console.log(e));
    res.status(200).send({response, isOnBoard_user});
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.post("/userChoice", auth, async (req, res) => {
  const choice = await UserChoice(req.body);
  try {
    await choice.save();
    res.status(201).send("User's Choice Saved Successfully");
  } catch (e) {
    console.log(e);
    res.status(400).send("Something Wrong Happened");
  }
});

router.get("/dashboard", auth, async (req, res) => {
  const user = await User(req.user);
  try {
    const userChoice = await UserChoice.findOne({
      userId: user._id.toString(),
    });
    let result = userChoice && userChoice.genres.map((a) => a.id);
    let str = "";
    for (let i = 0; i < result.length; i++) {
      str += result[i] + ",";
    }
    let api_result;
    await axios
      .get(
        `https://api.themoviedb.org/3/discover/movie?api_key=838f0727d3b15585e4712294e486d8c5&language=en-US&with_genres=${str}`
      )
      .then((res1) => {
        api_result = res1.data;
      })
      .catch((e) => console.log(e));
    res.status(200).send({ api_result });
  } catch (e) {
    console.log(e);
    res.status(400).send("somethien wrong");
  }
});

module.exports = router;
