const router = require("express").Router();
const { Thought, User } = require("../models");

router.get("/", async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const thought = await Thought.findOne({ _id: req.params.thoughtId });

    if (!thought) {
      return res.status(404).json({ message: "No thought with that ID" });
    }

    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const thought = await Thought.create(req.body);
    const user = await User.findOneAndUpdate({ _id: req.body.userId }, { $addToSet: { thoughts: thought._id } }, { new: true });

    if (!user) {
      return res.status(404).json({
        message: "Thought created, but found no user with that ID",
      });
    }

    res.json("Created the thought 🎉");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    );

    if (!thought) {
      return res.status(404).json({ message: "No thought with this id!" });
    }

    res.json(thought);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });

    if (!thought) {
      return res.status(404).json({ message: "No thought with this id!" });
    }

    const user = await User.findOneAndUpdate({ thoughts: req.params.thoughtId }, { $pull: { thoughts: req.params.thoughtId } }, { new: true });

    if (!user) {
      return res.status(404).json({
        message: "Thought created but no user with this id!",
      });
    }

    res.json({ message: "Thought successfully deleted!" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router