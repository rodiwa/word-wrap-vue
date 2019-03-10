<template>
  <div @click="gotoWordCanvas(details.id, details.name)" class="item" v-bind:id="details.id">
    <span>{{ details.name }}</span>
    <button @click.stop="deleteListItem(details.id)" class="icon red"><fa-icon icon="trash-alt"></fa-icon></button>
  </div>
</template>

<script>
import { updateMetaToCloudStore } from '../firebase/db'
import firebase from '../firebase/init'

export default {
  name: 'list-item',
  props: ['details'],
  methods: {
    gotoWordCanvas: async function(uid, listName) {
      this.$store.commit('setSelectedListName', listName)
      this.$store.commit('setActiveListId', uid)
      
      await updateMetaToCloudStore({ uid })
      this.$router.push('/words')
    },
    deleteListItem: async function(uid) {
      console.log(uid)
      const firestore = firebase.firestore()
      const { userId } = this.$store.state
      console.log(userId)
      await firestore.collection(`users/${userId}/lists`).doc(uid).delete()
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


