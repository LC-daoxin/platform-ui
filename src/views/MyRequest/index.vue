<template>
  <currency-table-page headerLayout="left">
    <template slot="header">
      <search-item label="流水号">
        <el-input v-model="searchData.applicationNumber" size="mini"></el-input>
      </search-item>
      <search-item label="主题">
        <el-input v-model="searchData.applicationSubject" size="mini"></el-input>
      </search-item>
      <!-- <search-item label="SAP单号">
        <el-input  size="mini"></el-input>
      </search-item> -->
      <search-item label="状态">
        <el-select v-model="searchData.applicationStatus" size="mini">
          <el-option
           v-for="status of statusOptions"
           :key="status.value"
           :label="status.label"
           :value="status.value"
          ></el-option>
        </el-select>
      </search-item>
      <!-- <search-item label="流程分组">
        <el-select v-model="searchData.flowGroup" size="mini"></el-select>
      </search-item>
      <search-item label="流程类型">
        <el-select v-model="searchData.flowType" size="mini"></el-select>
      </search-item> -->
      <search-item label="流程名称">
        <el-select v-model="searchData.processName" size="mini"></el-select>
      </search-item>
      <search-item label="申请开始时间" coWidth="auto">
        <el-date-picker
          v-model="searchData.applyStartDate"
          type="datetime"
          placeholder="开始日期"
          size="mini">
        </el-date-picker>
      </search-item>
      <el-button type="primary" size="mini" @click="getTableData">搜索</el-button>
    </template>
    <template slot="main">
      <table-list :tableData="tableData"></table-list>
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
</template>

<script>
import CurrencyTablePage from '@/components/currency-table-page'
import TableList from './components/TableList'
import SearchItem from './components/SearchItem'
import statusOptions from '@/assets/options/application-status-options'

export default {
  data () {
    return {
      statusOptions,
      currentPage: 1,
      pageSize: 20,
      pageTotal: 0,
      applicant: '',
      tableData: [],
      searchData: {
        applicationNumber: '',
        applicationSubject: '',
        applicationStatus: '',
        processName: '',
        applyStartDate: ''
      }
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.getTableData()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getTableData()
    },
    getTableData () {
      const data = {
        pageNum: this.currentPage,
        pagesize: this.pageSize,
        userName: this.applicant
      }
      Object.assign(data, this.searchData)
      this.axios_M4.post('/process/requestTask', data)
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
    SearchItem,
    TableList
  }
}
</script>
