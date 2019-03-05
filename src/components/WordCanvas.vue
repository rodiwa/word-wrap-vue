<template>
  <section id="wordCanvas">
    <div v-if="isUserLoggedIn">{{ this.getListName }}</div>
    <div v-if="!isUserLoggedIn" id="no-login-message"><span>Your chart will be reset once you leave this page! <b>Login</b> to save and use more features!</span></div>
    <div class="words" v-bind:class="{remove: isRemoveWordEnabled}"></div>
    <form id="add-word-form" @submit.prevent="addNewWord" class="addWord none">
      <input type="text" id="addWordInput" autocomplete="off" placeholder="Add Word">
      <button type="reset" id="cancel" @click="hideAddWordForm">Cancel</button>
    </form>
    <form id="add-to-list-form" @submit.prevent="saveToList" class="addToList none">
      <input type="text" id="newListName" autocomplete="off" placeholder="Name Your List">
      <button type="reset" id="cancel" @click="hideAddToListForm">Cancel</button>
    </form>
    <div class="controls">
      <button :disabled="!isUserLoggedIn" id="addWord" @click="showAddWordForm">Add</button>
      <button :disabled="!isUserLoggedIn" id="clearWords" @click="clearAllWords">Clear All</button>
      <button :disabled="!isUserLoggedIn" v-if="!isRemoveWordEnabled" id="removeWordsEnable" @click="removeWordsToggle">Remove Words</button>
      <button :disabled="!isUserLoggedIn" v-if="isRemoveWordEnabled" id="removeWordsDisable" @click="removeWordsToggle">Done Removing Words</button>
      <button :disabled="!isUserLoggedIn" v-if="isUserLoggedIn && isDefaultList" id="saveToList" @click="showSaveToListForm">Save To List</button>
      <button :disabled="!isUserLoggedIn" v-if="isUserLoggedIn"><router-link to='/lists' exact>Manage Lists</router-link></button>
    </div>
  </section>
</template>

<script>
import firebase from "../firebase/init";
import { getCurrentSize, getNextSize } from '../utils'
import { store } from '../store'
import Header from './Header.vue'
import { updateMetaToCloudStore, updateLatestMetaToStore } from '../firebase/db'

const getActiveListId = async ({ firestore, auth }) => {
  if (store.state.activeListId && store.state.activeListId !== '') {
    return store.state.activeListId
  }

  let activeListId = ''
  // TODO move this fn to separate util
  await firestore.collection(`users/${auth.currentUser.uid}/meta`).doc('meta').get().then(snapshot => {
    activeListId = snapshot.data().activeListId
    let isUsingDefaultList = snapshot.data().isDefaultList
    store.commit('setActiveListId', activeListId)
    store.commit('setIsDefaultList', isUsingDefaultList)
    // store.commit('setCurrentMetaId', 'meta')      
  })
  return activeListId
}

export default {
  name: "word-canvas",
  computed: {
    isRemoveWordEnabled: (context) =>
      context.$store.state.isRemoveModeEnabled,
    isUserLoggedIn: (context) =>
      context.$store.state.isUserLoggedIn,
    isDefaultList: (context) =>
      context.$store.getters.getIsDefaultList,
    isListNameSet: (context) =>
      context.$store.state.selectListName !== '',
    getListName: (context) =>
      context.$store.state.selectListName || 'Default List',
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
        // get words from cloudstore to show ons screen
        await firestore.collection(`users/${auth.currentUser.uid}/lists`).doc(activeListId).collection('words').onSnapshot(snapshot => {
          let words = snapshot.docs

          let wordCanvas = document.querySelector(".words");
          let wordsHTML = "";

          if (snapshot.docs.length === 0 && wordCanvas) {
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
          await firestore.collection("words").onSnapshot(snapshot => {
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
      // TODO probably not best place to update meta.
      // this clears the already saved data, such as defaultListId, etc
      // const { uid } = user
      // updateMetaToCloudStore({ uid })
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
        const { currentUser } = auth
        const activeListId = await getActiveListId({ firestore, auth })

        // if logged in, save to default
        // firestore.collection(`users/${auth.currentUser.uid}/default`).add({ word: newWord, size: 'medium' })
        await firestore.collection(`users/${auth.currentUser.uid}/lists`).doc(activeListId).collection('words').add({ word: newWord, size: 'medium' })
        updateMetaToCloudStore({ uid: auth.currentUser.uid })
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
    showSaveToListForm: () => {
      const addListName = document.getElementById('add-to-list-form')
      const controls = document.querySelector('.controls')
      const addListNameInput = document.getElementById('newListName')
      addListName.classList.remove('none')
      controls.classList.add('none')
      addListNameInput.focus()
    },
    hideSaveToListForm: () => {
      const addListName = document.getElementById('add-to-list-form')
      const controls = document.querySelector('.controls')
      addListName.classList.add('none')
      controls.classList.remove('none')
    },
    hideAddToListForm: () => {
      const addListName = document.getElementById('add-to-list-form')
      const controls = document.querySelector('.controls')
      controls.classList.remove('none')
      addListName.classList.add('none')
    },
    saveToList: async function() {
      const firestore = firebase.firestore()
      const auth = firebase.auth()

      const listName = document.getElementById('newListName').value
      if (listName.trim().length === 0) {
        return console.error('Enter a list name')
      }

      let newListId = ''
      const activeListId = await getActiveListId({ firestore, auth })
      let currentlyAddedWords = []

      // create new list and get its id
      await firestore.collection(`users/${auth.currentUser.uid}/lists`).doc().get().then(snapshot => {
        newListId = snapshot.id
      })

      // create new list with name added by user
      console.log('create new list')
      await firestore.collection(`users/${auth.currentUser.uid}/lists`).doc(activeListId).collection('words').get().then(async snapshot => {
        // add new list name to created list
        await firestore.collection(`users/${auth.currentUser.uid}/lists`).doc(newListId).set({ name: listName })

        // save currently added words to new list
        console.log('save words to new list')
        snapshot.docs.forEach(async doc => {
          await firestore.collection(`users/${auth.currentUser.uid}/lists`).doc(newListId).collection('words').add(doc.data())
        })

        // set current active list in store, firestore/user/meta
        console.log('update meta with new state')
        store.commit('setActiveListId', newListId)

        // delete words from default list
        console.log('delete words from default list')
        const defaultListId = store.state.defaultListId
        await firestore.collection(`users/${auth.currentUser.uid}/lists`).doc(defaultListId).collection('words').get().then(async snapshot => {
          snapshot.docs.forEach(async doc => {
            await firestore.collection(`users/${auth.currentUser.uid}/lists`).doc(defaultListId).collection('words').doc(doc.id).delete()
          })
        })

        // update store states
        store.commit('setIsDefaultList', false)
        store.commit('setSelectedListName', listName.trim())

        const { uid } = auth.currentUser
        await updateMetaToCloudStore({ uid })

        // reload component with current active list
        this.$router.go()
      })

      // after all is done, hide add new list form
      this.hideSaveToListForm()
    },
  }
};
</script>

<style>
.router-link-exact-active.router-link-active {
  display: none;
}

form#add-word-form, form#add-to-list-form {
  display: block;
}

button#removeWordsDisable {
  background-color: green;
}

button#removeWordsEnable {
  background-color: red;
}

button a {
  color: #ffffff;
  text-decoration: none;
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
/* list controls */
.list-controls {
  background-color: lightcoral;
  padding: 0.1em 0.5em;
  border-radius: 5px;
}
.list-names button {
  background-color: slategray;
}
.list-names button.active {
  background-color: black;
  color: #fff;
}
</style>
