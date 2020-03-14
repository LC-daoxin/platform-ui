<template>
  <div class="dashboard-editor-container">
    <header>
      <el-button icon="el-icon-upload" type="primary" size="mini">保存</el-button>
      <el-button icon="el-icon-document-checked" type="primary" size="mini">校验</el-button>
      <el-button icon="el-icon-s-promotion" type="primary" size="mini">发布</el-button>
      <el-button icon="el-icon-picture-outline" type="primary" size="mini">存为图片</el-button>
      <el-button icon="el-icon-setting" type="primary" size="mini" @click="processDrawer = true">流程属性</el-button>
      <el-button icon="el-icon-setting" type="primary" size="mini" @click="nodeDrawer = true">节点属性</el-button>
    </header>
    <main></main>
    <el-drawer
      title="流程属性"
      :visible.sync="processDrawer"
      :modal="false"
      direction="rtl"
      :with-header="false"
      class="drawer"
      size="50%">
      <h1>流程属性</h1>
      <el-tabs class="drawer-content">
        <el-tab-pane label="流程变量"><process-configuration/></el-tab-pane>
        <el-tab-pane label="功能调用">功能调用</el-tab-pane>
        <el-tab-pane label="用户修改">用户修改</el-tab-pane>
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
      </el-tabs>
    </el-drawer>
  </div>
</template>

<script>
import ProcessConfiguration from './components/ProcessConfiguration'
import Parameter from './components/Parameter'
import Operating from './components/Operating'
import BasicInfo from './components/BasicInfo'
import Notice from './components/Notice'
import ConfigInfo from './components/ConfigInfo'
export default {
  components: {
    ProcessConfiguration,
    Parameter,
    Operating,
    BasicInfo,
    Notice,
    ConfigInfo
  },
  data() {
    return {
      processDrawer: false,
      nodeDrawer: false
    }
  }
}
</script>

<style lang="scss" scoped>
  .dashboard-editor-container {
    header {
      margin-bottom: 10px;
    }
    main {
      display: flex;
      height: calc(100vh - 163.67px);
      background: url('./img/流程设计器2.png') left top no-repeat;
      background-size: 100%;
      box-shadow: 0 0 0 1px #cfd7e5;
    }
    .drawer {
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