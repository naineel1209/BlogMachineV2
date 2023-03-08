const express = require('express');
const router = express.Router();

//resources
const { getMyBlogs, getHomepage, getAllBlogs, addData, createBlogPage, getSingleBlog, preEditBlog, updateBlog, deleteBlog, getMyProfile, getChangePassword, patchChangePassword, searchQuery } = require('..//controllers/userController');
const { deleteToken } = require('..//controllers/authController');
const verifyJWT = require('..//middleware/verifyJWT');

//routes
router.route('/home')
    .get(verifyJWT, getHomepage);

router.route('/blogs')
    .get(verifyJWT, getAllBlogs)

//renders the create article page
router.route('/createForm')
    .get(verifyJWT, createBlogPage);

//create article
router.route('/addBlog')
    .post(verifyJWT, addData)
    .patch(verifyJWT, updateBlog);

//renders the edit/update article page
router.route('/edits/:blogId')
    .get(verifyJWT, preEditBlog);

//function to delete the article
router.route('/delete')
    .delete(verifyJWT, deleteBlog);

//renders the singleBlogPage
router.route('/blogs/:blogId')
    .get(verifyJWT, getSingleBlog);

//renders the my profile page with my articles and my user information
router.route('/my-profile')
    .get(verifyJWT, getMyProfile);

//route for changing password
router.route('/change-password')
    .get(verifyJWT, getChangePassword)
    .patch(verifyJWT, patchChangePassword);

router.route('/search')
    .get(searchQuery);

module.exports = router;