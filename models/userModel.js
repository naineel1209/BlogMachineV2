const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//New Schema for the Model
const User = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Must enter a username"],
    },
    email: {
        type: String,
        required: [true, "Must enter a email address"],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ]
    },
    password: {
        type: String,
        required: [true, "Must enter a password"],
    },
}, {
    timestamps: true,
})

// User.post('findOneAndUpdate', async function (next) {
//     try {
//         if (this._update.password) {
//             this._update.password = await bcrypt.hash(this._update.password, 10);
//         }
//     } catch (error) {

//     }
// });

User.pre('save', async function () {
    this.password = await bcrypt.hash(this.password, 10);
});

mongoose.set('strictQuery', false);

module.exports = mongoose.model('User', User);