<template>
<div class="home">
  <div class="explanation">Click on a meme to see/add comments</div>
  <section class="image-gallery">
    <div class="image" v-for="meme in memes" :key="meme.id">
      <h2>{{meme.title}}</h2>
      <img :src="meme.path" @click=selectMeme(meme) />
    </div>
  </section>
  <div class="Comments" v-if="selectedMeme">
    <div class="comments" v-for="comment in comments" :key="comment.id">
      <p>{{comment.text}} -{{comment.name}}</p>
    </div>
    <form @submit.prevent="addComment">
      <input type="text" v-model="text">
      <input type="text" v-model="name">
      <button type="submit">Post comment</button>
    </form>
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

/* Masonry */
*,
*:before,
*:after {
  box-sizing: inherit;
}

.image-gallery {
  column-gap: 1.5em;
}

.image {
  margin: 0 0 1.5em;
  display: inline-block;
  width: 100%;
}

.image img {
  width: 100%;
}

.commentButtons {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

/* Masonry on large screens */
@media only screen and (min-width: 1024px) {
  .image-gallery {
    column-count: 4;
  }
}

/* Masonry on medium-sized screens */
@media only screen and (max-width: 1023px) and (min-width: 768px) {
  .image-gallery {
    column-count: 3;
  }
}

/* Masonry on small screens */
@media only screen and (max-width: 767px) and (min-width: 540px) {
  .image-gallery {
    column-count: 2;
  }
}
</style>
