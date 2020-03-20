<template>
  <div>
    <header>
      <div class="params">
        <span>邮件模板类型</span>
        <el-select v-model="mailTemplateType" size="mini" style="width:170px">
          <el-option value="1" label="批准"></el-option>
          <el-option value="2" label="拒绝"></el-option>
          <el-option value="3" label="取消"></el-option>
        </el-select>
      </div>
      <div class="params">
        <span>邮件模板名称</span>
        <el-input size="mini" style="width:170px"></el-input>
      </div>
      <el-button type="primary" size="mini">添加</el-button>
    </header>
	  <h1>邮件列表</h1>
    <el-table size="mini" :data="tableData" border></el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      mailTemplateType: '1'
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
  h1 {
	  font-size: 15px;
	  font-weight: 300;
	  padding: 8px 10px;
	  margin: 0;
  }
</style>