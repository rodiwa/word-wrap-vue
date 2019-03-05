import firebase from '../init'
import { store } from '../../store'

// save meta to cloudstore
export const updateMetaToCloudStore = function({ uid }) {
  console.log(uid)
  console.log(arguments)
  const firestore = firebase.firestore()
  return new Promise((resolve, reject) => {
    
    // const metaId = store.state.currentMetaId
    const userId = store.state.userId
    console.log('1')
    console.log(userId)
    firestore.collection(`users/${uid}/meta`).doc('meta').set({
      ...store.state
    })
    .then(() => resolve({ msg: 'updated meta' }))
    .catch(err => reject({ error: true, msg: err.message }))
  })
}

// get latest meta from cloudstore and update to store
export const updateLatestMetaToStore = function({ uid }) {
  console.log('2')
  console.log({ uid })
  const firestore = firebase.firestore()
  return new Promise((resolve, reject) => {
    firestore.collection(`users/${uid}/meta`).doc('meta').get().then(snapshot => {
      const metaFromCloudStore = snapshot.data()
      console.log(metaFromCloudStore)
      store.commit('updateStoreFromMeta', metaFromCloudStore)
      resolve(metaFromCloudStore)
    })
  })
}
