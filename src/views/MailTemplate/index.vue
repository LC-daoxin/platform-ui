<template>
  <div>
    <currency-table-page>
      <template slot="header-left">
        <el-button type="danger" size="mini" @click="_deleteTemplate">删除</el-button>
        <el-button type="primary" size="mini" @click="dialogVisible=true">新增</el-button>
        <el-button type="primary" size="mini" @click="_importTemplate">导入</el-button>
        <!-- <el-button
          type="primary"
          size="mini"
          @click="$router.push('/work-flow/template-style')"
        >模板样式</el-button> -->
      </template>
      <template slot="header-right">
        <search-item label="编码">
          <el-input v-model="search_code" size="mini" class="search-input"></el-input>
        </search-item>
        <search-item label="名称">
          <el-input v-model="search_name" size="mini" class="search-input"></el-input>
        </search-item>
        <el-button type="primary" size="mini" @click="_tableList">搜索</el-button>
      </template>
      <template slot="main">
        <template-table :tableData="tableData" @edit="handleEdit"></template-table>
      </template>
      <template slot="footer">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 20, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageTotal">
        </el-pagination>
      </template>
    </currency-table-page>
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
import CurrencyTablePage from '@/components/currency-table-page'
import SearchItem from './components/SearchItem'
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
      currentPage: 1,
      pageSize: 20,
      pageTotal: 100,
      dialogVisible: false,
      tableData: [{}],
      search_code: '',
      search_name: ''
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this._tableList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this._tableList()
    },
    handleEdit () {
      this.dialogVisible = true
    },
    // 删除模板
    _deleteTemplate () {
      deleteTemplate().then(res => {
        res = res.data
        const { code, data, msg } = res
        console.log(code, data, msg)
      })
    },
    // 导入模板
    _importTemplate () {
      importTemplate.then(res => {
        res = res.data
        const { code, data, msg } = res
        console.log(code, data, msg)
      })
    },
    // 获取模板列表
    _tableList () {
      tableList.then(res => {
        res = res.data
        const { code, data, msg } = res
        console.log(code, data, msg)
      })
    }
  },
  mounted () {},
  components: {
    TemplateTable,
    TemplateDialog,
    CurrencyTablePage,
    SearchItem
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
