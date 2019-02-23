<template>
  <section id="wordCanvas">
    <div v-if="!isUserLoggedIn" id="no-login-message"><span>Your chart will be reset once you leave this page! <b>Login</b> to save and use more features!</span></div>
    <div class="words" v-bind:class="{remove: isRemoveWordEnabled}"></div>
    <form id="add-word-form" @submit.prevent="addNewWord" class="addWord none">
      <input type="text" id="addWordInput" autocomplete="off" placeholder="Add Word">
      <button type="reset" id="cancel" @click="hideAddWordForm">Cancel</button>
    </form>
    <div class="controls">
      <button :disabled="!isUserLoggedIn" id="addWord" @click="showAddWordForm">Add</button>
      <button :disabled="!isUserLoggedIn" id="clearWords" @click="clearAllWords">Clear All</button>
      <button :disabled="!isUserLoggedIn" v-if="!isRemoveWordEnabled" id="removeWordsEnable" @click="removeWordsToggle">Remove Words</button>
      <button :disabled="!isUserLoggedIn" v-if="isRemoveWordEnabled" id="removeWordsDisable" @click="removeWordsToggle">Done Removing Words</button>
      <button :disabled="!isUserLoggedIn" v-if="isUserLoggedIn" id="saveToList" @click="saveToList">Save To List</button>
    </div>
  </section>
</template>

<script>
import firebase from "../firebase/init";
import { getCurrentSize, getNextSize } from '../utils'
import { store } from '../store'
import Header from './Header.vue'

const getActiveListId = async ({ firestore, auth }) => {
  if (store.state.activeListId && store.state.activeListId !== '') {
    return store.state.activeListId
  }

  let activeListId = ''
  // TODO move this fn to separate util
  await firestore.collection(`users/${auth.currentUser.uid}/meta`).get().then(snapshot => {
    snapshot.docs.forEach(doc => {
      activeListId = doc.data().isActiveList
      store.commit('setActiveListId', activeListId)
    })
  })
  return activeListId
}

export default {
  name: "word-canvas",
  computed: {
    isRemoveWordEnabled: (context) =>
      context.$store.state.isRemoveModeEnabled,
    isUserLoggedIn: (context) =>
      context.$store.state.isUserLoggedIn
  },
  mounted: function() {
    const self = this
    // get data from firestore and setup initial view
    const firestore = firebase.firestore()
    const auth = firebase.auth()

    // this will be reference to array of words (data) received from firestore
    let docs = []
    let activeListId = ''

    // TODO this code is causing issue in loggedInUser status.
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const activeListId = await getActiveListId({ firestore, auth })

        // TODO fix duplication of code
        firestore.collection(`users/${auth.currentUser.uid}/lists`).doc(activeListId).collection('words').onSnapshot(snapshot => {
          let words = snapshot.docs

          let wordCanvas = document.querySelector(".words");
          let wordsHTML = "";
    
          if (snapshot.docs.length === 0) {
            return (wordCanvas.innerHTML =
              "<span>No words have been added yet!</span>");
          }
    
          snapshot.docs.forEach(wordItem => {
            const { word, size } = wordItem.data()
            const id = wordItem.id
            const wordHTML = `<span id=${id} class="word ${size}">${word}</span>`;
            wordsHTML += wordHTML;
          });
          wordCanvas.innerHTML = wordsHTML;

          // change word size on single click
          const addedWords = document.querySelectorAll("span.word");
          addedWords.forEach(word => {
            word.addEventListener("click", function(w) {
              const id = w.target.id
              if (store.state.isRemoveModeEnabled) {
                // remove words from firebase
                firestore.collection(`users/${auth.currentUser.uid}/lists`).doc(activeListId).collection('words').doc(id).delete()
              } else {
                // change size of words only
                const currentSize = getCurrentSize(w.target.classList)
                const nextSize = getNextSize(currentSize)
                firestore.collection(`users/${auth.currentUser.uid}/lists`).doc(activeListId).collection('words').doc(id).update({ size: nextSize })
              }
            });
          });
        })
        store.commit('enableSignInMode')
      } else {
          firestore.collection("words").onSnapshot(snapshot => {
          docs = snapshot.docs

          let wordCanvas = document.querySelector(".words");
          let wordsHTML = "";

          if (docs.length === 0) {
            return (wordCanvas.innerHTML =
              "<span>No words have been added yet!</span>");
          }
    
          docs.forEach(doc => {
            const { word, size } = doc.data();
            const wordHTML = `<span id=${doc.id} class="word ${size}">${word}</span>`;
            wordsHTML += wordHTML;
          });
          wordCanvas.innerHTML = wordsHTML;
    
          // change word size on single click
          const addedWords = document.querySelectorAll("span.word");
          addedWords.forEach(word => {
            word.addEventListener("click", function(w) {
              const id = w.target.id
              if (store.state.isRemoveModeEnabled) {
                // remove words from firebase
                firestore.collection('words').doc(id).delete()
              } else {
                // change size of words only
                const currentSize = getCurrentSize(w.target.classList)
                const nextSize = getNextSize(currentSize)
                firestore.collection('words').doc(id).update({ size: nextSize })
              }
            });
          });
        });
        store.commit('clearSignInMode')
      }
    })
  },
  methods: {
    showAddWordForm: () => {
      const wordInput = document.querySelector("#add-word-form");
      const controls = document.querySelector('.controls')
      const addWordInput = document.getElementById('addWordInput')
      wordInput.classList.remove("none");
      addWordInput.focus()
      controls.classList.add('none')
    },
    hideAddWordForm: () => {
      const wordInput = document.querySelector("#add-word-form");
      const addWordInput = document.querySelector("#addWordInput");
      const controls = document.querySelector('.controls')
      const addWordButton = document.getElementById('addWord')
      wordInput.classList.add("none");
      addWordInput.value = "";
      controls.classList.remove('none')
      addWordButton.focus()
    },
    addNewWord: async () => {
      const firestore = firebase.firestore()
      const auth= firebase.auth()
      const addWordForm = document.querySelector("#add-word-form");
      const addWordInput = document.querySelector("#addWordInput");
      const controls = document.querySelector('.controls')
      const addWordButton = document.getElementById('addWord')
      const newWord = addWordInput.value;
      
      // clear input fields and hide form
      addWordForm.classList.add("none");
      addWordInput.value = "";
      controls.classList.remove('none')
      addWordButton.focus()

      if (auth.currentUser) {
        const activeListId = await getActiveListId({ firestore, auth })

        // if logged in, save to default
        // firestore.collection(`users/${auth.currentUser.uid}/default`).add({ word: newWord, size: 'medium' })
        firestore.collection(`users/${auth.currentUser.uid}/lists`).doc(activeListId).collection('words').add({ word: newWord, size: 'medium' })
      } else {
        // if user is not logged in, add to temporary store
        // TODO temp store will be deprecated. will save locally only and reset when user leaves page if user is not logged in
        firestore.collection("words").add({
          word: newWord,
          size: "medium"
        });
      }

    },
    clearAllWords: async () => {
      const firestore = firebase.firestore()
      const auth = firebase.auth()
      if (auth.currentUser) {
        const activeListId = await getActiveListId({ firestore, auth })

        firestore.collection(`users/${auth.currentUser.uid}/lists`).doc(activeListId).collection('words').get().then(snaphot => {
          snaphot.docs.forEach(doc => {
            firestore.collection(`users/${auth.currentUser.uid}/lists`).doc(activeListId).collection('words').doc(doc.id).delete()
          })
        })
      } else {
        // TODO handle clear for anonymous users
      }
      
    },
    removeWordsToggle: function () {
      this.$store.commit('toggleRemoveWordMode')
    },
    saveToList: () => {
      console.log('saveToList')
      // if no list name found, then prompt for one [modal]
        // else, use list name (docId) and proceed to save
      // use set to update entire list to collection; set will override existing
    }
  }
};
</script>

<style>
.router-link-exact-active.router-link-active {
  display: none;
}

form#add-word-form {
  display: block;
}

button#removeWordsDisable {
  background-color: green;
}

button#removeWordsEnable {
  background-color: red;
}

button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

input {
  margin: 0.3em;
  padding: 0.5em 1em;
  font-size: 1em;
  border-radius: 0.3em;
  border: 1px solid #ccc;
}

section {
  padding: 1em;
  max-width: 1024px;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

section .words {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin: 5em 0;
  height: 100%;
  align-items: center;
  align-content: center;
}

/* styles for words */
.words > span {
  padding: 0 0.2em;
  cursor: pointer;
  display: flex;
  align-items: center;
  height: fit-content;
}

.words.remove {
  color: red
}

.words > span.small {
  font-size: 1em;
}

.words > span.medium {
  font-size: 1.5em;
}

.words > span.large {
  font-size: 2em;
  font-weight: bold;
}

#no-login-message {
  color: #ccc;
}
</style>
