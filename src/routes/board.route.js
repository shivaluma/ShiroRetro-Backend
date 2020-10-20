const router = require('express').Router();
const passport = require('passport');
const BoardController = require('../controllers/board.controller');

const authenticate = passport.authenticate('jwt', { session: false });

router.post('/', authenticate, BoardController.postBoard);
router.delete('/:id', authenticate, BoardController.deleteBoard);
module.exports = router;
