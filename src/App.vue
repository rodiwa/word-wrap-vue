<template>
  <div id="app">
    <header>
      <div class="left">
        <h3>That Word Wrap Thingie</h3>
      </div>
      <div class="right nav">
        <li v-if="!isUserLoggedIn" class="links">Login</li>
        <li v-if="isUserLoggedIn" class="links">Sign Out</li>
      </div>
    </header>
    <section>
      <div class="words" v-bind:class="{remove: isRemoveWordEnabled}"></div>
      <form id="add-word-form" @submit.prevent="addNewWord" class="addWord none">
        <input type="text" id="addWordInput" autocomplete="off" placeholder="Add Word">
        <button type="reset" id="cancel" @click="hideAddWordForm">Cancel</button>
      </form>
      <div class="controls">
        <button id="addWord" @click="showAddWordForm">Add</button>
        <button id="clearWords" @click="clearAllWords">Clear All</button>
        <button v-if="!isRemoveWordEnabled" id="removeWordsEnable" @click="removeWordsToggle">Remove Words</button>
        <button v-if="isRemoveWordEnabled" id="removeWordsDisable" @click="removeWordsToggle">Done Removing Words</button>
      </div>
    </section>
  </div>
</template>

<script>
import firestore from "./firebase/init";
import { getCurrentSize, getNextSize } from './utils'
import { store } from './store'

export default {
  name: "app",
  components: {},
  computed: {
    isRemoveWordEnabled: (context) =>
      context.$store.state.isRemoveModeEnabled,
    isUserLoggedIn: (context) =>
      context.$store.state.isUserLoggedIn
  },
  mounted: () => {
    // get data from firestore and setup initial view
    firestore.collection("words").onSnapshot(snapshot => {
      let wordCanvas = document.querySelector(".words");
      let wordsHTML = "";

      if (snapshot.docs.length === 0) {
        return (wordCanvas.innerHTML =
          "<span>No words have been added yet!</span>");
      }

      snapshot.docs.forEach(doc => {
        const { word, size } = doc.data();
        const wordHTML = `<span id=${doc.id} class="word ${size}">${word}</span>`;
        wordsHTML += wordHTML;
      });
      wordCanvas.innerHTML = wordsHTML;

      // change word size on single click
      const addedWords = document.querySelectorAll("span.word");
      // const store = new Vuex.Store()

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

      // delete word on dbl click
      addedWords.forEach(word => {
        word.addEventListener("dblclick", () => {
          // console.log("delete this word");
        });
      });
    });
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
    addNewWord: () => {
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

      firestore.collection("words").add({
        word: newWord,
        size: "medium"
      });
    },
    clearAllWords: () => {
      firestore.collection('words').get().then(snaphot => {
        snaphot.docs.forEach(doc => {
          firestore.collection('words').doc(doc.id).delete()
        })
      })
    },
    removeWordsToggle: function () {
      this.$store.commit('toggleRemoveWordMode')
    }
  }
};
</script>

<style>
@font-face {
  font-family: "ps";
  font-style: "normal";
  font-weight: 300;
  src: url("./assets/fonts/ps_regular.ttf");
}

@font-face {
  font-family: "ps-bold";
  font-style: "bold";
  font-weight: 700;
  src: url("./assets/fonts/ps_bold.ttf");
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  user-select: none;
}

#app {
  font-family: "ps", "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 1em;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.none {
  display: none;
}

button {
  margin: 0.3em;
  padding: 0.5em 1em;
  background-color: navy;
  color: white;
  border-radius: 0.3em;
  border: none;
  font-family: "ps", "Avenir", Helvetica, Arial, sans-serif;
  font-size: 1em;
  cursor: pointer;
}

button#removeWordsDisable {
  background-color: green;
}

button#removeWordsEnable {
  background-color: red;
}

input {
  margin: 0.3em;
  padding: 0.5em 1em;
  font-size: 1em;
  border-radius: 0.3em;
  border: 1px solid #ccc;
}

/* header */
header {
  display: flex;
  justify-content: space-between;
  box-shadow: #f2f2f2 5px 5px 5px;
  padding: 0 1em;
  background-color: lightgoldenrodyellow;
}

header h3 {
  cursor: default;
  font-weight: normal;
}

.right.nav {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.right.nav .links {
  list-style-type: none;
  padding: 0 0.5em;
  cursor: pointer;
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
</style>
