<template>
  <div>
    <header>
      <div class="params">
        <span>邮件模板类型</span>
        <el-select v-model="mailTemplateType" size="mini" style="width:170px">
          <el-option value="">通知</el-option>
        </el-select>
      </div>
      <div class="params">
        <span>邮件模板名称</span>
        <el-input size="mini" style="width:170px"></el-input>
      </div>
      <el-button type="primary" size="mini">添加</el-button>
    </header>
    <el-table size="mini" :data="tableData" border></el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      mailTemplateType: '通知'
    }
  }
}
</script>

<style lang="scss" scoped>
  header {
    display: flex;
    margin-bottom: 10px;

    .params {
      margin-right: 10px;

      span {
        font-size: 12px;
        margin-right: 10px;
      }
    }
  }
</style>