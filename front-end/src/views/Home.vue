<template>
<div class="home">
  <h1>Click on a meme to expand and view comments</h1>
  <div class="imgCommentContainer">
    <section class="image-gallery" v-if="commentsClosed">
      <div class="image" v-for="meme in memes" :key="meme.id">
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
      } catch (error) {
        console.log(error);
      }
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
  width: 82%;
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
