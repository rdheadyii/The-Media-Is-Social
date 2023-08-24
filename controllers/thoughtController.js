const { Thought, User } = require('../models');

module.exports = {
    // get all thoughts
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // get single thought by id
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId })
                .select('-__v');
    
            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }
    
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // create a new thought and push it to user's thoughts
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);
            const user = await User.findOneAndUpdate(
                {_id: req.body.userId},
                {$addToSet: {thoughts: thought._id}},
                {new: true}
            );

            if (!user) {
                return res.status(404).json({
                    message: 'Thought created, but found no user with that ID',
                });
            }
            res.json({message: 'Thought created successfully!'});
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    // update thought by id
    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            );
    
            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }
    
            res.json(thought);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    // delete thought and remove from user thought array
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });
    
            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }
    
            const user = await User.findOneAndUpdate(
                { thoughts: req.params.thoughtId },
                { $pull: { thoughts: req.params.thoughtId } },
                { new: true }
            );
    
            if (!user) {
                return res
                    .status(404)
                    .json({ message: 'Thought created but no user with this id!' });
            }
    
            res.json({ message: 'Thought successfully deleted!' });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // add a thought reaction
    async addReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { runValidators: true, new: true }
            );
    
            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }
    
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // delete a thought reaction
    async removeReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { runValidators: true, new: true }
            )
    
            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }
    
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
};