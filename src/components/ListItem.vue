<template>
  <div @click="gotoWordCanvas(details.id, details.name)" class="item" v-bind:id="details.id">
    <span>{{ details.name }}</span>
    <button @click.stop="deleteListItem(details.id)" class="icon red"><fa-icon icon="trash-alt"></fa-icon></button>
  </div>
</template>

<script>
import { updateMetaToCloudStore } from '../firebase/db'
import firebase from '../firebase/init'
import { store } from '../store';

const setListToDefault = () => {
  store.commit('setActiveListId', store.state.defaultListId)
  store.commit('setSelectedListName', '')
  store.commit('setIsDefaultList', true)
}

export default {
  name: 'list-item',
  props: ['details'],
  methods: {
    gotoWordCanvas: async function(uid, listName) {
      this.$store.commit('setSelectedListName', listName)
      this.$store.commit('setActiveListId', uid)
      
      updateMetaToCloudStore({ uid: store.state.userId })
      this.$router.push('/words')
    },
    deleteListItem: async function(uid) {
      // if current list is deleted list, then set default list as current item
      if (uid === store.state.activeListId) {
        setListToDefault()
      }
      const firestore = firebase.firestore()
      const { userId } = this.$store.state
      await firestore.collection(`users/${userId}/lists`).doc(uid).delete()

      // if there are no more lists available, then set default as current item
      if (store.state.listName !== '') {
        await firestore.collection(`users/${userId}/lists`).get().then(snapshot => {
          if (snapshot.docs.length < 2) {
            setListToDefault()
          }
        })
      }

      // update latest meta to cloud
      updateMetaToCloudStore({ uid: userId })

    }
  }
}
</script>

<style>
  div.item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: initial;
  }

  button.icon {
    padding: 0;
  }

  button.icon.red {
    color: red;
  }
</style>


