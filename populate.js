require('dotenv').config();
const dataset = require('.//data.json');
const Blog = require('.//models/blogModel');
const connectDB = require('./connections/connectDB');
(async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        const blogs = await Blog.create(dataset);
        console.log('Created Blogs', blogs);
        process.exit(0);
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
})();