<template>
  <currency-table-page headerLayout="left">
    <template slot="header">
      <search-item label="流水号">
        <el-input  size="mini"></el-input>
      </search-item>
      <search-item label="主题">
        <el-input  size="mini"></el-input>
      </search-item>
      <search-item label="SAP单号">
        <el-input  size="mini"></el-input>
      </search-item>
      <search-item label="状态">
        <el-select v-model="searchData.status" size="mini"></el-select>
      </search-item>
      <search-item label="流程分组">
        <el-select v-model="searchData.flowGroup" size="mini"></el-select>
      </search-item>
      <search-item label="流程类型">
        <el-select v-model="searchData.flowType" size="mini"></el-select>
      </search-item>
      <search-item label="流程名称">
        <el-select v-model="searchData.flowName" size="mini"></el-select>
      </search-item>
      <search-item label="申请时间">
        <el-date-picker
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small">
        </el-date-picker>
      </search-item>
      <search-item>
        <el-button type="primary" size="mini" @click="tableList">搜索</el-button>
      </search-item>
    </template>
    <template slot="main">
      <table-list></table-list>
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
import { myRequestList } from '@/api/myPages'

export default {
  data () {
    return {
      currentPage: 1,
      pageSize: 20,
      pageTotal: 100,
      searchData: {
        status: '',
        flowGroup: '',
        flowType: '',
        flowName: ''
      }
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.tableList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.tableList()
    },
    tableList () {
      this._myRequestList()
    },
    _myRequestList () {
      myRequestList().then(res => {
        this.getListResult(res)
      })
    }
  },
  mounted () {},
  components: {
    CurrencyTablePage,
    SearchItem,
    TableList
  }
}
</script>
