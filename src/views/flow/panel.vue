<template>
  <div v-if="easyFlowVisible">
    <el-row>
      <!--左侧可以拖动的菜单-->
      <el-col :span="3" ref="nodeMenu">
        <node-menu @addNode="addNode" @changeLabel="changeLabel" @dataReloadC="dataReloadC"></node-menu>
      </el-col>
      <el-col :span="21">
        <el-row>
          <!--画布-->
          <el-col :span="24">
            <div id="flowContainer" ref="flowContainer" class="container">
              <template v-for="(node, nodeIndex) in data.nodeList">
                <flow-node
                  :key="nodeIndex"
                  v-show="node.show"
                  :id="node.id"
                  :node="node"
                  :processData="processData"
                  @deleteNode="deleteNode"
                  @changeNodeSite="changeNodeSite"
                  @nodeRightMenu="nodeRightMenu"
                  @clickNode="clickNode"
                  @openNode="openNode"
                ></flow-node>
              </template>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import draggable from 'vuedraggable'
import { jsPlumb } from 'jsplumb'
import { easyFlowMixin } from '@/views/flow/mixins/easy_flow_mixin'
import flowNode from '@/views/flow/node'
import nodeMenu from '@/views/flow/node_menu'
import lodash from 'lodash'
import dataAll from './data'
export default {
  props: {
    ProcessConfigData: Object,
    NodeData: Array
  },
  data () {
    return {
      // jsPlumb 实例
      jsPlumb: null,
      // 控制画布销毁
      easyFlowVisible: true,
      // 控制流程数据显示与隐藏
      flowInfoVisible: false,
      // 是否加载完毕标志位
      loadEasyFlowFinish: false,
      // 数据
      data: {},
      processData: null,
      tempData: null // 存储初始化数据
    }
  },
  // 一些基础配置移动该文件中
  mixins: [easyFlowMixin],
  components: {
    // draggable,
    flowNode,
    nodeMenu
  },
  mounted () {
    this.jsPlumb = jsPlumb.getInstance()
  },
  watch: {
    NodeData () {
      if (this.NodeData.length > 0) {
        let obj = {
          name: this.ProcessConfigData.controlPointID, // 策略名称
          nodeList: [],
          lineList: []
        }
        this.NodeData.forEach((item, index) => {
          item.id = this.getUUID()
          item.type = 'node'
          item.left = '200px'
          item.top = 20 + index * 70 + 'px'
          item.ico = 'iconfont pl-jiedian'
          item.show = true
          obj.nodeList.push(item)
        })
        for (let i = 0; i < this.NodeData.length - 1; i++) {
          if (i < this.NodeData.length -1) {
            let line = {
              from: this.NodeData[i].id,
              to: this.NodeData[i + 1].id
            }
            obj.lineList.push(line)
          }
        }
        this.processData = obj
        this.tempData = obj
        console.log(obj)
        this.$nextTick(() => {
          // 加载流程数据、在这里可以根据具体的业务返回符合流程数据格式的数据即可
          // this.dataReload(dataAll.dataC)
          this.dataReload(this.processData)
        })
      } else {
        this.$nextTick(() => {
          // 加载流程数据、在这里可以根据具体的业务返回符合流程数据格式的数据即可
          let obj = {
            name: this.ProcessConfigData.controlPointID, // 策略名称
            nodeList: [],
            lineList: []
          }
          this.dataReload(obj)
        })
      }
    }
  },
  methods: {
    // 返回唯一标识
    getUUID () {
      return Math.random().toString(36).substr(3, 10)
    },
    jsPlumbInit () {
      this.jsPlumb.ready(() => {
        // 导入默认配置
        this.jsPlumb.importDefaults(this.jsplumbSetting)
        // 会使整个jsPlumb立即重绘。
        this.jsPlumb.setSuspendDrawing(false, true)
        // 初始化节点
        this.loadEasyFlow()
        // 单点击了连接线,
        this.jsPlumb.bind('click', (conn, originalEvent) => {
          this.$confirm('确定删除所点击的线吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.jsPlumb.deleteConnection(conn)
          }).catch(() => {
          })
        })
        // 连线
        this.jsPlumb.bind('connection', (evt) => {
          let from = evt.source.id
          let to = evt.target.id
          if (this.loadEasyFlowFinish) {
            this.data.lineList.push({ from: from, to: to })
          }
        })
        // 删除连线回调
        this.jsPlumb.bind('connectionDetached', (evt) => {
          this.deleteLine(evt.sourceId, evt.targetId)
        })
        // 改变线的连接节点
        this.jsPlumb.bind('connectionMoved', (evt) => {
          this.changeLine(evt.originalSourceId, evt.originalTargetId)
        })
        // 连线右击
        this.jsPlumb.bind('contextmenu', (evt) => {
          console.log('contextmenu', evt)
        })
        // 连线
        this.jsPlumb.bind('beforeDrop', (evt) => {
          let from = evt.sourceId
          let to = evt.targetId
          if (from === to) {
            this.$message.error('节点不支持连接自己')
            return false
          }
          if (this.hasLine(from, to)) {
            this.$message.error('该关系已存在,不允许重复创建')
            return false
          }
          if (this.hashOppositeLine(from, to)) {
            this.$message.error('不支持两个节点之间连线回环')
            return false
          }
          this.$message.success('连接成功')
          return true
        })
        // beforeDetach
        this.jsPlumb.bind('beforeDetach', (evt) => {
          console.log('beforeDetach', evt)
        })
      })
    },
    // 加载流程图
    loadEasyFlow () {
      // 初始化节点
      for (var i = 0; i < this.data.nodeList.length; i++) {
        let node = this.data.nodeList[i]
        // 设置源点，可以拖出线连接其他节点
        this.jsPlumb.makeSource(node.id, this.jsplumbSourceOptions)
        // // 设置目标点，其他源点拖出的线可以连接该节点
        this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions)
        this.jsPlumb.draggable(node.id, { containment: 'parent' })
      }
      // 初始化连线
      for (let i = 0; i < this.data.lineList.length; i++) {
        let line = this.data.lineList[i]
        this.jsPlumb.connect({ source: line.from, target: line.to }, this.jsplumbConnectOptions)
      }
      this.$nextTick(function () {
        this.loadEasyFlowFinish = true
      })
    },
    // 删除线
    deleteLine (from, to) {
      this.data.lineList = this.data.lineList.filter(function (line) {
        if (line.from === from && line.to === to) {
          return false
        }
        return true
      })
    },
    // 改变连线
    changeLine (oldFrom, oldTo) {
      this.deleteLine(oldFrom, oldTo)
    },
    // 改变节点的位置
    changeNodeSite (data) {
      for (var i = 0; i < this.data.nodeList.length; i++) {
        let node = this.data.nodeList[i]
        if (node.id === data.nodeId) {
          node.left = data.left
          node.top = data.top
        }
      }
    },
    /**
     * 拖拽结束后添加新的节点
     * @param evt
     * @param nodeMenu 被添加的节点对象
     * @param mousePosition 鼠标拖拽结束的坐标
     */
    addNode (evt, nodeMenu, mousePosition) {
      const width = this.$refs.nodeMenu.$el.clientWidth
      const nodeId = this.getUUID()
      let left = mousePosition.left
      let top = mousePosition.top
      if (left < 0) {
        left = evt.originalEvent.layerX - width + 50
      }
      if (top < 0) {
        top = evt.originalEvent.clientY - 150
      }
      const node = {
        id: nodeId,
        nodeName: '新审批节点',
        type: nodeMenu.type,
        left: left + 'px',
        top: top + 'px',
        ico: nodeMenu.ico,
        show: true
      }
      /**
       * 这里可以进行业务判断、是否能够添加该节点
       */
      this.data.nodeList.push(node)
      this.$nextTick(function () {
        this.jsPlumb.makeSource(nodeId, this.jsplumbSourceOptions)
        this.jsPlumb.makeTarget(nodeId, this.jsplumbTargetOptions)
        this.jsPlumb.draggable(nodeId, {
          containment: 'parent'
        })
      })
      this.addConfigNode() // 新增审批节点
    },
    // 新增审批节点
    addConfigNode () {
      let data = {
        processConfigID: this.ProcessConfigData.processConfigID, // 策略id
        nodeActivityID: null, // 活动Id
        nodeName: '新审批节点',
        nodeOrder: 1, // 节点排序
        nodeGroupType: 1, // 节点类型 1.单项节点 2.会签节点
        parentNodeID: 0, // 父节点Id
        precedingRuleExpression: null, // 前置表达式
        endRuleExpression: null // 后置表达式
      }
      this.axios_M4.post(`/node/ProcessApproval/`, data).then((res) => {
        console.log(res)
        if (res.data.code === 'success') {
          this.$message({
            type: 'success',
            message: res.data.msg
          })
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    /**
     * 删除节点
     * @param nodeEl.id 被删除节点的ID
     */
    deleteNode (nodeEl) {
      this.$confirm('确定要删除审批节点 "' + nodeEl.nodeName + '" ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        /**
         * 这里需要进行业务判断，是否可以删除
         */
        this.data.nodeList = this.data.nodeList.filter(function (node) {
          if (node.id === nodeEl.id) {
            // 伪删除，将节点隐藏，否则会导致位置错位
            node.show = false
          }
          return true
        })
        this.$nextTick(function () {
          this.jsPlumb.removeAllEndpoints(nodeEl.id)
        })
      }).catch(() => {
      })
      return true
    },
    // 删除策略节点
    deleteConfigNode () {
      this.axios_M4.delete(`/node/{nodeID}`)
        .then((res) => {
          console.log(res)
          if (res.data.code === 'success') {
            if (res.data.data === null) {
              this.$message({
                type: 'success',
                message: res.data.msg
              })
            } else {
              this.$message({
                type: 'error',
                message: res.data.data
              })
            }
          }
        })
    },
    openNode (nodeId) {
      this.$emit('openNode', this.data, nodeId)
    },
    clickNode (nodeId) {},
    // 是否具有该线
    hasLine (from, to) {
      for (var i = 0; i < this.data.lineList.length; i++) {
        var line = this.data.lineList[i]
        if (line.from === from && line.to === to) {
          return true
        }
      }
      return false
    },
    // 是否含有相反的线
    hashOppositeLine (from, to) {
      return this.hasLine(to, from)
    },
    nodeRightMenu (nodeId, evt) {
      this.menu.show = true
      this.menu.curNodeId = nodeId
      this.menu.left = evt.x + 'px'
      this.menu.top = evt.y + 'px'
    },
    // 加载流程图
    dataReload (data) {
      this.easyFlowVisible = false
      this.data.nodeList = []
      this.data.lineList = []
      this.$nextTick(() => {
        data = lodash.cloneDeep(data)
        this.easyFlowVisible = true
        this.data = data
        this.$nextTick(() => {
          this.jsPlumb = jsPlumb.getInstance()
          this.$nextTick(() => {
            this.jsPlumbInit()
          })
        })
      })
    },
    // 模拟载入数据dataC
    dataReloadC () {
      this.dataReload(this.tempData)
    },
    changeLabel () {
      let lines = this.jsPlumb.getConnections()
      lines.forEach(item => {
        item.setLabel({
          label: '',
          cssClass: 'labelClass'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#flowContainer {
  background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.04) 10%, rgba(0, 0, 0, 0) 10%), linear-gradient(rgba(0, 0, 0, 0.04) 10%, rgba(0, 0, 0, 0) 10%);
  background-size: 10px 10px;
  height: calc(100vh - 163.67px);
  background-color: rgb(251, 251, 251);
  position: relative;
}

::v-deep .labelClass {
  z-index: 999;
  background-color: white;
  padding: 5px;
  opacity: 0.7;
  border: 1px solid #346789;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.flow-tooltar {
  padding-left: 10px;
  box-sizing: border-box;
  border: 1px solid #e9e9e9;
  height: 42px;
  line-height: 42px;
  z-index: 3;
  -webkit-box-shadow: 0 8px 12px 0 rgba(0, 52, 107, .04);
  box-shadow: 0 8px 12px 0 rgba(0, 52, 107, .04);
}
</style>
