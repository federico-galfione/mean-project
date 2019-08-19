const Post = require('../models/post');

exports.createPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });
  post
    .save()
    .then(result => {
      res.status(200).json({
        message: 'Post added successfully!',
        post: {
          id: result._id,
          title: result.title,
          content: result.content,
          imagePath: result.imagePath,
          creator: result.creator
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Creating a post failed!'
      });
    });
};

exports.modifyPost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: 'Updated successfull!' });
      } else {
        res.status(401).json({ message: 'Not authorized!' });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: "Couldn't update post!"
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: 'Deletion successfull!' });
      } else {
        res.status(401).json({ message: 'Not authorized!' });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: "Couldn't delete post!"
      });
    });
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count =>
      res.status(200).json({
        message: 'Posts fetched succesfully!',
        posts: fetchedPosts,
        maxPosts: count
      })
    )
    .catch(err => {
      res.status(500).json({
        message: 'Fetching posts failed!'
      });
    });
};

exports.getPost = (req, res, next) => {
  console.log(req);
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'Post not found!' });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: 'Fetching posts failed!'
      });
    });
};
