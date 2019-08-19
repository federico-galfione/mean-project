const express = require('express');

const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const PostController = require('../controllers/post');

router.post('', checkAuth, extractFile, PostController.createPost);

router.put('/:id', checkAuth, extractFile, PostController.modifyPost);

router.delete('/:id', checkAuth, PostController.deletePost);

router.get('', PostController.getPosts);

router.get('/:id', PostController.getPost);

module.exports = router;
