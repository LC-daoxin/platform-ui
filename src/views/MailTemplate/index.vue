<template>
  <div class="dashboard-editor-container">
    <header>
      <div>
        <el-button type="danger" size="mini" @click="_deleteTemplate">删除</el-button>
        <el-button type="primary" size="mini" @click="dialogVisible=true">新增</el-button>
        <el-button type="primary" size="mini" @click="_importTemplate">导入</el-button>
        <!-- <el-button
          type="primary"
          size="mini"
          @click="$router.push('/work-flow/template-style')"
        >模板样式</el-button> -->
      </div>
      <div class="search-co">
        <p>编码：</p>
        <el-input v-model="search_code" size="mini" class="search-input"></el-input>
        <p>名称：</p>
        <el-input v-model="search_name" size="mini" class="search-input"></el-input>
        <el-button type="primary" size="mini" @click="_tableList">搜索</el-button>
      </div>
    </header>
    <template-table :tableData="tableData" @edit="handleEdit"></template-table>
    <el-dialog
      title="添加模版设置"
      :visible.sync="dialogVisible"
      width="50%">
      <template-dialog></template-dialog>
      <span slot="footer">
        <el-button type="primary" @click="dialogVisible = false" size="mini">提交</el-button>
        <el-button @click="dialogVisible = false" size="mini">撤销</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TemplateTable from './components/templateTable'
import TemplateDialog from './components/templateDialog'
import {
  deleteTemplate,
  importTemplate,
  tableList
} from '@/api/mail-template'

export default {
  data () {
    return {
      dialogVisible: false,
      tableData: [{}],
      search_code: '',
      search_name: ''
    }
  },
  methods: {
    handleEdit () {
      this.dialogVisible = true
    },
    /**
     * 删除模板
     * @private
     */
    _deleteTemplate () {
      deleteTemplate().then(res => {
        res = res.data
        const { code, data, msg } = res
        console.log(code, data, msg)
      })
    },
    /**
     * 导入模板
     * @private
     */
    _importTemplate () {
      importTemplate.then(res => {
        res = res.data
        const { code, data, msg } = res
        console.log(code, data, msg)
      })
    },
    /**
     * 获取模板列表
     * @private
     */
    _tableList () {
      tableList.then(res => {
        res = res.data
        const { code, data, msg } = res
        console.log(code, data, msg)
      })
    }
  },
  mounted () {
    // this._tableList()
  },
  components: {
    TemplateTable,
    TemplateDialog
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
  .dashboard-editor-container /deep/ .el-dialog__footer {
    text-align: left;
  }
</style>
