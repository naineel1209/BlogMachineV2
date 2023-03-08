require('dotenv').config();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const error = require('../errors');

function getRegister(req, res) {
    return res.render('register');
}

async function postRegister(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            throw new error.BadRequestError("Enter Valid Credentials");
        }

        await User.create(req.body);
        return res.status(201).send({ status: 'ok', body: req.body });

    } catch (error) {
        return res.status(500).send({ status: 'error', body: error });
    }
}

function getLogin(req, res) {
    if (req.cookies?.jwt) {
        return res.redirect('/home');
    }
    return res.render('login');
}

async function postLogin(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        console.log(user);
        if (user) {
            //compare the password
            const verified = await bcrypt.compare(password, user.password);
            console.log(verified);

            //if match found assign it a jsonwebtoken
            if (verified) {
                const accessToken = await jwt.sign({ userId: user._id, email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30d" });
                console.log(accessToken);

                //set the cookie
                res.cookie('jwt', { accessToken: accessToken }, { httpOnly: true, sameSite: 'none', secure: false, maxAge: 3600 * 24 * 1000 });

                //return the message
                return res.status(201).send({ status: 'ok', message: "Login Approved" });
            } else {
                //if match not found send error
                return res.send({ status: 'error', message: "Invalid password" });
            }
        } else {
            throw new error.BadRequestError("Enter Correct Credentials");
        }
    } catch (err) {
        console.log(err);
        return res.send({ status: 'error', message: err.message });
    }
}

const deleteToken = async (req, res) => {
    try {
        res.clearCookie('jwt');
        res.send({ status: 'ok' });
    } catch (err) {
        return res.send({ status: 'error' });
    }
};
module.exports = { getRegister, postRegister, getLogin, postLogin, deleteToken }; 