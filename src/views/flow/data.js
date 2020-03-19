let dataA = {
  name: '流程A',
  nodeList: [
    {
      id: 'nodeA',
      name: '流程A-节点A',
      type: 'task',
      left: '26px',
      top: '161px',
      ico: 'el-icon-user-solid',
      show: true
    },
    {
      id: 'nodeB',
      name: '流程A-节点B',
      type: 'task',
      left: '340px',
      top: '161px',
      ico: 'el-icon-goods',
      show: true
    },
    {
      id: 'nodeC',
      name: '流程A-节点C',
      type: 'task',
      left: '739px',
      top: '161px',
      ico: 'el-icon-present',
      show: true
    }
  ],
  lineList: [{
    from: 'nodeA',
    to: 'nodeB'
  }, {
    from: 'nodeB',
    to: 'nodeC'
  }]
}
let dataB = {
  name: '流程B',
  nodeList: [
    {
      id: 'nodeA',
      name: '流程B-节点A',
      type: 'task',
      left: '18px',
      top: '223px',
      ico: 'el-icon-user-solid',
      show: true
    },
    {
      id: 'nodeB',
      type: 'task',
      name: '流程B-节点B',
      left: '351px',
      top: '96px',
      ico: 'el-icon-goods',
      show: true
    },
    {
      id: 'nodeC',
      name: '流程B-节点C',
      type: 'task',
      left: '354px',
      top: '351px',
      ico: 'el-icon-present',
      show: true
    }, {
      id: 'nodeD',
      name: '流程B-节点D',
      type: 'task',
      left: '773px',
      top: '215px',
      ico: 'el-icon-present',
      show: true
    }
  ],
  lineList: [{
    from: 'nodeA',
    to: 'nodeB'
  }, {
    from: 'nodeA',
    to: 'nodeC'
  }, {
    from: 'nodeB',
    to: 'nodeD'
  }, {
    from: 'nodeC',
    to: 'nodeD'
  }]
}
let dataC = {
  name: '流程C',
  nodeList: [
    {
      id: 'Start',
      name: '流程开始',
      type: 'start',
      left: '200px',
      top: '20px',
      ico: 'iconfont pl-kaishi',
      show: true
    },
    {
      id: 'nodeA',
      name: '审批节点A',
      type: 'node',
      left: '200px',
      top: '80px',
      ico: 'iconfont pl-jiedian',
      show: true
    },
    {
      id: 'nodeB',
      name: '审批节点B',
      type: 'node',
      left: '200px',
      top: '140px',
      ico: 'iconfont pl-jiedian',
      show: true
    },
    {
      id: 'nodeC',
      name: '审批节点C',
      type: 'node',
      left: '200px',
      top: '200px',
      ico: 'iconfont pl-jiedian',
      show: true
    },
    {
      id: 'nodeD',
      name: '审批节点D',
      type: 'node',
      left: '200px',
      top: '260px',
      ico: 'iconfont pl-jiedian',
      show: true
    },
    {
      id: 'nodeE',
      name: '审批节点E',
      type: 'node',
      left: '200px',
      top: '320px',
      ico: 'iconfont pl-jiedian',
      show: true
    },
    {
      id: 'End',
      name: '流程结束',
      type: 'end',
      left: '200px',
      top: '380px',
      ico: 'iconfont pl-jieshu',
      show: true
    }
  ],
  lineList: [
    {
      from: 'Start',
      to: 'nodeA'
    }, {
      from: 'nodeA',
      to: 'nodeB'
    }, {
      from: 'nodeB',
      to: 'nodeC'
    }, {
      from: 'nodeC',
      to: 'nodeD'
    }, {
      from: 'nodeD',
      to: 'nodeE'
    }, {
      from: 'nodeE',
      to: 'End'
    }
  ]
}
let dataAll = { dataA, dataB, dataC }

export default dataAll
