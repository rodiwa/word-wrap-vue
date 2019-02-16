<template>
  <section id="login">
    <form id="loginForm" v-show="isLoginMode">
      <h3>Login To Continue</h3>
      <input name="email" autocomplete="off" autofocus type="text" placeholder="Email" />
      <input name="password" autocomplete="off" type="password" placeholder="Password" />
      <button type="submit">Login</button>
      <div class="errorMessage"><span ref="loginUserError" name="errorMessage" class="none"></span></div>
    </form>

    <form id="signUpForm" v-show="!isLoginMode">
      <h3>Sign Up New User</h3>
      <input name="email" autocomplete="off" autofocus type="text" placeholder="Enter Email" />
      <input name="password" autocomplete="off" type="password" placeholder="Enter Password" />
      <button type="submit">Sign Up</button>
      <div class="errorMessage"><span ref="signNewUserError" name="errorMessage" class="none"></span></div>
    </form>

    <div id="switchLoginMode" @click="changeLoginMode">
      <div v-show="isLoginMode"><button><span>Not registered yet? Sign Up!</span></button></div>
      <div v-show="!isLoginMode"><button><span>Already a user? Login!</span></button></div>
    </div>
  </section>
</template>

<script>
import firebase from '../firebase/init'

export default {
  name: 'login',
  data: function() {
    return {
      isLoginMode: true,
      signInMessage: 'asasdsad'
    }
  },
  mounted: function() {
    const auth = firebase.auth()
    const firestore = firebase.firestore()

    const loginForm = document.getElementById('loginForm')
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault()

      const email = loginForm.email.value
      const password = loginForm.password.value
      auth.signInWithEmailAndPassword(email, password).then(user => {
        console.log(user.additionalUserInfo.isNewUser)
        if (user.additionalUserInfo.isNewUser) {
          // setup default list in firestore with userId
          firestore.collection('user').doc('default').add().then(data => {
            console.log(data)
          })
        }
        // redirect to workspace
        this.redirectToWordsCanvas()
      }, (err) => {
        this.showLoginErrorMessage(err.message)
      })      
    })

    const signUpForm = document.getElementById('signUpForm')
    signUpForm.addEventListener('submit', (e) => {
      e.preventDefault()

      const email = signUpForm.email.value
      const password = signUpForm.password.value
      auth.createUserWithEmailAndPassword(email, password).then(user => {
        firestore.collection(`users/${user.user.uid}/default`).add({ word: 'Sample', size: 'medium'})
        // redirect to workspace        
        this.redirectToWordsCanvas()
      }, (err) => {
        this.showSignInNewUserErrorMessage(err.message)
      })
    })

    const inputs = document.querySelectorAll('input')
    inputs.forEach(input => {
      input.addEventListener('keypress', (e) => {
        this.clearErrorMessages()
      })
    })
  },
  methods: {
    showLoginErrorMessage: function(message) {
      const loginUserError = this.$refs.loginUserError
      loginUserError.classList.remove('none')
      loginUserError.textContent = message
    },
    showSignInNewUserErrorMessage: function(message) {
      const signNewUserError = this.$refs.signNewUserError
      signNewUserError.classList.remove('none')
      signNewUserError.textContent = message
    },
    changeLoginMode: function() {
      this.isLoginMode = !this.isLoginMode
    },
    clearErrorMessages: function() {
      this.$refs.loginUserError.classList.add('none')
      this.$refs.signNewUserError.classList.add('none')
    },
    redirectToWordsCanvas: function() {
      this.$store.commit('toggleSignInMode')
      this.$router.push('/')
    }
  }
}
</script>

<style scoped`>
  form {
    display: flex;
    flex-direction: column;
  }

  section#login {
    justify-content: center;
    width: 80%;
    max-width: 400px;
  }

  input {
    text-align: center;
  }

  div.errorMessage {
    color: red;
    margin: 1em 0;
  }
</style>

