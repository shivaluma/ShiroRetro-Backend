const router = require('express').Router();
const AuthController = require('../controllers/auth.controller');

router.post('/signin', AuthController.postSignIn);
router.post('/signup', AuthController.postSignUp);
router.post('/signin-google', AuthController.postGoogleSignIn);
module.exports = router;
