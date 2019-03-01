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
      <li v-if="!isUserLoggedIn" class="links none">
        <router-link to='/login' exact>
          <button>Login</button>
        </router-link>
      </li>
      <li v-if="isUserLoggedIn" class="links none">
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
  beforeMount: function() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.commit('toggleSignInMode', true)
        
        // remove 'none' class from all ul.links
        const links = document.querySelectorAll('li.links')
        links.forEach(link => link.classList.remove('none'))

        this.$router.push('/lists')
      } else {
        this.$router.push('/')
      }
    })
  },
  mounted: function() {
    this.$router.beforeEach((to, from, next) => {
      console.log(store.state)
      console.log(to)
      console.log(from)
      console.log(next)
      next()
    })
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

