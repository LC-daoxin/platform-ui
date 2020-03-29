let defaultConfigDate = {}
let defaultInfo = {}
try {
  if (localStorage.configDate) {
    defaultConfigDate = JSON.parse(localStorage.getItem('configDate'))
  }
  if (localStorage.Info) {
    defaultInfo = JSON.parse(localStorage.getItem('Info'))
  }
} catch (e) {}
export default {
  namespaced: true,
  state: {
    // 策略数据
    configDate: defaultConfigDate || {},
    Info: defaultInfo || {},
    refreshStatus: false
  },
  mutations: {
    startStatus (state, data) {
      state.refreshStatus = true
    },
    endStatus (state, data) {
      state.refreshStatus = false
    },
    setConfigDate (state, data) {
      state.configDate = data
      try {
        localStorage.setItem('configDate', JSON.stringify(data))
      } catch (e) {}
    },
    setInfo (state, data) {
      state.Info = data
      try {
        localStorage.setItem('Info', JSON.stringify(data))
      } catch (e) {}
    }
  }
}
