<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <dialog-form ref="dialogForm"></dialog-form>
      <span slot="footer">
        <el-button type="primary" @click="onSubmit()" size="mini">提交</el-button>
        <el-button @click="cancel()" size="mini">撤销</el-button>
      </span>
    </el-dialog>
    <currency-table-page headerLayout="left">
      <template slot="header">
        <el-button size="mini" type="primary" @click="showDialog('新增')">添加</el-button>
        <el-button size="mini" @click="getTableData">刷新</el-button>
      </template>
      <template slot="main">
        <main-table :tableData="tableData" @edit="showDialog"></main-table>
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
  </div>
</template>

<script>
import CurrencyTablePage from '@/components/currency-table-page'
import MainTable from './components/MainTable'
import DialogForm from './components/DialogForm'

export default {
  data () {
    return {
      currentPage: 1,
      pageTotal: 0,
      pageSize: 20,
      dialogTitle: '新增',
      dialogVisible: false,
      editClientId: '',
      tableData: []
    }
  },
  methods: {
    showDialog (title, clientId) {
      if (clientId) this.editClientId = clientId
      this.dialogTitle = title
      this.dialogVisible = true
    },
    onSubmit () {
      const form = this.$refs.dialogForm.$refs.form
      form.validate((valid) => {
        if (valid) {
          this.dialogTitle === '新增'
            ? this.addClients()
            : this.updateClients()
        } else {
          return false
        }
      })
    },
    cancel () {
      this.dialogVisible = false
      this.resetForm()
    },
    addClients () {
      const form = this.$refs.dialogForm.$refs.form
      this.axios_M4.post('/clients/save', form)
        .then(({ data }) => {
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
    updateClients () {
      const form = this.$refs.dialogForm.$refs.form
      if (this.title === '修改') form.clientId = this.editClientId
      this.axios_M4.post('/clients/update', form)
        .then(({ data }) => {
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
    resetForm () {
      const form = this.$refs.dialogForm.$refs.form
      form.resetFields()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getTableData()
    },
    handleSizeChange (val) {
      this.pageSize = val
    },
    getTableData () {
      this.axios_M4.post('/clients/listPage/', {
        pageNum: this.currentPage,
        pagesize: this.pagesize
      }).then(res => {
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
    // this.getTableData()
  },
  components: {
    CurrencyTablePage,
    MainTable,
    DialogForm
  }
}
</script>
