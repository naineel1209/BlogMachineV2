require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('..//models/userModel');

async function verifyJWT(req, res, next) {
    try {
        const token = req?.cookies?.jwt?.accessToken;
        console.log(token);
        //verify the token if present in the cookie
        if (token) {
            await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
                if (err) {
                    console.log(err.message);
                    throw new Error("Error");
                }

                if (decoded) {
                    const foundUser = await User.findOne({ _id: decoded.userId });
                    req.user = foundUser;

                    //move to next!
                    next();
                } else {
                    throw new Error();
                }
            });
        } else {
            throw new Error();
        }
    } catch (err) {
        console.log(err.message);
        return res.redirect('/login');
    }
}

module.exports = verifyJWT;