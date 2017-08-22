<template>

  <div id="app" class="container">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary" v-show="isLoggedIn">
      <label class="navbar-brand">Todo's</label>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup"
              aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation" style="max-width: 55px;">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          <router-link to="/lists" class="nav-item nav-link">My Todo's</router-link>
          <div class="nav-item nav-link" v-on:click="deleteUser()">
            <small>Delete Account</small>
          </div>
          <div class="nav-item nav-link" v-on:click="logout()">
            <small>Logout</small>
          </div>
        </div>
      </div>
    </nav>

    <router-view></router-view>
  </div>
</template>


<script>

  export default {
    name: 'app',
    computed: {
      isLoggedIn () {
        return this.$store.state.isLoggedIn;
      }
    },
    methods: {
      deleteUser() {
        this.$store.state.getters.deleteAll();
      },
      logout() {
        this.$store.state.getters.logout();
      },
    },
    watch: {
      isLoggedIn (isLoggedIn) {
        if (!isLoggedIn) {
          this.$router.push({ path: '/' });
        }
      }
    },
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
  .nav-link {
    cursor: pointer;
  }
</style>
