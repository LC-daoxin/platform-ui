<template>
  <div class="dashboard-editor-container">
    <header>
      <!--<el-button icon="el-icon-upload" type="success" size="mini" @click="save">保存</el-button>-->
      <el-button icon="el-icon-document-checked" type="warning" size="mini">校验</el-button>
      <el-button icon="el-icon-setting" type="primary" size="mini" @click="openProcessConfigDrawer">策略属性</el-button>
    </header>
    <main>
      <panel
        :ProcessConfigData="configDate"
        @openNode="openNode"
        @updataNode="init"
        @NodeJson="saveJson"
        ref="panel"
      />
    </main>
    <!-- 策略drawer-弹窗 -->
    <process-config-drawer
      ref="processConfig"
      @showDialog="closeDialog"
      :activeConfigName="activeConfigName"
      :Info="Info"
      :ProcessConfigData="configDate"
      :processConfigDrawer="processConfigDrawer"
    />
    <!-- 策略drawer-弹窗 -->
    <!-- 节点drawer-弹窗 -->
    <el-drawer
      title="节点属性"
      :visible.sync="nodeDrawer"
      :before-close="closeDrawer"
      :modal="false"
      direction="rtl"
      :with-header="false"
      class="drawer"
      size="50%">
      <h1>节点属性</h1>
      <el-card class="box-card">
        <el-divider content-position="left">节点信息</el-divider>
        <div class="content">
          <div class="content-row"><span class="label">流程分类：</span><span class="text">{{ Info.processClass }}</span></div>
          <div class="content-row"><span class="label">流程名称：</span><span class="text">{{ Info.process }}</span></div>
          <div class="content-row"><span class="label">所属公司：</span><span class="text">{{ Info.CompanyCode }}</span></div>
          <div class="content-row"><span class="label">策略组：</span><span class="text">{{ Info.processBase }}</span></div>
          <div class="content-row"><span class="label">策略组描述：</span><span class="text">{{ Info.processBaseDes }}</span></div>
          <div class="content-row"><span class="label">策略：</span><span class="text">{{ Info.controlPointID }}</span></div>
          <div class="content-row"><span class="label">策略描述：</span><span class="text">{{ Info.controlPointDesc }}</span></div>
          <div class="content-row"><span class="label">节点：</span><span class="text">{{ nodeName }}</span></div>
        </div>
      </el-card>
      <el-tabs class="drawer-content" v-model="activeNodeName">
        <el-tab-pane label="基本信息" name="1">
          <NodeBasicInfo @updatePanel="init" ref="NodeBasicInfo"/>
        </el-tab-pane>
        <el-tab-pane label="配置信息" name="2">
          <config-info ref="config"/>
        </el-tab-pane>
        <el-tab-pane label="通知" name="3">
          <notice ref="notice" mailCategory="2"/>
        </el-tab-pane>
        <el-tab-pane label="操作" name="4">
          <operating ref="operating"/>
        </el-tab-pane>
        <el-tab-pane label="参数" name="5">
          <process-configuration ref="configuration" Type="node"/>
        </el-tab-pane>
        <el-tab-pane label="变量设置" name="6">
          <svc-config @updateSvc="updateSvc" ref="svcConfig"/>
        </el-tab-pane>
        <el-tab-pane label="显示设置" name="7">
          <show-info ref="nodeForm" @Reload="ReloadJSON"/>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
    <!-- 节点drawer-弹窗 -->
  </div>
</template>

<script>
import axios from 'axios'
import Operating from './components/Operating'
import SvcConfig from './components/SvcConfig'
import Notice from './components/Notice'
import ProcessConfiguration from './components/ProcessConfiguration'
import NodeBasicInfo from './components/NodeBasicInfo'
import ConfigInfo from './components/ConfigInfo'
import ShowInfo from './components/ShowInfo'
import panel from '../flow/panel'
import ProcessConfigDrawer from '../ProcessManagement/components/ProcessConfigDrawer'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'process-design',
  components: {
    Operating,
    SvcConfig,
    NodeBasicInfo,
    Notice,
    ConfigInfo,
    ShowInfo,
    panel,
    ProcessConfigDrawer,
    ProcessConfiguration
  },
  data () {
    return {
      processConfigDrawer: false, // 策略Drawer
      activeConfigName: '1', // 策略属性Tabs
      activeNodeName: '1',
      nodeDrawer: false,
      nodeName: '',
      NodeID: null,
      NodeData: [], // 节点数据
      NodeJson: null, // 节点JSON
      node: null,
      JSON: {} // 画布JSON
    }
  },
  mounted () {
    this.init()
    this.endStatus()
  },
  computed: {
    ...mapState('sysStore/processConfig', [
      'configDate',
      'Info',
      'refreshStatus'
    ])
  },
  watch: {
    refreshStatus (val) {
      if (val) {
        this.endStatus()
        this.init()
      }
    }
  },
  methods: {
    // 映射出 setConfigDate方法
    ...mapMutations('sysStore/processConfig', [
      'startStatus',
      'endStatus'
    ]),
    // 数据赋值 初始化
    init () {
      console.log('画布初始化')
      let me = this
      axios.all([me.getNode(), me.getNodeJSON()])
        .then(axios.spread(function (Node, NodeJSON) {
          if (Node.data.code === 'success') {
            me.NodeData = Node.data.data
          }
          if (NodeJSON.data.code === 'success') {
            try {
              me.NodeJson = JSON.parse(NodeJSON.data.data)
            } catch (err) {
              me.NodeJson = {}
            }
          }
          me.$nextTick(() => {
            me.$refs.panel.init(me.NodeData, me.NodeJson) // 画布init
          })
        }))
    },
    // 用获取node数据接口
    getNode () {
      return this.axios_M4.get(`/node/ByProcessConfig/ProcessApproval/${this.configDate.processConfigID}`)
    },
    // 用获取nodeJSON接口
    getNodeJSON () {
      return this.axios_M4.get(`/node/getNodeJsonByProcessConfig/${this.configDate.processConfigID}/`)
    },
    // 关闭对话框
    closeDialog (name) {
      switch (name) {
        case 'ConfigDrawer':
          this.processConfigDrawer = false
          break
      }
    },
    // 更新JSON
    ReloadJSON (node) {
      for (let i in this.NodeJson.nodeList) {
        if (this.NodeJson.nodeList[i].nodeId === node.nodeId) {
          this.NodeJson.nodeList[i] = node
          break
        }
      }
      this.$nextTick(() => {
        this.$refs.panel.init(this.NodeData, this.NodeJson) // 画布init
      })
    },
    // 保存JSON
    saveJson (data) {
      this.JSON = data
    },
    // 打开节点属性
    openNode (data, node) {
      this.nodeDrawer = true
      this.nodeName = node.nodeName
      this.activeNodeName = '1'
      console.log('节点data', data)
      console.log('节点node', node)
      this.node = node
      this.$nextTick(() => {
        this.$refs.nodeForm.init(node) // 显示设置
        this.$refs.configuration.init(node) // 参数
        this.$refs.NodeBasicInfo.init(node, this.JSON) // 基本信息
        this.$refs.config.init(node) // 配置信息
        this.$refs.operating.init(node) // 操作
        this.$refs.svcConfig.init(3, node) // 变量设置 服务类型 1: Process 2: ProcessBase 3.:Node 4: Email
        this.$refs.notice.init(node) // 通知 邮件配置
      })
    },
    // 关闭节点Drawer
    closeDrawer (done) {
      this.$refs.NodeBasicInfo.cancel()
      this.$refs.config.closeDestination()
      this.$refs.operating.closeMail()
      done()
    },
    // 打开策略Drawer
    openProcessConfigDrawer () {
      this.processConfigDrawer = true
      this.$nextTick(() => {
        this.$refs.processConfig.init()
      })
    },
    // 关联关系 -- 方法替换了，重新刷新节点字段
    updateSvc () {
      this.$nextTick(() => {
        this.$refs.config.getNodeString('all', 3, this.node.nodeId)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .el-drawer {
    overflow: auto;
  }
  ::v-deep .el-tabs--top {
    border-top: none !important;
  }
  ::v-deep .el-divider--horizontal {
    margin: 0 !important;
  }
  .dashboard-editor-container {
    header {
      margin-bottom: 10px;
    }
    main {
      // display: flex;
      width: 100%;
      height: calc(100vh - 163.67px);
    }
    .drawer {
      .box-card {
        width: 96%;
        margin: 10px auto 0;
        .content {
          margin-top: 16px;
          &-row {
            font-size: 14px;
            margin-bottom: 2px;
            .label {
              display: inline-block;
              width: 85px;
              text-align: right;
              margin-right: 10px;
            }
            .text {
              font-weight: 200;
            }
          }
        }
      }
      h1 {
        background: #f9f9f9;
        font-size: 18px;
        font-weight: 400;
        padding: 10px 20px;
        margin: 0;
      }
      .drawer-content {
        // margin-top: 20px;
        padding: 0 10px;
        border-top: 1px solid #cfd7e5;
      }
    }
  }
</style>
