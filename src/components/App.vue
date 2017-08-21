<template>

  <div id="app" class="container">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary" v-show="this.$store.state.isLoggedIn">
      <label class="navbar-brand">Todo's</label>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup"
              aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          <router-link to="/lists" class="nav-item nav-link">My Todo's</router-link>
          <a class="nav-item nav-link" href="#">
            <small>Delete Account</small>
          </a>
          <a class="nav-item nav-link" href="#">
            <small>Logout</small>
          </a>
        </div>
      </div>
    </nav>

    <router-view></router-view>
  </div>
</template>


<script>

  export default {
    name: 'app',
  };
</script>


<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 20px;
  }
</style>
