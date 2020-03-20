<template>
  <div class="dashboard-editor-container">
    <el-dialog
      title="添加模板样式"
      :visible.sync="dialogVisible"
      width="50%">
      <style-modal></style-modal>
    </el-dialog>
    <header>
      <div>
        <el-button
          icon="el-icon-arrow-left"
          size="mini"
          @click="$router.push('/work-flow/mail-template')"
        >返回</el-button>
        <el-button type="danger" size="mini">删除</el-button>
        <el-button type="primary" size="mini" @click="dialogVisible=true">新增</el-button>
      </div>
      <div class="search-co">
        <p>名称：</p>
        <el-input size="mini" class="search-input"></el-input>
        <el-button type="primary" size="mini">搜索</el-button>
      </div>
    </header>
    <style-table></style-table>
  </div>
</template>

<script>
import StyleTable from './components/styleTable'
import StyleModal from './components/styleModal'

export default {
  data() {
    return {
      dialogVisible: false
    }
  },
  components: {
    StyleTable,
    StyleModal
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