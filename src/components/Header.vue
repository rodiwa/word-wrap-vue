<template>
  <header id="app-header">
    <div class="left nav">
      <h3>Word Wrap</h3>
    </div>
    <div class="right nav">
      <li v-if="!isUserLoggedIn" class="links">
        <router-link to='/login' exact>
          <button>Login</button>
        </router-link>
      </li>
      <li class="links">
        <router-link to='/' exact>
          <button>Home</button>
        </router-link>
      </li>
      <li v-if="isUserLoggedIn" class="links">
        <router-link>
          <button>Sign Out</button>
        </router-link>
      </li>
    </div>
  </header>
</template>

<script>
import { store } from '../store'

export default {
  name: 'app-header',
  computed: {
    isUserLoggedIn: (context) =>
      context.$store.state.isUserLoggedIn
  }
}
</script>

<style scoped>
  header {
    display: flex;
    justify-content: space-between;
    box-shadow: #f2f2f2 5px 5px 5px;
    background-color: lightgoldenrodyellow;
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

