<template>
  <div>
    <el-dialog
      width="45%"
      :title="dialogTitle"
      :visible.sync="dialogVisible">
      <dialog-form :title="dialogTitle" :id="editProxyId" ref="dialogForm"></dialog-form>
      <span slot="footer">
        <el-button type="primary" @click="onSubmit()" size="mini">提交</el-button>
        <el-button @click="cancel()" size="mini">撤销</el-button>
      </span>
    </el-dialog>
    <currency-table-page headerLayout="left">
      <template slot="header">
        <!-- <search-item label="流水号">
          <el-input v-model="searchData.processID" size="mini"></el-input>
        </search-item>
        <search-item label="申请人">
          <el-input v-model="searchData.fromUserName" size="mini"></el-input>
        </search-item>
        <search-item label="被代理人">
          <el-input v-model="searchData.toUserName" size="mini"></el-input>
        </search-item> -->
        <!-- <search-item label="主题">
          <el-input  size="mini"></el-input>
        </search-item>
        <search-item label="SAP单号">
          <el-input  size="mini"></el-input>
        </search-item> -->
        <!-- <search-item label="流程名称">
          <el-select v-model="searchData.processName" size="mini"></el-select>
        </search-item> -->
        <search-item label="流程名称">
          <el-input v-model="searchData.processName" size="mini"></el-input>
        </search-item>
        <search-item label="受理人AD账号">
          <el-input v-model="searchData.toDestinaionAd" size="mini"></el-input>
        </search-item>
        <search-item label="状态">
          <el-select v-model="searchData.status" size="mini">
            <el-option label="未生效" :value="0"></el-option>
            <el-option label="已生效" :value="1"></el-option>
            <el-option label="已过期" :value="2"></el-option>
            <el-option label="已禁用" :value="3"></el-option>
          </el-select>
        </search-item>
        <!-- <search-item label="流程分组">
          <el-select v-model="searchData.flowGroup" size="mini"></el-select>
        </search-item>
        <search-item label="流程类型">
          <el-select v-model="searchData.flowType" size="mini"></el-select>
        </search-item> -->
        <!-- <search-item label="申请时间">
          <el-date-picker
            v-model="searchData.startDate"
            type="datetime"
            placeholder="开始日期"
            size="mini">
          </el-date-picker>
          <p style="margin:0 10px;display: inline-block;">至</p>
          <el-date-picker
            v-model="searchData.endDate"
            type="datetime"
            placeholder="结束日期"
            size="mini">
          </el-date-picker> -->
        </search-item>
        <search-item>
          <el-button type="primary" size="mini" @click="getTableData">搜索</el-button>
          <el-button type="primary" size="mini" @click="showDialog('新增')">新增</el-button>
        </search-item>
      </template>
      <template slot="main">
        <table-list :tableData="tableData" @edit="showDialog"></table-list>
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
import TableList from './components/TableList'
import DialogForm from './components/dialogForm'
import SearchItem from './components/SearchItem'

export default {
  data () {
    return {
      currentPage: 1,
      pageSize: 20,
      pageTotal: 0,
      dialogVisible: false,
      dialogTitle: '新增',
      tableData: [],
      editProxyId: '',
      searchData: {
        // processID: '',
        // fromUserName: '',
        // toUserName: '',
        status: '',
        processName: '',
        toDestinaionAd: '',
        // startDate: '',
        // endDate: ''
      }
    }
  },
  methods: {
    // 代理设置提交
    onSubmit () {
      const form = this.$refs.dialogForm.$refs.form
      form.validate((valid) => {
        if (valid) {
          this.dialogTitle === '新增'
            ? this.addProxy()
            : this.updateProxy()
        } else {
          return false
        }
      })
    },
    // 显示代理设置面板
    showDialog (title, proxyId) {
      if (proxyId) this.editProxyId = proxyId
      this.dialogTitle = title
      this.dialogVisible = true
    },
    // 关闭代理设置面板
    cancel () {
      this.dialogVisible = false
      this.resetForm()
    },
    // 重置代理设置面板
    resetForm () {
      const form = this.$refs.dialogForm.$refs.form
      form.resetFields()
    },
    // 添加代理设置
    addProxy () {
      const form = this.$refs.dialogForm.$refs.form
      this.axios_M4.post('/delegationSettings/save', form)
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
    // 修改代理设置
    updateProxy () {
      const form = this.$refs.dialogForm.$refs.form
      if (this.title === '修改') form.processID = this.editProxyId
      this.axios_M4.post('/delegationSettings/update', form)
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
    // 修改每页显示数量
    handleSizeChange (val) {
      this.pageSize = val
      this.getTableData()
    },
    // 翻页
    handleCurrentChange (val) {
      this.currentPage = val
      this.getTableData()
    },
    // 获取代理列表
    getTableData () {
      const data = {
        pageNum: this.currentPage,
        pagesize: this.pageSize,
        userName: this.applicant
      }
      Object.assign(data, this.searchData)
      this.axios_M4.post('/delegationSettings/list', data)
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
    // this.getTableData()
  },
  components: {
    CurrencyTablePage,
    TableList,
    DialogForm,
    SearchItem
  }
}
</script>
