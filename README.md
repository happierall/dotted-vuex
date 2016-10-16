# Dotted-Vuex
###Easy API for Vuex (Vue.js)
Without types, simple and fast to use (doted names and autoprefixed methods)


###Example:
```javascript
// Init module Todos
const todos = {
  state: {
    list: []
  },

  getters: {
    all: ( state ) {
      return state.list
    }
  }

  actions: {
    add ( { commit }, { todo }) {
      commit('todos.add', { todo })
    }
  },

  mutations: {
    add ( state, { todo } ) {
      state.push(todo)
    }
  }

}
```

```javascript
// Todo component
import { mapActions, mapGetters } from 'vuex'

export default {
    //...

    computed: {
      ...mapGetters({
        all: 'todos.all',
        firstUser: 'users.first'
      })
    },

    methods: {
      ...mapActions({
        add: 'todos.add',
      })
    },

    mounted() {
      this.add( { title: "simle", user: this.firstUser } )
      console.log( this.all )

      // and other things:
      this.$store.dispatch('users.delete', this.firstUser.id)
    }

}


```


### How install (dirty hack)
```bash
npm install --save dotted-vuex

```
```javascript
import {module, hack} from 'dotted-vuex'

import todos from './modules/todos'
import users from './modules/users'

Vue.use(Vuex)

var store = new Vuex.Store({
  modules: {
    todos: module(todos, 'todos'),
    users: module(users, 'users')
  },
  actions,
  getters
})

store = hack(store)

export default store
```
