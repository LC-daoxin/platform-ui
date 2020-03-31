<template>
  <div v-if="easyFlowVisible">
    <el-row>
      <!--左侧可以拖动的菜单-->
      <el-col :span="3" ref="nodeMenu">
        <node-menu @addNode="addNode" @changeLabel="changeLabel" @dataReload="Reload" @show="show"></node-menu>
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
// import dataAll from './data'
export default {
  props: {
    ProcessConfigData: Object
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
      processData: null, // 策略下节点数据
      processDataJSON: null // 策略下节点JSON
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
  methods: {
    show () {
      console.log(this.data)
    },
    // 初始化画布
    init (Node, NodeJSON) {
      this.processData = Node
      this.processDataJSON = NodeJSON
      console.log(Node)
      console.log(NodeJSON)
      let obj = {
        name: Node.controlPointID, // 策略名称
        nodeList: [],
        lineList: []
      }
      if (Node.length > 0) { // 判断策略下是否有节点
        if (NodeJSON.nodeList && Node.length === NodeJSON.nodeList.length) { // 判断策略下节点数和画布JSON节点数是否一致
          NodeJSON.nodeList.forEach((item, index) => {
            item.createdBy = Node[index].createdBy
            item.createdOn = Node[index].createdOn
            item.deleteFlag = Node[index].deleteFlag
            item.endRuleExpression = Node[index].endRuleExpression
            item.nodeActivityID = Node[index].nodeActivityID
            item.nodeGroupType = Node[index].nodeGroupType
            item.nodeId = Node[index].nodeId
            item.nodeName = Node[index].nodeName
            item.nodeOrder = Node[index].nodeOrder
            item.parentNodeID = Node[index].parentNodeID
            item.precedingRuleExpression = Node[index].precedingRuleExpression
            item.processConfigID = Node[index].processConfigID
            item.updateBy = Node[index].updateBy
            item.updateOn = Node[index].updateOn
          })
          this.processDataJSON = NodeJSON
          this.dataReload(NodeJSON) // 按照画布JSON绘制
          this.saveJSON(NodeJSON)
        } else { // 如果不一致说明画布有问题需要初始化一下
          Node.forEach((item, index) => {
            item.id = this.getUUID()
            item.type = 'node'
            item.left = '200px'
            item.top = 20 + index * 70 + 'px'
            item.ico = 'iconfont pl-jiedian'
            item.show = true
            obj.nodeList.push(item)
          })
          for (let i = 0; i < Node.length - 1; i++) {
            if (i < Node.length - 1) {
              let line = {
                from: Node[i].id,
                to: Node[i + 1].id
              }
              obj.lineList.push(line)
            }
          }
          this.processDataJSON = obj // 初始化后的JSON
          this.$nextTick(() => {
            this.dataReload(this.processDataJSON) // 绘制画布
          })
        }
      } else { // 如果没有节点，就绘制空画布
        this.$nextTick(() => {
          this.dataReload(obj) // 绘制画布
          this.saveJSON() // 保存画布JSON
        })
      }
    },
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
            this.$nextTick(() => {
              this.saveJSON() // 保存JSON
            })
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
          this.$nextTick(() => {
            this.saveJSON() // 保存JSON
          })
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
          if (this.hasOtherLine(from, to)) {
            this.$message.error('不允许节点连多个节点')
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
          this.saveJSON()
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
        nodeName: '审批节点',
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
        this.addConfigNode() // 新增审批节点
      })
    },
    // 保存JSON
    saveJSON (data = this.data) {
      console.log(data)
      return this.axios_M4.put(`/node/putNodeJsonData/${this.ProcessConfigData.processConfigID}/`, data)
    },
    // 新增审批节点
    addConfigNode () {
      let data = {
        processConfigID: this.ProcessConfigData.processConfigID, // 策略id
        nodeActivityID: null, // 活动Id
        nodeName: '审批节点',
        nodeOrder: 1, // 节点排序
        nodeGroupType: 1, // 节点类型 1.单项节点 2.会签节点
        parentNodeID: 0, // 父节点Id
        precedingRuleExpression: null, // 前置表达式
        endRuleExpression: null // 后置表达式
      }
      this.axios_M4.post(`/node/ProcessApproval/`, data).then((res) => {
        if (res.data.code === 'success') {
          this.$message({
            type: 'success',
            message: '成功新增节点'
          })
          this.saveJSON().then(res => { // 保存节点JSON
            this.$emit('updataNode') // 刷新节点
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
      console.log(nodeEl)
      this.$confirm('确定要删除审批节点 "' + nodeEl.nodeName + '" ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        /**
         * 这里需要进行业务判断，是否可以删除
         */
        this.data.nodeList = this.data.nodeList.filter(function (node) {
          if (node.id === nodeEl.id) {
            return false
          } else {
            return true
          }
        })
        this.$nextTick(function () {
          this.jsPlumb.removeAllEndpoints(nodeEl.id)
          this.deleteConfigNode(nodeEl.nodeId) // 调用删除node接口
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
      return true
    },
    // 删除策略节点
    deleteConfigNode (nodeId) {
      this.axios_M4.delete(`/node/${nodeId}`)
        .then((res) => {
          console.log(res)
          if (res.data.code === 'success') {
            if (res.data.data === null) {
              this.$message({
                type: 'success',
                message: '已删除节点'
              })
              this.saveJSON().then(res => { // 保存节点JSON
                this.$emit('updataNode') // 刷新节点
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
    // 打开节点属性
    openNode (node) {
      this.$emit('openNode', this.data, node)
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
    // 是否一节点连多节点
    hasOtherLine (from, to) {
      for (var i = 0; i < this.data.lineList.length; i++) {
        var line = this.data.lineList[i]
        if (line.from === from) {
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
    // 重置载入数据data
    Reload () {
      this.dataReload(this.processDataJSON)
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
