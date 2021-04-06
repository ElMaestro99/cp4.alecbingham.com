<template>
<div id="app">

  <div class="header">
    <router-link to="/">
      <div class="title">
        <h1>Memes R Us</h1>
      </div>
    </router-link>
  </div>

  <div class="content">
    <router-view />
  </div>
  <div class="footer">
    <router-link to="/admin">Admin</router-link>
    <a id="gitLink" href="https://github.com/ElMaestro99/cp4.alecbingham.com.git">GitHub</a>
  </div>

</div>
</template>

<style>
html {
  box-sizing: border-box;
}

body {
  font-family: 'Montserrat', sans-serif;
  font-size: 16px;
  background: #fff;
  padding: 0px;
  margin: 0px;
}

/* Header */
.header {
  display: flex;
  justify-content: center;
  padding: 10px 100px 0px 100px;
  background-color: #4D85A8;
  color: #E9fff9;
}

body {
  background-color: #B4DEF8;
}

.header a {
  color: #850A21;
  text-decoration: none;
}

.title {
  margin-top: 5px;
}

.title h1 {
  font-size: 30px;
}

.content {
  padding: 20px 20px;
  min-height: 500px;
}

/* Footer */
.footer {
  display: flex;
  justify-content: space-around;
  height: 50px;
  padding: 20px 100px 0px 100px;
  background-color: #4D85A8;
  font-size: 12px;
}

.footer a {
  color: #000;
}

h1 {
  font-size: 20px;
}

h2 {
  font-size: 14px;
}
</style>
