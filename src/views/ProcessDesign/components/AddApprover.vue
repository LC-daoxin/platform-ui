<template>
  <el-dialog
    title="添加审批人"
    :visible.sync="dialogApproverVisible"
    @open="getInfo"
    :before-close='handleDialog'
    width="850px"
    append-to-body
  >
    <!-- 控制栏 start -->
    <div class="filter-container">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="搜索..." v-model="searchValue"  size="mini" clearable/>
        </el-col>
        <el-col :span="4">
          <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="search">查询</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 控制栏 end -->
    <!-- 用户table start -->
    <el-table
      v-loading="loading"
      size="mini"
      :data="tableData"
      border
      highlight-current-row
      class="table"
      height="420px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        align="center"
        width="55">
      </el-table-column>
      <el-table-column label="账号" min-width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.ACCOUNT }}</span>
        </template>
      </el-table-column>
      <el-table-column label="显示姓名" min-width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.NAME }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" min-width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.EMAIL }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" min-width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.MOBILE }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 用户table end -->
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 20, 30, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
      class="pagination"
    >
    </el-pagination>
    <!-- 分页 -->
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="sure" size="mini">确定</el-button>
      <el-button @click="handleDialog" size="mini">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import axios from 'axios'
export default {
  name: 'add-user',
  props: {
    dialogApproverVisible: {
      default: false
    }
  },
  data () {
    return {
      searchValue: '', // 搜索内容
      tableData: [],
      multipleSelection: [], // 多选内容
      loading: false,
      currentPage: 1, // 当前页码
      pageSize: 20, // 页条数
      totalCount: null // 总条数
    }
  },
  methods: {
    // 关闭对话框
    handleDialog () {
      this.$emit('showDialog')
    },
    // 获取用户列表
    getInfo (name = 'all', limit = 20, start = 0) {
      this.loading = true
      axios.get(`/mock/User.json`)
        .then(this.getInfoSucc)
      // this.axios.get(`/user/userAllQuery/all/${name}/${limit}/${start}`)
      //   .then(this.getInfoSucc)
    },
    getInfoSucc (res) {
      let data = res.data
      console.log(data)
      if (data.code === 'success') {
        this.tableData = data.data // 用户table
        this.totalCount = data.total // 总条数
        this.pageSize = data.pagesize // 页条数
        this.currentPage = data.pageNum // 当前页码
        this.loading = false
      }
    },
    // 多选
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 当前页面条数
    handleSizeChange (val) {
      this.pageSize = val
      this.search()
    },
    // 页面码数
    handleCurrentChange (val) {
      this.currentPage = val
      let currentNum = (val - 1) * this.pageSize
      this.search(currentNum)
    },
    // 搜索
    search (start = 0) {
      if (this.searchValue === '') {
        this.getInfo('all', this.pageSize, start)
      } else {
        this.getInfo(this.searchValue, this.pageSize, start)
      }
    },
    // 确定
    sure () {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要添加的审批人！'
        })
      } else {
        this.$emit('Approver', this.multipleSelection)
        this.handleDialog()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 5px 20px 10px;
}
.table {
  margin-top: 10px;
  ::v-deep .el-table-column--selection .cell{
    padding-right: 10px;
  }
}
</style>
