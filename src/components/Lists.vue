<template>
  <section>
    <ul class="lists"></ul>
    <div id="no-lists-message" class="none">No lists added. Click 'Create List' to start adding one!</div>
    <form id="add-to-list-form" @submit.prevent="createNewList" class="addToList none">
      <input type="text" id="newListName" autocomplete="off" placeholder="Name Your List">
      <button type="reset" id="cancel" @click="hideAddToListForm">Cancel</button>
    </form>
    <div class="controls">
      <button class="icon" @click="showSaveToListForm"><fa-icon icon="folder-plus"></fa-icon></button>
      <button class="icon none"><fa-icon icon="trash-alt"></fa-icon></button>
    </div>
  </section>
</template>

<script>
import { store } from '../store'
import firebase from '../firebase/init'
import { remove } from 'lodash'
import { updateMetaToCloudStore } from '../firebase/db'

const getActiveListId = async ({ firestore, auth }) => {
  if (store.state.activeListId && store.state.activeListId !== '') {
    return store.state.activeListId
  }

  let activeListId = ''
  // TODO move this fn to separate util
  await firestore.collection(`users/${auth.currentUser.uid}/meta`).get().then(snapshot => {
    snapshot.docs.forEach(doc => {
      activeListId = doc.data().isActiveList
      let isUsingDefaultList = doc.data().isUsingDefaultList
      store.commit('setActiveListId', activeListId)
      store.commit('setIsDefaultList', isUsingDefaultList)
      // store.commit('setCurrentMetaId', doc.id)
    })
  })
  return activeListId
}

const renderListsToCanvas = (listsSnapshot) => {
  const ul = document.querySelector('ul.lists')
  listsSnapshot.forEach(listItem => {
    const li = document.createElement('li')
    li.setAttribute('id', listItem.id)
    li.classList.add('list-name')
    const div = document.createElement('div')

    const span = document.createElement('span')
    span.classList.add('list-title')
    span.textContent = listItem.name
    div.appendChild(span)
    li.appendChild(div)
    ul.appendChild(li)
  })
}

const renderNoListsMessageToCanvas = () => {
  const noListsMessage = document.getElementById('no-lists-message')
  noListsMessage.classList.remove('none')
}

export default {
  name: 'lists',
  beforeMount: async function() {
    const auth = firebase.auth()
    // if not logged in, goto home page
    auth.onAuthStateChanged(user => {
      if (!user) {
        this.$router.push('/')
      }
    })
  },
  mounted: function() {
    const auth = firebase.auth()
    const firestore = firebase.firestore()
    auth.onAuthStateChanged(user => {
      if (user) {
        firestore.collection(`users/${user.uid}/lists`).get()
          .then(snapshot => {
            // convert to array
            const listResponse = snapshot.docs.map(listItem => {
              return { ...listItem.data(), id: listItem.id }
            })
            // remove the 'default' list from response
            remove(listResponse, item => item.name === 'default')
            if (listResponse.length < 1) {
              renderNoListsMessageToCanvas()
            } else {
              renderListsToCanvas(listResponse)
            }
          })
        .then(() => {
          // add event listener
          const listNames = document.querySelectorAll('li.list-name')
          
          listNames.forEach(li => {
            li.addEventListener('click', async (e) => {
              const parentLiId = e.target.closest('li').id
              this.$store.commit('setSelectedListName', e.target.textContent)
              this.$store.commit('setActiveListId', parentLiId)
              
              const { uid } = user
              await updateMetaToCloudStore({ uid })
              
              this.$router.push('/words')
            })
          })
        })
      }
    })
  },
  methods: {
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
    createNewList: async function() {
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

        await firestore.collection(`users/${auth.currentUser.uid}/lists`).doc(newListId).collection('words').get().then(async snapshot => {
          snapshot.docs.forEach(async doc => {
            await firestore.collection(`users/${auth.currentUser.uid}/lists`).doc(newListId).collection('words').doc(doc.id).delete()
          })
        })

        // update store state
        store.commit('setIsDefaultList', false)
        // update list name to store
        store.commit('setSelectedListName', listName.trim())

        const { uid } = auth.currentUser
        await updateMetaToCloudStore({ uid })

        // reload component with current active list
        this.$router.push('/words')
      })

      // after all is done, hide add new list form
      this.hideSaveToListForm()
    }
  }
}

</script>

<style>
  ul.lists {
    padding-left: 0;
  }

  ul.lists > li {
    list-style: none;
    padding: 1em 0;
    cursor: pointer;
    border-bottom: 1px solid #ccc;
  }
</style>