const router = require("express").Router()
const { Thought } = require("../models")

router.post("/:id", async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.id },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    );

    if (!thought) {
      return res.status(404).json({ message: 'No thought exists with this ID.' });
    }

    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
})

router.delete("/:id", async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { reactions: { _id: req.params.reactionId } } },
      { runValidators: true, new: true }
    );

    if (!thought) {
      return res.status(404).json({ message: 'No thought with this id!' });
    }

    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
})

module.exports = router