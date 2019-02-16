<template>
  <header id="app-header">
    <div class="left nav">
      <h3>Word Wrap</h3>
    </div>
    <div class="right nav">
      <li class="links">
        <router-link to='/' exact>
          <button>Home</button>
        </router-link>
      </li>
      <li v-if="!isUserLoggedIn" class="links">
        <router-link to='/login' exact>
          <button>Login</button>
        </router-link>
      </li>
      <li v-if="isUserLoggedIn" class="links">
          <button @click="signOutUser">Sign Out</button>
      </li>
    </div>
  </header>
</template>

<script>
import { store } from '../store'
import firebase from '../firebase/init'

export default {
  name: 'app-header',
  computed: {
    isUserLoggedIn: (context) =>
      context.$store.state.isUserLoggedIn
  },
  methods: {
    signOutUser: function() {
      const auth = firebase.auth()
      auth.signOut().then(() => {
        this.updateLoggedInStatus()
      })
    },
    updateLoggedInStatus() {
      this.$store.commit('toggleSignInMode')
    }
  }
}
</script>

<style scoped>
  header {
    display: flex;
    justify-content: space-between;
    box-shadow: #f2f2f2 5px 5px 5px;
    background-color: gold;
  }

  header h3 {
    cursor: default;
    font-weight: normal;
  }

  .left.nav {
    display: flex;
    align-items: center;
    padding: 0 0.5em;
  }

  .right.nav {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .right.nav .links {
    list-style-type: none;
    cursor: pointer;
  }
</style>

