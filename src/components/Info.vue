<template>
  <section id="info">
    <div class="message">
      <h3>Get started</h3>
      <p>Use this simple tool to jot down thoughts at the top of your head so youc an revisit them later</p>
      <p>Login to be able to save you words, add them to lists, also sync across devices</p>
    </div>
    <div class="button">
      <button><router-link to="/login" exact>Goto Login</router-link></button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'info'
}
</script>

<style>
  section#info {
    justify-content: space-evenly;
  }
</style>


