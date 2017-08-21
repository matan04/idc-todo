<template>
  <div class="loginContainer">
    <h1 style="color: #76b852;text-align: center; margin: 20px auto;">Final Project By Matan & Yael</h1>
    <div class="form">

      <div class="register-form" v-show="isRegister">
        <input v-model="userName" type="text" data-role="username" placeholder="username"/>
        <input v-model="password" type="password" data-role="password" placeholder="password"/>
        <button id="register" v-on:click="register">Register</button>
        <p class="message">Already registered?
          <small v-on:click="toggleRegister">Sign In</small>
        </p>
      </div>

      <div class="login-form" v-show="!isRegister">
        <input v-model="userName" type="text" data-role="username" placeholder="username"/>
        <input v-model="password" type="password" data-role="password" placeholder="password"/>
        <button id="login" v-on:click="login">Login</button>
        <p class="message">Not registered?
          <small v-on:click="toggleRegister">Create an account</small>
        </p>
      </div>

    </div>

  </div>
</template>

<script>

  export default {
    data() {
      return {
        isRegister: false,
        userName: '',
        password: '',
      };
    },
    created() {
      this.$store.state.isLoggedIn = false;
    },
    methods: {
      toggleRegister() {
        this.isRegister = !this.isRegister;
      },
      register() {
        this.$store.state.getters.register(this.userName, this.password)
        .then(() => {
          this.toggleRegister();
        });
      },
      login() {
        this.$store.state.getters.login(this.userName, this.password)
        .then((res) => {
          if (res.status === 200) {
            this.$router.push({ name: 'lists' });
          } else {
            this.toggleRegister();
          }
        });
      },
    },
  };
</script>


<style>
  @import url(https://fonts.googleapis.com/css?family=Roboto:300);

  .form {
    position: relative;
    z-index: 1;
    background: #FFFFFF;
    max-width: 360px;
    margin: 0 auto 100px;
    padding: 45px;
    text-align: center;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
  }

  .form input {
    font-family: "Roboto", sans-serif;
    outline: 0;
    background: #f2f2f2;
    width: 100%;
    border: 0;
    margin: 0 0 15px;
    padding: 15px;
    box-sizing: border-box;
    font-size: 14px;
  }

  button {
    font-family: "Roboto", sans-serif;
    text-transform: uppercase;
    outline: 0;
    background: #4CAF50;
    width: 100%;
    border: 0;
    margin-top: 5px;
    padding: 15px;
    color: #FFFFFF;
    font-size: 14px;
    -webkit-transition: all 0.3 ease;
    transition: all 0.3 ease;
    cursor: pointer;
  }

  button:hover, button:active, button:focus {
    background: #43A047;
  }

  .form .message {
    margin: 15px 0 0;
    color: #b3b3b3;
    font-size: 12px;
  }

  .form .message a {
    color: #4CAF50;
    text-decoration: none;
  }

  .loginContainer {
    position: relative;
    z-index: 1;
    margin: 0 auto;
  }

  .loginContainer:before, .loginContainer:after {
    content: "";
    display: block;
    clear: both;
  }

  .loginContainer .info {
    margin: 50px auto;
    text-align: center;
  }

  .loginContainer .info h1 {
    margin: 0 0 15px;
    padding: 0;
    font-size: 36px;
    font-weight: 300;
    color: #1a1a1a;
  }

  .loginContainer .info span {
    color: #4d4d4d;
    font-size: 12px;
  }

  .loginContainer .info span a {
    color: #000000;
    text-decoration: none;
  }

  .loginContainer .info span .fa {
    color: #EF3B3A;
  }

  h1 {
    font-weight: 900;
    letter-spacing: 1px;
  }

</style>
