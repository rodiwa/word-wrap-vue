<template>
  <div id="app">
      <header>
        <div class="left">
          <h3>Word Wrap 2019</h3>
        </div>
        <div class="right nav">
          <li class="links">Login</li>
          <li class="links">Sign Out</li>
        </div>
      </header>
      <section>
        <div class="words">
          
        </div>
        <form id="add-word-form" @submit.prevent="addWordToList" class="addWord none">
          <input type="text" id="addWordInput" placeholder="Add Word"/>
          <button type="reset" id="cancel" @click="cancelAddWord">Cancel</button>
        </form>
        <div class="controls">
          <button id="addWord" @click="addWord">Add</button>
          <button id="clearWords" @click="cancelAddWord">Clear</button>
        </div>
      </section>
  </div>
</template>

<script>
import firestore from './firebase/init'
export default {
  name: 'app',
  components: {

  },
  mounted: () => {
    // get data from firestore and setup initial view
    firestore.collection('words').onSnapshot(snapshot => {
      // set init words
    const words = [
      {
        word: 'HTML',
        size: 'medium'
      },
      {
        word: 'JavaScript',
        size: 'small'
      },
      {
        word: 'Node',
        size: 'large'
      },
      {
        word: 'React',
        size: 'small'
      },
      {
        word: 'Vue',
        size: 'medium'
      },
      {
        word: 'Angular',
        size: 'large'
      },
      {
        word: 'Firebase',
        size: 'medium'
      }
    ]
    let wordCanvas = document.querySelector('.words')
    let wordsHTML = ''

    if (snapshot.docs.length === 0) {
      return wordCanvas.innerHTML = '<span>No words have been added yet!</span>'
    }

    snapshot.docs.forEach(doc => {
      const { word, size } = doc.data()
      const wordHTML = `<span class="word ${size}">${word}</span>`
      wordsHTML += wordHTML
    })
    wordCanvas.innerHTML = wordsHTML

      // change word size on single click
      const addedWords = document.querySelectorAll('span.word')
      
      addedWords.forEach(word => {
        word.addEventListener('click', (w) => {
          console.log('change size of word')
        })
      })

      // delete word on dbl click
      addedWords.forEach(word => {
        word.addEventListener('dblclick', () => {
          console.log('delete this word')
        })
      })
    })

    // submit form handler
    const addWordForm = document.querySelector('#add-word-form')
    addWordForm.addEventListener('submit', (e) => console.log('add new word'))
  },
  methods: {
    addWord: () => {
      const wordInput = document.querySelector('.addWord')
      wordInput.classList.remove('none')
    },
    cancelAddWord: () => {
      const wordInput = document.querySelector('.addWord')
      const addWordInput = document.querySelector('#addWordInput')
      wordInput.classList.add('none')
      addWordInput.value = ''
    },
    addWordToList: () => {
      const addWordForm = document.querySelector('#add-word-form')
      const addWordInput = document.querySelector('#addWordInput')
      const newWord = addWordInput.value

      // clear input fields and hide form
      addWordForm.classList.add('none')
      addWordInput.value = ''

      firestore.collection('words').add({
        word: newWord,
        size: 'medium'
      })
      
    }
  }
}
</script>

<style>
@font-face {
  font-family: 'ps';
  font-style: 'normal';
  font-weight: 300;
  src: url('./assets/fonts/ps_regular.ttf')
}

@font-face {
  font-family: 'ps-bold';
  font-style: 'bold';
  font-weight: 700;
  src: url('./assets/fonts/ps_bold.ttf')
}

html, body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: 'ps', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 1em;
}

.none {
  display: none;
}

button {
  margin: 1em;
  padding: 0.5em 1em;
  background-color: navy;
  color: white;
  border-radius: 0.3em;
  border: none;
  font-family: 'ps', 'Avenir', Helvetica, Arial, sans-serif;  
  font-size: 1em;
  cursor: pointer;
}

input {
  margin: 1em;
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
  padding: 1em;
  background-color: lightgoldenrodyellow;
}

.right.nav {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.right.nav .links {
  list-style-type: none;
  padding: 1em;
}

section {
  padding: 1em;
}

/* styles for words */
.words > span {
  padding: 1em;
}

.words > span.small {
  font-size: 1em
}

.words > span.medium {
  font-size: 1.5em
}

.words > span.large {
  font-size: 2em
}
</style>
