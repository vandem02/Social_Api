const router = require("express").Router();
const { User, Thought } = require("../models");

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "No user exists with that ID." });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { runValidators: true, new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "No user exists with that ID." });
    }

    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id });

    if (!user) {
      return res.status(404).json({ message: "No user exists with that ID." });
    }

    await Thought.deleteMany({ _id: { $in: user.thoughts } });

    res.json({ message: `Deleted ${user.username} and their thoughts.` });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/:id/friends/:friendId", async (req, res) => {
  if (req.params.id == req.params.friendId) {
    return res.status(400).json({ message: "You can't add yourself as a friend!" });
  }
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "No user exists with that ID." });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id/friends/:friendId", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "No user exists with that ID." });
    }

    res.json(user)
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router