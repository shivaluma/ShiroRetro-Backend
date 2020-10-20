const router = require('express').Router();
const authRouter = require('./auth.route');
const userRouter = require('./user.route');
const boardRouter = require('./board.route');

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/board', boardRouter);
module.exports = router;
