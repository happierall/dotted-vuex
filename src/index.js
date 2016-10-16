/*
    Dotted-Vuex
    - module - autoprefix modules with '/'
    - hack -   replace '/' with '.' in already initializing modules

    Example:


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

    Complete example in readme.md
*/

export const module = (object, moduleName) => {
  const {
    state,
    actions,
    mutations,
    getters,
    modules
  } = object
  var prefixedModule = Object.create(null)
  prefixedModule.state = state

  if (getters) {
    prefixedModule.getters = prefixObject(getters, moduleName)
  }
  if (actions) {
    prefixedModule.actions = prefixObject(actions, moduleName)
  }
  if (mutations) {
    prefixedModule.mutations = prefixObject(mutations, moduleName)
  }
  if (modules) {
    Object.keys(modules).forEach(key => {
      let nestedModules = Object.create(null)
      let nestedModuleName = `${moduleName}/${key}`
      nestedModules[nestedModuleName] = module(modules[key], nestedModuleName)

      prefixedModule.modules = nestedModules
    })
  }
  return prefixedModule
}

export const hack = (store) => {
  store._actions = fixPrefixObject(store._actions)
  store._mutations = fixPrefixObject(store._mutations)
  store._wrappedGetters = fixPrefixObject(store._wrappedGetters)
  store.getters = fixPrefixGetters(store.getters)
  return store
}

function prefixObject (object, prefix) {
  var newObject = Object.create(null)
  var keys = Object.keys(object)

  for (var i = 0; i < keys.length; i++) {
    let key = prefix + '/' + keys[i]
    var value = object[keys[i]]
    if (typeof value === 'function') {
      Object.defineProperty(value, 'name', { 'writable': true })
      value.name = key
    }
    newObject[key] = value
  }
  return newObject
}

function fixPrefixObject (object) {
  var newObject = Object.create(null)
  var keys = Object.keys(object)

  keys.forEach(key => {
    let newKey = key.split('/').join('.')
    var value = object[key]

    if (typeof value === 'function') {
      Object.defineProperty(value, 'name', { 'writable': true })
      value.name = newKey
    }
    newObject[newKey] = value
  })
  return newObject
}

function fixPrefixGetters (object) {
  var newObject = Object.create(null)
  var keys = Object.getOwnPropertyNames(object)

  keys.forEach(key => {
    let newKey = key.split('/').join('.')
    let getter = Object.getOwnPropertyDescriptor(object, key).get
    Object.defineProperty(newObject, newKey, { get: getter, enumerable: true, configurable: true })
  })
  return newObject
}
