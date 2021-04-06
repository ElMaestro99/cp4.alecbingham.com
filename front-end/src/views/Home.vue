<template>
<div class="home">
  <h1 class="explanation">Click on a meme to expand and view comments, or filter by tag:</h1>
  <br>
  <div class="tagContainer">
    <button class="tagButtons" @click="filter(0)">All</button>
    <button class="tagButtons" @click="filter(1)">Textposts</button>
    <button class="tagButtons" @click="filter(2)">Punny</button>
    <button class="tagButtons" @click="filter(3)">Star Wars</button>
    <button class="tagButtons" @click="filter(4)">Current Events</button>
    <button class="tagButtons" @click="filter(5)">Classics</button>
    <button class="tagButtons" @click="filter(6)">Wholesome</button>
    <button class="tagButtons" @click="filter(7)">Other</button>
  </div>
  <div class="imgCommentContainer">
    <section class="image-gallery" v-if="commentsClosed">
      <div class="image" v-for="meme in filteredMemes" :key="meme.id">
        <h2>{{meme.title}}</h2>
        <img :src="meme.path" @click=selectMeme(meme) />
      </div>
    </section>
    <div class="focus" v-else>
      <h2>{{selectedMeme.title}}</h2>
      <img class="focusImg" :src="selectedMeme.path">
    </div>
    <div class="commentContainer" v-if="selectedMeme">
      <h2>Comments:</h2>
      <p></p>
      <div class="comments" v-for="comment in comments" :key="comment.id">
        <p>{{comment.text}} <br> -<em>{{comment.name}}</em></p>
      </div>
      <form @submit.prevent="addComment">
        <input class="commentHere" type="text" v-model="text" placeholder="Comment">
        <input type="text" v-model="name" placeholder="Name">
        <button type="submit">Post comment</button>
      </form>
      <button @click=deselectMeme()>Collapse comments</button>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Home',
  data() {
    return {
      memes: [],
      filteredMemes: [],
      selectedMeme: null,
      comments: [],
      commentsClosed: true,
      text: '',
      name: '',
    }
  },
  created() {
    this.getMemes();
  },
  methods: {
    async getMemes() {
      try {
        let response = await axios.get("/api/memes");
        this.memes = response.data;
        this.filteredMemes = this.memes;
      } catch (error) {
        console.log(error);
      }
    },
    filter(index) {
      if (index === 0) {this.filteredMemes = this.memes;}
      if (index === 1) {this.filteredMemes = this.memes.filter(meme => meme.tag1 === true);}
      if (index === 2) {this.filteredMemes = this.memes.filter(meme => meme.tag2 === true);}
      if (index === 3) {this.filteredMemes = this.memes.filter(meme => meme.tag3 === true);}
      if (index === 4) {this.filteredMemes = this.memes.filter(meme => meme.tag4 === true);}
      if (index === 5) {this.filteredMemes = this.memes.filter(meme => meme.tag5 === true);}
      if (index === 6) {this.filteredMemes = this.memes.filter(meme => meme.tag6 === true);}
      if (index === 7) {this.filteredMemes = this.memes.filter(meme => meme.tag7 === true);}
    },
    selectMeme(meme) {
      this.selectedMeme = meme;
      this.commentsClosed = false;
      this.getComments();
    },
    deselectMeme() {
      this.selectedMeme = null;
      this.commentsClosed = true;
      this.getComments();
    },
    async getComments() {
      try {
        const response = await axios.get('/api/memes/' + this.selectedMeme._id + '/comments');
        this.comments = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async addComment() {
      try {
        await axios.post('/api/memes/' + this.selectedMeme._id + '/comments', {
          text: this.text,
          name: this.name,
        });
        this.text = "";
        this.getComments();
      } catch (error) {
        console.log(error);
      }
    },
  }
}
</script>

<style scoped>
.image h2 {
  font-style: italic;
}

.explanation {
  text-align: center;
}

.tagContainer {
  display: flex;
  justify-content: center;
}

.tagButtons {
  margin-left: 1.5em;
  margin-bottom: 1.5em;
}

.focus {
  width: 80%;
}

.focusImg {
  width: 100%;
}

.imgCommentContainer {
  display: flex;
  flex-direction: row;
}

.commentHere {
  width: 100%;
}

/* Masonry */
*,
*:before,
*:after {
  box-sizing: inherit;
}

.image-gallery {
  column-gap: 1.5em;
  width: 100%;
}

.image {
  margin: 0 0 1.5em;
  display: inline-block;
  width: 100%;
}

.image img {
  width: 100%;
}

.commentContainer {
  margin-left: 1.5em;
  width: 20%;
}

.comments {
  width: match-parent;
}

/* Masonry on medium-sized screens */
@media only screen and (min-width: 901px) {
  .image-gallery {
    column-count: 2;
  }
}

/* Masonry on small screens */
@media only screen and (max-width: 900px) and (min-width: 540px) {
  .image-gallery {
    column-count: 1;
  }

  .commentContainer {
    width: 30%;
  }
}

@media only screen and (max-width: 620px) {
  .commentContainer {
    width: 40%;
  }
}
</style>
