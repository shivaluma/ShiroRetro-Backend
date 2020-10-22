const router = require('express').Router();
const authRouter = require('./auth.route');
const userRouter = require('./user.route');
const boardRouter = require('./board.route');
const listController = require('./board.route');
const cardController = require('./board.route');

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/boards', boardRouter);
router.use('/lists', listController);
router.use('/cards', cardController);
module.exports = router;
