<template>
  <div class="dashboard-editor-container">
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible">
      <el-form ref="form" :model="form" label-width="100px" style="width:400px" size="mini">
        <el-form-item label="流程目录名称">
          <el-input v-model="form.name" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="流程目录编码">
          <el-input v-model="form.key" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" size="mini"></el-form-item>
        <el-form-item label="排序">
          <el-input v-model="form.index" size="mini"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" size="mini">提交</el-button>
          <el-button @click="dialogVisible = false" size="mini">撤销</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <header>
      <div class="button-co">
        <el-button type="primary" icon="el-icon-plus" @click="dialogVisible=true" size="mini">新增</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
      </div>
      <div class="search-co">
        <div class="search-item">
          <span>流程目录名称：</span>
          <el-input size="mini"></el-input>
        </div>
        <div class="search-item">
          <span>流程目录编码：</span>
          <el-input size="mini"></el-input>
        </div>
        <el-button type="primary" icon="el-icon-search" size="mini">搜索</el-button>
      </div>
    </header>
    <el-table :data="tableData" :height="tableHeight" size="mini" border stripe>
      <el-table-column
        type="selection"
        align="center"
        width="40">
      </el-table-column>
      <el-table-column
        fixed
        v-for="(item, index) of columns"
        :key="index"
        :prop="item.prop"
        :label="item.label">
        <template v-if="item.label === '操作'">
          <el-button type="primary" size="mini">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableHeight: 0,
      dialogVisible: false,
      dialogTitle: '新增',
      form: {
        name: '',
        key: '',
        parent: '',
        index: ''
      },
      columns: [
        {
          prop: 'name',
          label: '流程目录名称'
        }, {
          prop: 'key',
          label: '流程目录编码'
        }, {
          prop: 'parent',
          label: '父类型'
        }, {
          label: '操作'
        }
      ],
      tableData: [
        {},{},{}
      ]
    }
  },
  methods: {
    onSubmit() {
      this.dialogVisible = false
    }
  },
  mounted() {
    this.tableHeight = window.innerHeight - 165.67
  }
}
</script>

<style scoped>
  .dashboard-editor-container header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .dashboard-editor-container header .search-co {
    display: flex;
  }
  .dashboard-editor-container header .search-co .search-item {
    display: flex;
    align-items: center;
    margin-right: 12px;
  }
  .dashboard-editor-container header .search-co .search-item span {
    font-size: 12px;
  }
  .dashboard-editor-container header .search-co .search-item .el-input {
    width: 120px;
  }
</style>