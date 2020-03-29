<template>
  <div class="dashboard-editor-container">
    <header>
      <el-button icon="el-icon-upload" type="success" size="mini">保存</el-button>
      <el-button icon="el-icon-document-checked" type="warning" size="mini">校验</el-button>
      <el-button icon="el-icon-setting" type="primary" size="mini" @click="processConfigDrawer = true">策略属性</el-button>
    </header>
    <main>
      <panel :ProcessConfigData="configDate" :NodeData="NodeData" @openNode="openNode"/>
    </main>
    <!-- 策略drawer-弹窗 -->
    <process-config-drawer
      @updateTree=""
      @showDialog="closeDialog"
      :activeConfigName="activeConfigName"
      :Info="Info"
      :ProcessConfigData="configDate"
      :processConfigDrawer="processConfigDrawer"
    />
    <!-- 策略drawer-弹窗 -->
    <el-drawer
      title="节点属性"
      :visible.sync="nodeDrawer"
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
          <div class="content-row"><span class="label">节点：</span><span class="text">{{ Node }}</span></div>
        </div>
      </el-card>
      <el-tabs class="drawer-content">
        <el-tab-pane label="基本信息">
          <basic-info/>
        </el-tab-pane>
        <el-tab-pane label="配置信息">
          <!--<config-info/>-->
        </el-tab-pane>
        <el-tab-pane label="通知">
          <notice/>
        </el-tab-pane>
        <el-tab-pane label="操作">
          <operating/>
        </el-tab-pane>
        <el-tab-pane label="参数">
          <parameter/>
        </el-tab-pane>
        <el-tab-pane label="显示设置">
          <show-info ref="nodeForm"/>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
  </div>
</template>

<script>
import Parameter from './components/Parameter'
import Operating from './components/Operating'
import BasicInfo from './components/BasicInfo'
import Notice from './components/Notice'
import ConfigInfo from './components/ConfigInfo'
import BasicInfoTactics from './components/BasicInfoTactics'
import ShowInfo from './components/ShowInfo'
import panel from '../flow/panel'
import ProcessConfigDrawer from '../ProcessManagement/components/ProcessConfigDrawer'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'process-design',
  components: {
    Parameter,
    Operating,
    BasicInfo,
    Notice,
    ConfigInfo,
    BasicInfoTactics,
    ShowInfo,
    panel,
    ProcessConfigDrawer
  },
  data () {
    return {
      processConfigDrawer: false, // 策略Drawer
      activeConfigName: '1', // 策略属性Tabs
      nodeDrawer: false,
      Node: '审批节点',
      NodeData: [] // 节点列表
    }
  },
  mounted () {
    this.getInfo()
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
        this.getInfo()
      }
    }
  },
  methods: {
    // 映射出 setConfigDate方法
    ...mapMutations('sysStore/processConfig', [
      'startStatus',
      'endStatus'
    ]),
    // 获取数据
    getInfo (type = 'ProcessApproval') {
      this.axios_M4.get(`/node/ByProcessConfig/${type}/${this.configDate.processConfigID}`)
        .then(res => {
          let data = res.data
          if (data.code === 'success') {
            this.NodeData = data.data
            console.log(this.NodeData)
          }
        })
    },
    // 关闭对话框
    closeDialog (name) {
      switch (name) {
        case 'ConfigDrawer':
          this.processConfigDrawer = false
          break
      }
    },
    // 打开节点属性
    openNode (data, nodeId) {
      this.nodeDrawer = true
      console.log(data)
      console.log(nodeId)
      this.$nextTick(() => {
        this.$refs.nodeForm.init(data, nodeId)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
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
