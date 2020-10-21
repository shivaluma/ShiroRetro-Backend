const router = require('express').Router();
const passport = require('passport');
const ListController = require('../controllers/list.controller');

const authenticate = passport.authenticate('jwt', { session: false });

router.get('/:id', authenticate, ListController.getList);
router.post('/', authenticate, ListController.postList);

module.exports = router;
