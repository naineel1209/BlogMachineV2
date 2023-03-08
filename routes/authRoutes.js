const express = require('express');
const router = express.Router();

const { getRegister, postRegister, getLogin, postLogin, deleteToken } = require('..//controllers/authController');
const verifyJWT = require('..//middleware/verifyJWT');

router
    .route('/')
    .get((req, res) => {
        console.log("hey")
        if (req.cookies?.jwt?.accessToken) {
            console.log(req.cookies.jwt);
            {
                return res.redirect('/home');
            }
        } else {
            return res.redirect("/login");
        };
    });

router
    .route('/register')
    .get(getRegister)
    .post(postRegister);


router
    .route('/login')
    .get(getLogin)
    .post(postLogin);

//user route - needed to shift later
router.
    route('/logout')
    .delete(deleteToken)


module.exports = router;