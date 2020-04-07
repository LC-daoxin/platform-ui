<template>
  <div class="dashboard-editor-container">
    <search-bar ref="searchBar"></search-bar>
    <table-list></table-list>
    <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 20, 30, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageTotal">
    </el-pagination>
  </div>
</template>

<script>
import SearchBar from './components/SearchBar'
import TableList from './components/TableList'
import {
  myTodoList,
  myProxyList,
  myDoneList,
  myRequestList
} from '@/api/myPages'

export default {
  components: {
    SearchBar,
    TableList
  },
  data () {
    return {
      tableData: [],
      pageTotal: 0,
      currentPage: 1,
      pageSize: 20
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
      const routeName = this.$route.name
      switch (routeName) {
        case 'my-todo':
          this._myTodoList()
          break
        case 'my-proxy':
          this._myProxyList()
          break
        case 'my-done':
          this._myDoneList()
          break
        case 'my-request':
          this._myRequestList()
          break
      }
    },
    getListResult (res) {
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
    },
    _myTodoList () {
      myTodoList().then(res => {
        this.getListResult(res)
      })
    },
    _myProxyList () {
      myProxyList().then(res => {
        this.getListResult(res)
      })
    },
    _myDoneList () {
      myDoneList().then(res => {
        this.getListResult(res)
      })
    },
    _myRequestList () {
      myRequestList().then(res => {
        this.getListResult(res)
      })
    }
  }
}
</script>

<style scoped></style>
