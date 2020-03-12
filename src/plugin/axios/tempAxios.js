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
  baseURL: 'http://121.41.118.246:8003'
}

const _axios = axios.create(configM1)
const _axios2 = axios.create(configM2)
const _axios3 = axios.create(configM3)

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
    }
  })
}

Vue.use(Plugin)

export default Plugin
