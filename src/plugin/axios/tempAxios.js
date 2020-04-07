'use strict'

import Vue from 'vue'
import axios from 'axios'

let configM1 = {
  baseURL: 'http://121.41.118.246:8001'
}
let configM2 = {
  baseURL: 'http://121.41.118.246:8002'
}
let configM3 = {
  baseURL: 'http://111.231.20.187:8003'
}

let configM4 = {
  baseURL: 'http://111.231.20.187:8004'
}

const _axios = axios.create(configM1)
const _axios2 = axios.create(configM2)
const _axios3 = axios.create(configM3)
const _axios4 = axios.create(configM4)

Plugin.install = function (Vue, options) {
  Object.defineProperties(Vue.prototype, {
    axios: {
      get () {
        return _axios
      }
    },
    axios_M2: {
      get () {
        return _axios2
      }
    },
    axios_M3: {
      get () {
        return _axios3
      }
    },
    axios_M4: {
      get () {
        return _axios4
      }
    }
  })
}

Vue.use(Plugin)

export default Plugin
