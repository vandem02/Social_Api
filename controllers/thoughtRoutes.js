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
    const thought = await Thought.findById(req.params.id);

    if (!thought) {
      return res.status(404).json({ message: "No thought exists with that ID." });
    }

    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    let user = User.findById(req.body.userId);

    if (!user) {
      return res.status(404).json({ message: "No user exists with that ID." });
    }

    const thought = await Thought.create(req.body);
    user = await User.findOneAndUpdate(
      { _id: req.body.userId },
      { $addToSet: { thoughts: thought._id } },
      { new: true }
    );

    res.status(201).json("Thought created.");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { runValidators: true, new: true }
    );

    if (!thought) {
      return res.status(404).json({ message: "No thought exists with that ID." });
    }

    res.json(thought);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const thought = await Thought.findByIdAndDelete(req.params.id);

    if (!thought) {
      return res.status(404).json({ message: "No thought exists with that ID." });
    }

    const user = await User.findOneAndUpdate(
      { thoughts: req.params.id },
      { $pull: { thoughts: req.params.id } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "No user exists with that ID." })
    }

    res.json({ message: "Thought deleted." });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/:id/reactions", async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.id },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    );

    if (!thought) {
      return res.status(404).json({ message: 'No thought exists with that ID.' });
    }

    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
})

router.delete("/:id/reactions/:reactionId", async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { reactions: { _id: req.params.reactionId } } },
      { runValidators: true, new: true }
    );

    if (!thought) {
      return res.status(404).json({ message: 'No thought exists with that ID.' });
    }

    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
})

module.exports = router;