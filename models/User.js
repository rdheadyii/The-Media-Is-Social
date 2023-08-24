// import in needed variables from mongoose
const {Schema, model} = require('mongoose');

// write the schema for user as the building block for the model
const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
            match: [/.+\@.+\..+/],
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'thought',
            },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user',
            },
        ],
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

// make the virtual for the friends list
userSchema
    .virtual('friendCount')
    .get(function () {
        return this.friends.length;
    });

// creat the model using schema and declare its name
const User = model('user', userSchema)

// eport out model
module.exports = User;