<template>
  <div class="dashboard-editor-container">
    <header>
      <el-button icon="el-icon-upload" type="primary" size="mini">保存</el-button>
      <el-button icon="el-icon-document-checked" type="primary" size="mini">校验</el-button>
      <el-button icon="el-icon-s-promotion" type="primary" size="mini">发布</el-button>
      <el-button icon="el-icon-picture-outline" type="primary" size="mini">存为图片</el-button>
    </header>
    <main></main>
    <el-drawer
      title="流程属性"
      :visible.sync="drawer"
      direction="rtl"
      size="50%">
      <el-tabs class="drawer-content">
        <el-tab-pane label="基本信息">基本信息</el-tab-pane>
        <el-tab-pane label="配置信息">配置信息</el-tab-pane>
        <el-tab-pane label="通知">通知</el-tab-pane>
        <el-tab-pane label="操作">操作</el-tab-pane>
        <el-tab-pane label="参数">参数</el-tab-pane>
      </el-tabs>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: true,

    }
  }
}
</script>

<style lang="scss" scoped>
  .dashboard-editor-container
    header {
      margin-bottom: 10px;
    }
    main {
      display: flex;
      height: calc(100vh - 163.67px);
      background: url('./img/流程设计器.png') left top no-repeat;
      background-size: 85%;
      box-shadow: 0 0 0 1px #cfd7e5;
    }
    .drawer-content {
      margin-top: -10px;
      padding: 0 10px;
      border-top: 1px solid #cfd7e5;
    }
</style>