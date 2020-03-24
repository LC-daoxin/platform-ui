<template>
  <div>
    <header>
      <div>
        <span>数据源</span>
        <el-button type="primary" size="mini" icon="el-icon-plus"></el-button>
      </div>
      <div>
        <span>模版样式</span>
        <el-select v-model="templateStyle" size="mini"></el-select>
      </div>
      <!-- <div>
        <span>编辑模式</span>
        <el-select size="mini"></el-select>
      </div> -->
    </header>
    <main>
      <ckeditor v-model="editorData" :value="editorData"></ckeditor>
    </main>
  </div>
</template>

<script>
export default {
  data () {
    return {
      templateStyle: '',
      editorData: ''
    }
  }
}
</script>

<style scoped>
  header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  header div {
    margin-right: 10px;
  }
  header div span {
    font-size: 12px;
    margin-right: 10px;
  }
</style>
