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
  path: String
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

app.listen(3000, () => console.log('Server listening on port 3000!'));
