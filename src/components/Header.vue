<template>
  <header id="app-header">
    <div class="left nav">
      <h3>{{ getHeader }}</h3>
    </div>
    <div class="right nav">
      <li v-if="!isUserLoggedIn" class="links">
        <router-link to='/' exact>
          <button class="icon"><fa-icon icon="home"></fa-icon></button>
        </router-link>
      </li>
      <li v-if="isUserLoggedIn" class="links">
        <router-link to='/' exact>
          <button class="icon"><router-link to='/words' exact><fa-icon icon="font"></fa-icon></router-link></button>
        </router-link>
      </li>
      <li v-if="isUserLoggedIn" class="links">
        <router-link to='/' exact>
          <button class="icon" :disabled="!isUserLoggedIn" v-if="isUserLoggedIn"><router-link to='/lists' exact><fa-icon icon="list"></fa-icon></router-link></button>
        </router-link>
      </li>
      <li v-if="!isUserLoggedIn" class="links">
        <router-link to='/login' exact>
          <button class="icon"><fa-icon icon="sign-in-alt"></fa-icon></button>
        </router-link>
      </li>
      <li v-if="isUserLoggedIn" class="links">
          <button class="icon" @click="signOutUser"><fa-icon icon="sign-out-alt"></fa-icon></button>
      </li>
    </div>
  </header>
</template>

<script>
import { store } from '../store'
import firebase from '../firebase/init'
import { updateLatestMetaToStore } from '../firebase/db'

export default {
  name: 'app-header',
  computed: {
    isUserLoggedIn: (context) =>
      context.$store.state.isUserLoggedIn,
    getHeader: (context) => {
      // TODO does not change router at times
      // const currentPath = context.$router.currentRoute.path
      // switch (currentPath) {
      //   case '/':
      //   case '/words':
      //     return `Word Wrap`
      //   case '/lists':
      //     return `Manage Lists`
      // }
      return 'Word Wrap'
    },
  },
  beforeMount: function() {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        this.$store.commit('toggleSignInMode', true)
        const { uid } = user
        await updateLatestMetaToStore({ uid })
        
        // remove 'none' class from all ul.links
        const links = document.querySelectorAll('li.links')
        links.forEach(link => link.classList.remove('none'))

        this.$router.push('/words')
      } else {
        // this.$router.push('/')
      }
    })
  },
  methods: {
    signOutUser: function() {
      const auth = firebase.auth()
      auth.signOut().then(() => {
        store.commit('resetState')
        this.$router.push('/login')
        console.log(this)
        console.log(this.$router)
        console.log(this.$router.push)
      })
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

