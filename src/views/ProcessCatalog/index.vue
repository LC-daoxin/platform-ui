<template>
  <div class="dashboard-editor-container">
    <el-dialog
      width="30%"
      :title="dialogTitle"
      :visible.sync="dialogVisible">
      <dialog-form ref="dialogForm" :content="editContent"></dialog-form>
      <span slot="footer">
        <el-button type="primary" @click="onSubmit()" size="mini">提交</el-button>
        <el-button @click="cancel()" size="mini">撤销</el-button>
      </span>
    </el-dialog>
    <search-bar @add="showDialog('新增')" @delete="_deleteProcSet" @search="getTableData"></search-bar>
    <main-table :tableData="tableData" @select="handleSelectionChange" @edit="showDialog"></main-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 20, 30, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageTotal"
      small>
    </el-pagination>
  </div>
</template>

<script>
import {
  procSetQuery,
  addProcSet,
  updateProcSet,
  deleteProcSet
} from '@/api/proc-set'
import DialogForm from './components/dialogForm'
import SearchBar from './components/searchBar'
import MainTable from './components/mainTable'

export default {
  data () {
    return {
      currentPage: 1,
      pageSize: 20,
      pageTotal: 0,
      dialogVisible: false,
      dialogTitle: '新增',
      tableData: [],
      multipleSelection: [],
      editContent: {}
    }
  },
  methods: {
    onSubmit () {
      const form = this.$refs.dialogForm.$refs.form
      form.validate((valid) => {
        if (valid) {
          this.dialogTitle === '新增'
            ? this._addProcSet()
            : this._updateProcSet()
        } else {
          return false
        }
      })
    },
    /**
     * 添加流程分类
     */
    _addProcSet () {
      addProcSet(this.form).then(({ data }) => {
        const { code, msg } = data
        if (code === 'success') {
          this.$message.success(msg)
          this.cancel()
          this.getTableData()
        } else {
          this.$message.error(msg)
        }
      })
    },
    /**
     * 修改流程分类
     */
    _updateProcSet () {
      const data = this.form
      updateProcSet(data).then(({ data }) => {
        const { code, msg } = data
        if (code === 'success') {
          this.$message.success(msg)
          this.cancel()
          this.getTableData()
        } else {
          this.$message.error(msg)
        }
      })
    },
    _deleteProcSet () {
      deleteProcSet(this.multipleSelection.join(','))
        .then(({ data }) => {
          const { code, msg } = data
          if (code === 'success') {
            this.deleteResult(data.data)
            this.$confirm(data.data, '操作结果', {
              confirmButtonText: '确定',
              type: 'warning'
            })
            this.getTableData()
          } else {
            this.$message.error(msg)
          }
        })
    },
    deleteResult (data) {
    },
    showDialog (title, row) {
      this.editContent = row
      this.dialogTitle = title
      this.dialogVisible = true
    },
    cancel () {
      this.dialogVisible = false
      this.resetForm()
    },
    resetForm () {
      const form = this.$refs.dialogForm.$refs.form
      form.resetFields()
    },
    handleSelectionChange (val) {
      const idArr = []
      for (let item of val) {
        idArr.push(item.procSetId)
      }
      this.multipleSelection = idArr
    },
    /**
     * 修改显示数量
     */
    handleSizeChange (val) {
      this.pageSize = val
    },
    /**
     * 翻页
     */
    handleCurrentChange (val) {
      this.currentPage = val
      this.getTableData()
    },
    checkQuery (params) {
      let query = ''
      if (params) {
        for (let param of params) {
          query += param ? param + '/' : 'all/'
        }
      } else {
        query = 'all/all/'
      }
      return query
    },
    getTableData (searchData) {
      procSetQuery(`${this.checkQuery(searchData)}${this.pageSize}/${this.currentPage}`)
        .then(res => {
          res = res.data
          const { code, data, msg, total } = res
          if (code === 'success') {
            this.tableData = data
            this.pageTotal = total
          } else {
            this.$message({
              showClose: true,
              message: msg,
              type: 'error'
            })
          }
        })
    }
  },
  mounted () {
    this.getTableData()
  },
  components: {
    DialogForm,
    SearchBar,
    MainTable
  }
}
</script>
