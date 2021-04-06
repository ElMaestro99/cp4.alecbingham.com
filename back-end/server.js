const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));

// parse application/json
app.use(bodyParser.json());

// connect to the database
mongoose.connect('mongodb://localhost:27017/cp4', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create a scheme for memes
const memeSchema = new mongoose.Schema({
  title: String,
  path: String,
  tag1: Boolean,
  tag2: Boolean,
  tag3: Boolean,
  tag4: Boolean,
  tag5: Boolean,
  tag6: Boolean,
  tag7: Boolean,
});

// Create a model for memes
const Meme = mongoose.model('Meme', memeSchema);

// Configure multer so that it will upload to '../front-end/public/images'
const multer = require('multer')
const upload = multer({
  dest: '../front-end/public/images/',
  limits: {
    fileSize: 10000000
  }
});

// Upload a photo. Uses the multer middleware for the upload and then returns
// the path where the photo is stored in the file system.
app.post('/api/photos', upload.single('photo'), async (req, res) => {
  // Just a safety check
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "/images/" + req.file.filename
  });
});

// Create a meme
app.post('/api/memes', async (req, res) => {
  const meme = new Meme({
    title: req.body.title,
    path: req.body.path,
    tag1: req.body.tag1,
    tag2: req.body.tag2,
    tag3: req.body.tag3,
    tag4: req.body.tag4,
    tag5: req.body.tag5,
    tag6: req.body.tag6,
    tag7: req.body.tag7,
  });
  try {
    await meme.save();
    res.send(meme);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get a list of all memes
app.get('/api/memes', async (req, res) => {
  try {
    let memes = await Meme.find();
    res.send(memes);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Schema for comments
const commentSchema = new mongoose.Schema({
    meme: {
        type: mongoose.Schema.ObjectId,
        ref: 'Meme'
    },
    text: String,
    name: String,
});

// Model for comments
const Comment = mongoose.model('Comment', commentSchema);

app.post('/api/memes/:memeID/comments', async (req, res) => {
    try {
        let meme = await Meme.findOne({_id: req.params.memeID});
        if (!meme) {
            res.send(404);
            return;
        }
        let comment = new Comment({
            meme: meme,
            text: req.body.text,
            name: req.body.name,
        });
        await comment.save();
        res.send(comment);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/api/memes/:memeID/comments', async (req, res) => {
    try {
        let meme = await Meme.findOne({_id: req.params.memeID});
        if (!meme) {
            res.send(404);
            return;
        }
        let comments = await Comment.find({meme:meme});
        res.send(comments);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.delete('/api/memes/:id', async (req, res) => {
  try {
    await Meme.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/memes/:id/comments', async (req, res) => {
  try {
    let meme = await Meme.findOne({_id: req.params.id});
    if (!meme) {
        res.send(404);
        return;
    }
    await Comment.deleteMany({
      meme: meme
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/memes/:id', async (req, res) => {
  try {
      let meme = await Meme.findOne({_id: req.params.id});
      meme.title = req.body.title;
      meme.save();
      res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(8000, () => console.log('Server listening on port 8000!'));
