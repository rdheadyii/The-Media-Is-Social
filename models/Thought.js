// import in needed variables from mongoose and reactionSchema
const {Schema, model} = require('mongoose');
const reactionSchema = require('./Reaction');

// write the schema for thought as the building block for the model
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    }
);

// make the virtual for the friends list
thoughtSchema
    .virtual('reactionCount')
    .get(function () {
        return this.reactions.length;
    });

// creat the model using schema and declare its name
const Thought = model('thought', thoughtSchema);

// export out model
module.exports = Thought;