<template>
  <div class="dashboard-editor-container">
    <header>
      <div>
        <el-button type="danger" size="mini">删除</el-button>
        <el-button type="primary" size="mini">新增</el-button>
        <el-button type="primary" size="mini">导入</el-button>
      </div>
      <div class="search-co">
        <p>编码：</p>
        <el-input size="mini" class="search-input"></el-input>
        <p>名称：</p>
        <el-input size="mini" class="search-input"></el-input>
        <el-button type="primary" size="mini">搜索</el-button>
      </div>
    </header>
    <el-table :height="tableHeight" size="mini" border stripe>

    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableHeight: window.innerHeight - 177
    }
  }
}
</script>

<style scoped>
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  header .search-co {
    display: flex;
    align-items: center;
  }
  header .search-co p {
    font-size: 12px;
  }
  header .search-co .el-input--mini {
    width: 100px;
    margin-right: 12px;
  }
</style>