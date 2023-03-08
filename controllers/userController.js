const Blogs = require('..//models/blogModel');
const User = require('..//models//userModel')
const mongoose = require('mongoose');
const { StatusCodes: codes } = require('http-status-codes');

const getMyProfile = async (req, res) => {
    console.log("getMyBlogs");
    const queryObject = {
        createdBy: req.user._id
    }

    const myBlogs = await Blogs.find(queryObject);

    return res.render('myProfile', { blogs: myBlogs, user: req.user });
};

const getHomepage = async (req, res) => {
    console.log("getMyBlogs");
    const limit = req.query.limit || 5;

    const blogs = await Blogs.find().limit(limit);
    return res.render('index', { blogs: blogs });
}

const getAllBlogs = async (req, res) => {
    console.log("allBlogsPage")

    let blogs = Blogs.find();
    const page = Number(req.query.page) || 1;

    //sort the blogs at createdAt or unless specified.
    blogs.sort('createdAt');

    limit = Number(req.query.limit);
    const skip = (page - 1) * limit;
    blogs.skip(skip).limit(limit);

    const results = await blogs;
    return res.render('allBlogs', {
        blogs: results,
        limit: limit
    });
}

//!get single blogs
const getSingleBlog = async (req, res) => {
    const blogId = req.params.blogId;

    if (mongoose.isValidObjectId(blogId)) {

        const blog = await Blogs.findOne({ _id: req.params.blogId });

        if (blog) {
            return res.render('singleBlogPage', { blog: blog });
        } else {
            return res.status(404).render('404');
        }
    } else {
        return res.status(404).render('404');
    }
}


//!adding the data
const addData = async (req, res) => {
    console.log("CREATE func??");
    req.body.createdBy = req.user._id;
    console.log(req.body, req.user);
    try {
        const blog = await Blogs.create(req.body);
        return res.status(201).send({ success: true, _id: blog._id });
    } catch (error) {
        return res.status(500).send({ success: false });
    }
}


//! finding by specific tags -> $all flag finds the tags field that matched the queryTags
const findBySpecificTag = async (req, res) => {
    const { tags } = req.query;
    const blogs = await Blogs.find({ tags: { $all: tags } });
    console.log(blogs);
    return res.status(200).json({ message: "done!", blogs: blogs });
};

//! to edit the blog
//!we get its blogId from params
const preEditBlog = async (req, res) => {
    console.log(req.params);
    const blog = await Blogs.find({ _id: req.params.blogId }).then(res => res);
    return res.render('edits', { blog: blog });
}

//! render the create blog page
const createBlogPage = (req, res) => {
    res.render('createBlog');
};


//! update the blog
const updateBlog = async (req, res) => {
    console.log(req.body);
    const blog = await Blogs.findByIdAndUpdate(req.body._id, req.body).then(res => res);

    console.log(blog);
    return res.status(200).send({ success: true, _id: blog._id });
    // return res.json({ success: true });
};

//! delete the blog
const deleteBlog = async (req, res) => {
    const { id } = req.query;
    console.log(id);

    try {
        const blog = await Blogs.findOne({ _id: id });

        console.log("Hello...");
        if (blog.createdBy.equals(req.user._id)) {
            const delBlog = await Blogs.findByIdAndDelete(id);
            return res.status(204).send({ success: true, blog });
        } else {
            console.log("NOOO");
            throw new Error("Bad Request Error");
        }
    } catch (err) {
        return res.status(500).send({ success: false, err: err.message });
    }
}

//renders the change the password 
const getChangePassword = async (req, res) => {
    return res.render('changePassword', { user: req.user });
};


//change password functionality
const patchChangePassword = async (req, res) => {
    try {
        const { id, password } = req.body;
        console.log(id, password);

        const user = await User.findById(id);
        user.password = password;
        await user.save();

        return res.send({ status: 'ok', msg: 'Password Updated Successfully' });
    } catch (err) {
        return res.send({ status: 'error', msg: err.message });
    }
};

//search engine for searching the queries
const searchQuery = async (req, res) => {
    const { keywords, limit } = req.query;

    console.log(keywords);
    const filter = {};
    if (keywords) {
        const regex = new RegExp(keywords, 'i');
        console.log(regex);

        filter.$or = [
            { title: { $regex: regex } },
            { author: { $regex: regex } },
            { tags: { $elemMatch: { $regex: regex } } },
        ];

        const blogs = await Blogs.find(filter).then(res => res);

        return res.render('allBlogs', {
            blogs: blogs, limit: limit
        })
    } else {
        return res.send('DATA NOT FOUND');
    }
}


module.exports = { getHomepage, getAllBlogs, addData, createBlogPage, getSingleBlog, preEditBlog, updateBlog, deleteBlog, getMyProfile, getChangePassword, patchChangePassword, searchQuery };