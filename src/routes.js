import Login from './components/Login'
import WordCanvas from './components/WordCanvas'
import Lists from './components/Lists'
import Info from './components/Info'

export const routes =  [
  { path: '/', component: Info },
  { path: '/words', component: WordCanvas },
  { path: '/login', component: Login },
  { path: '/lists', component: Lists }
]
