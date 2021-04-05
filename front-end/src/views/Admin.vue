<template>
<div class="admin">
  <div class="heading">
    <h1>Contribute a Meme!</h1>
  </div>
  <div class="add">
    <div class="form">
      <input v-model="title" placeholder="Title">
      <p></p>
      <input type="file" name="photo" @change="fileChanged">
      <button @click="upload">Upload</button>
    </div>
    <div class="upload" v-if="addMeme">
      <h2>{{addMeme.title}}</h2>
      <img :src="addMeme.path" />
    </div>
  </div>

</div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Admin',
  data() {
    return {
      title: "",
      file: null,
      addMeme: null,
      memes: [],
    }
  },
  created() {
    this.getMemes();
  },
  methods: {
    fileChanged(event) {
      this.file = event.target.files[0]
    },
    async upload() {
      try {
        const formData = new FormData();
        formData.append('photo', this.file, this.file.name)
        let r1 = await axios.post('/api/photos', formData);
        let r2 = await axios.post('/api/memes', {
          title: this.title,
          path: r1.data.path
        });
        this.addMeme = r2.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getMemes() {
      try {
        let response = await axios.get("/api/memes");
        this.memes = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
  }
}
</script>
