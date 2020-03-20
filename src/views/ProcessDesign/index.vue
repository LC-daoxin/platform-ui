<template>
  <div class="dashboard-editor-container">
    <header>
      <el-button icon="el-icon-upload" type="success" size="mini">保存</el-button>
      <el-button icon="el-icon-document-checked" type="warning" size="mini">校验</el-button>
      <el-button icon="el-icon-setting" type="primary" size="mini" @click="processDrawer = true">策略属性</el-button>
    </header>
    <main>
	    <panel @openNode="openNode"/>
    </main>
    <el-drawer
      title="策略属性"
      :visible.sync="processDrawer"
      :modal="false"
      direction="rtl"
      :with-header="false"
      class="drawer"
      size="50%">
      <h1>策略属性</h1>
      <el-card class="box-card">
        <el-divider content-position="left">流程信息</el-divider>
        <div class="content">
          <div class="content-row"><span class="label">流程类型：</span><span class="text">{{ ProcessType }}</span></div>
          <div class="content-row"><span class="label">流程描述：</span><span class="text">{{ ProcessDescribe }}</span></div>
          <div class="content-row"><span class="label">所属公司：</span><span class="text">{{ Company }}</span></div>
          <div class="content-row"><span class="label">策略组：</span><span class="text">{{ TacticsGroup }}</span></div>
          <div class="content-row"><span class="label">策略：</span><span class="text">{{ Tactics }}</span></div>
        </div>
      </el-card>
      <el-tabs class="drawer-content">
        <el-tab-pane label="基础信息"><basic-info-tactics/></el-tab-pane>
        <el-tab-pane label="邮件"><notice></notice></el-tab-pane>
        <!--<el-tab-pane label="流程变量"><process-variable/></el-tab-pane>-->
        <!--<el-tab-pane label="功能调用"><process-configuration/></el-tab-pane>-->
        <el-tab-pane label="用户修改"><user-modify/></el-tab-pane>
      </el-tabs>
    </el-drawer>
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
        <el-divider content-position="left">流程信息</el-divider>
        <div class="content">
          <div class="content-row"><span class="label">流程类型：</span><span class="text">{{ ProcessType }}</span></div>
          <div class="content-row"><span class="label">流程描述：</span><span class="text">{{ ProcessDescribe }}</span></div>
          <div class="content-row"><span class="label">所属公司：</span><span class="text">{{ Company }}</span></div>
          <div class="content-row"><span class="label">策略组：</span><span class="text">{{ TacticsGroup }}</span></div>
          <div class="content-row"><span class="label">策略：</span><span class="text">{{ Tactics }}</span></div>
          <div class="content-row"><span class="label">节点：</span><span class="text">{{ Node }}</span></div>
        </div>
      </el-card>
      <el-tabs class="drawer-content">
        <el-tab-pane label="基本信息">
          <basic-info></basic-info>
        </el-tab-pane>
        <el-tab-pane label="配置信息">
          <config-info></config-info>
        </el-tab-pane>
        <el-tab-pane label="通知">
          <notice></notice>
        </el-tab-pane>
        <el-tab-pane label="操作">
          <operating></operating>
        </el-tab-pane>
        <el-tab-pane label="参数">
          <parameter></parameter>
        </el-tab-pane>
	      <el-tab-pane label="显示设置">
		      <show-info ref="nodeForm"></show-info>
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
import UserModify from './components/UserModify'
import BasicInfoTactics from './components/BasicInfoTactics'
import ShowInfo from './components/ShowInfo'
import panel from '../flow/panel'
export default {
  name: 'process-design',
  components: {
    Parameter,
    Operating,
    BasicInfo,
    Notice,
    ConfigInfo,
    UserModify,
    BasicInfoTactics,
    ShowInfo,
    panel
  },
  data () {
    return {
      processDrawer: false,
      nodeDrawer: false,
      ProcessType: 'ASZ测试流程0206',
      ProcessDescribe: 'ASZDemo01-001-Demo02',
      Company: '中国海洋石油总公司',
      TacticsGroup: 'ASZDDemo01-策略组',
      Tactics: 'ASZDDemo01-TEST-审批策略',
      Node: '审批节点'
    }
  },
	methods: {
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
              width: 75px;
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
