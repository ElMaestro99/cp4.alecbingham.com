<template>
<div class="admin">
  <div class="add">
    <div class="heading">
      <h1>Contribute a Meme!</h1>
    </div>
    <div class="form">
      <input v-model="title" placeholder="Title">
      <p></p>
      <input type="checkbox" id="tag1" name="tag1" value="Textpost">
      <label for="tag1">Textpost</label><br>
      <input type="checkbox" id="tag2" name="tag2" value="NSFW">
      <label for="tag2">Punny</label><br>
      <input type="checkbox" id="tag3" name="tag3" value="Starwars">
      <label for="tag3">Star Wars</label><br>
      <input type="checkbox" id="tag4" name="tag4" value="Other">
      <label for="tag4">Other</label><br>
      <p></p>
      <input type="file" name="photo" @change="fileChanged">
      <p></p>
      <button @click="upload">Upload</button>
    </div>
    <div class="upload" v-if="addMeme">
      <h2>{{addMeme.title}}</h2>
      <img :src="addMeme.path" />
    </div>
  </div>

<br><br>

  <div class="edit">
    <div class="heading">
      <h1>Edit/Delete</h1>
    </div>
    <div class="editBody">
      <div class="form">
        <input v-model="findTitle" placeholder="Search">
        <div class="suggestions" v-if="suggestions.length > 0">
          <div class="suggestion" v-for="s in suggestions" :key="s.id" @click="selectMeme(s)"> {{s.title}}
          </div>
        </div>
      </div>
      <div class="upload" v-if="findMeme">
        <input v-model="findMeme.title">
        <p></p>
        <img :src="findMeme.path" />
      </div>
      <div class="actions" v-if="findMeme">
        <button @click="deleteMeme(findMeme)">Delete</button>
        <button @click="editTitle(findMeme)">Edit</button>
      </div>
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
      findMeme: null,
      findTitle: "",
      tag1: false,
      tag2: false,
      tag3: false,
      tag4: false,
    }
  },
  computed: {
    suggestions() {
      let memes = this.memes.filter(meme => meme.title.toLowerCase().startsWith(this.findTitle.toLowerCase()));
      return memes.sort((a, b) => a.title > b.title);
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
        if (document.getElementById("tag1").checked === true) {this.tag1 = true;}
        if (document.getElementById("tag2").checked === true) {this.tag2 = true;}
        if (document.getElementById("tag3").checked === true) {this.tag3 = true;}
        if (document.getElementById("tag4").checked === true) {this.tag4 = true;}
        const formData = new FormData();
        formData.append('photo', this.file, this.file.name)
        let r1 = await axios.post('/api/photos', formData);
        let r2 = await axios.post('/api/memes', {
          title: this.title,
          path: r1.data.path,
          tag1: this.tag1,
          tag2: this.tag2,
          tag3: this.tag3,
          tag4: this.tag4,
        });
        this.addMeme = r2.data;
        this.tag1 = false;
        this.tag2 = false;
        this.tag3 = false;
        this.tag4 = false;
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
    selectMeme(s) {
      this.findTitle = "";
      this.findMeme = s;
    },
    async deleteMeme(s) {
      try {
        await axios.delete("/api/memes/" + s._id + "/comments");
        await axios.delete("/api/memes/" + s._id);
        this.findMeme = null;
        this.getMemes();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async editTitle(s) {
      try {
        await axios.put("/api/memes/" + s._id, {
          title: s.title,
        });
        this.findMeme = null;
        this.getMemes();
        return true;
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
  font-size: 1em;
}

.admin {
  display: flex;
  justify-content: center;
}

.heading {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  margin-top: 20px;
}

.heading h2 {
  margin-top: 8px;
  margin-left: 10px;
}

.add,
.edit {
  display: flex;
  flex-direction: column;
}

.editBody {
  display: flex;
  flex-direction: row;
}

.circle {
  border-radius: 50%;
  width: 18px;
  height: 18px;
  padding: 8px;
  background: #333;
  color: #fff;
  text-align: center
}

/* Form */
input,
textarea,
select,
button {
  font-family: 'Montserrat', sans-serif;
  font-size: 1em;
}

.form {
  margin-right: 50px;
}

/* Uploaded images */
.upload h2 {
  margin: 0px;
}

.upload img {
  max-width: 300px;
}

/* Suggestions */
.suggestions {
  width: 200px;
  border: 1px solid #ccc;
}

.suggestion {
  min-height: 20px;
}

.suggestion:hover {
  background-color: #5BDEFF;
  color: #fff;
}

</style>
