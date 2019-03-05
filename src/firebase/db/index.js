import firebase from '../init'
import { store } from '../../store'

// save meta to cloudstore
export const updateMetaToCloudStore = function({ uid }) {
  const firestore = firebase.firestore()
  return new Promise((resolve, reject) => {    
    firestore.collection(`users/${uid}/meta`).doc('meta').set({
      ...store.state
    })
    .then(() => resolve({ msg: 'updated meta' }))
    .catch(err => reject({ error: true, msg: err.message }))
  })
}

// get latest meta from cloudstore and update to store
export const updateLatestMetaToStore = function({ uid }) {
  const firestore = firebase.firestore()
  return new Promise((resolve, reject) => {
    firestore.collection(`users/${uid}/meta`).doc('meta').get().then(snapshot => {
      const metaFromCloudStore = snapshot.data()
      store.commit('updateStoreFromMeta', metaFromCloudStore)
      resolve(metaFromCloudStore)
    })
  })
}
