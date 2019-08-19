const express = require('express');
const multer = require('multer');

const router = express.Router();

const PostController = require('../controllers/post');
const checkAuth = require('../middleware/check-auth');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid Myme Type');
    if (isValid) {
      error = null;
    }
    cb(error, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(' ')
      .join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post('', checkAuth, multer({ storage: storage }).single('image'), PostController.createPost);

router.put('/:id', checkAuth, multer({ storage: storage }).single('image'), PostController.modifyPost);

router.delete('/:id', checkAuth, PostController.deletePost);

router.get('', PostController.getPosts);

router.get('/:id', PostController.getPost);

module.exports = router;
