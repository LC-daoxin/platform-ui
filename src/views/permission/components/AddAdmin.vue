<template>
  <el-dialog
    title="用户选择"
    :visible.sync="dialogAddAdminVisible"
    @open="getUserInfo"
    :before-close='handleDialog'
    width="720px"
  >
    <!-- 控制栏 start -->
    <div class="filter-container">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-select v-model="value" placeholder="请选择" size="mini">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="7">
          <el-input placeholder="账号,显示姓名,邮箱" v-model="searchValue"  size="mini"/>
        </el-col>
        <el-col :span="4">
          <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="search()">查询</el-button>
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
      @current-change="handleCurrentUser"
    >
      <el-table-column label="账号" min-width="90" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.ACCOUNT }}</span>
        </template>
      </el-table-column>
      <el-table-column label="显示姓名" min-width="120" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.DISNAME }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" min-width="110" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.EMAIL }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" min-width="90" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.TELPHONE }}</span>
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
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="addSure()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'add-admin',
  props: {
    dialogAddAdminVisible: {
      default: false
    }
  },
  data () {
    return {
      options: [{
        value: 'name',
        label: '账号'
      }, {
        value: 'account',
        label: '显示姓名'
      }, {
        value: 'email',
        label: '邮箱'
      }],
      value: 'name',
      searchValue: '', // 搜索
      tableData: [],
      currentPage: 1, // 当前页码
      pageSize: 20, // 页条数
      totalCount: null, // 总条数
      multipleSelection: [], // 多选内容
      loading: false,
      currentUser: '' // 选中用户
    }
  },
  methods: {
    // 关闭对话框
    handleDialog () {
      this.$emit('showDialog')
    },
    // 获取用户列表
    getUserInfo (type = 'all', name = 'all', limit = 20, start = 0) {
      this.loading = true
      this.axios_M2.get(`/reportmanage/userList/${type}/${name}/${limit}/${start}`)
        .then(this.getInfoSucc)
    },
    getInfoSucc (res) {
      let data = res.data
      if (data.code === 'success') {
        this.tableData = data.data // ldap用户table
        this.totalCount = data.total // 总条数
        this.pageSize = data.pagesize // 页条数
        this.currentPage = data.pageNum // 当前页码
        this.loading = false
      }
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
    // 多选
    handleSelectionChange (val) {
      console.log(val)
    },
    // 搜索
    search (start = 0) {
      if (this.searchValue === '') {
        this.getUserInfo('all', 'all', this.pageSize, start)
      } else {
        this.getUserInfo(this.value, this.searchValue, this.pageSize, start)
      }
    },
    // 选中用户
    handleCurrentUser (val) {
      if (val) {
        this.currentUser = val.ID
      }
    },
    // 确定
    addSure () {
      if (this.currentUser === '') {
        this.$message({
          type: 'warning',
          message: '请选择用户！'
        })
      } else {
        this.$parent.addAdmin(this.currentUser)
        this.handleDialog()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 5px 20px;
}
.table {
  margin-top: 10px;
  ::v-deep .el-table-column--selection .cell{
    padding-right: 10px;
  }
}
</style>
