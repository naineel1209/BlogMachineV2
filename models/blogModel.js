const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "ENTER A VALID TITLE"],
    },
    author: {
        type: String,
        required: [true, "ENTER A VALID AUTHOR"],
    },
    imageUrl: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2022/11/15/06/35/night-7593233_1280.jpg"
    },
    body: {
        type: String,
        required: [true, "ENTER A VALID BODY (min. length - 10)"],
    },
    tags: [String],
    createdBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: [true, "Please provide a valid user-name"]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Blog", blogSchema);