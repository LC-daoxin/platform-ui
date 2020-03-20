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
          <el-input size="mini" v-model="search.name"></el-input>
        </div>
        <div class="search-item">
          <span>流程目录编码：</span>
          <el-input size="mini" v-model="search.code"></el-input>
        </div>
        <el-button type="primary" icon="el-icon-search" size="mini">搜索</el-button>
      </div>
    </header>
    <main>
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
    </main>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
      small>
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableHeight: window.innerHeight - 165.67 - 44,
      currentPage: 1,
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
          prop: 'code',
          label: '流程目录编码'
        }, {
          prop: 'parent',
          label: '父类型'
        }, {
          label: '操作'
        }
      ],
      tableData: [
        {
          code: 'cataA1',
          name: '目录A1',
          parentName: ''
        },
        {
          code: 'cataA',
          name: '目录A',
          parentName: ''
        }
      ],
      search: {
        name: '',
        code: ''
      }
    }
  },
  methods: {
    onSubmit () {
      this.dialogVisible = false
    },
    /**
     * 修改显示数量
     */
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    /**
     * 翻页
     */
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style scoped>
  .dashboard-editor-container header {
    display: flex;
    justify-content: space-between;
  }
  .dashboard-editor-container main {
    margin: 12px 0;
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
