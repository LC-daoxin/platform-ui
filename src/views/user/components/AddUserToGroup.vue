<template>
  <el-dialog
    title="添加用户"
    :visible.sync="AddUserToGroupVisible"
    :before-close='handleDialog'
    @open='open'
    width="720px"
  >
    <!-- 控制栏 start -->
    <div class="filter-container">
      <el-row>
        <el-col :span="6">
          <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="addUserToGroup(multipleSelection)">批量添加</el-button>
        </el-col>
        <el-col :span="18">
          <el-row type="flex" :gutter="10" justify="end">
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
              <el-input placeholder="搜索..." v-model="searchValue"  size="mini"/>
            </el-col>
            <el-col :span="4">
              <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="search()">查询</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <!-- 控制栏 end -->
    <!-- 不在用户组中的用户table start -->
    <el-table
      size="mini"
      :data="tableData"
      border
      highlight-current-row
      class="table"
      height="450px"
      v-loading="loading"
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
      <el-table-column label="用户名" min-width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.NAME }}</span>
        </template>
      </el-table-column>
      <el-table-column label="显示名称" min-width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.DISNAME }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" min-width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.EMAIL }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" min-width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.TELPHONE }}</span>
        </template>
      </el-table-column>
      <el-table-column label="" min-width="100" align="center">
        <template slot-scope="scope">
          <div>
            <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="addUserToGroup(scope.row.ID)">添加</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 不在用户组中的用户table end -->
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
  </el-dialog>
</template>

<script>
export default {
  name: 'add-user-to-group',
  props: {
    ID: Number,
    AddUserToGroupVisible: {
      default: false
    }
  },
  data () {
    return {
      options: [{
        value: 'account',
        label: '账号'
      }, {
        value: 'name',
        label: '用户名'
      }, {
        value: 'email',
        label: '邮箱'
      }],
      value: 'account',
      searchValue: '', // 搜索内容
      tableData: [],
      currentPage: 1, // 当前页码
      pageSize: 20, // 页条数
      totalCount: null, // 总条数
      multipleSelection: '', // 多选内容
      loading: false
    }
  },
  methods: {
    // 关闭对话框
    handleDialog () {
      this.$emit('showDialog', 'AddUserToGroup')
    },
    // 打开对话框时，回调
    open () {
      this.getUserToGroupInfo()
    },
    // 获取查询不在用户组中的用户列表
    getUserToGroupInfo (groupId = 10, type = 'all', name = 'all', limit = 20, start = 0) {
      this.loading = true
      this.axios.get(`/group/userExcludeByGroup/${groupId}/${type}/${name}/${limit}/${start}`)
        .then((res) => {
          let data = res.data
          if (data.code === 'success') {
            this.tableData = data.data // 不在用户组用户table
            this.totalCount = data.total // 总条数
            this.pageSize = data.pagesize // 页条数
            this.currentPage = data.pageNum // 当前页码
            this.loading = false
          }
        })
    },
    // 多选
    handleSelectionChange (val) {
      let Str = ''
      val.forEach((el) => {
        Str += el.ID + ','
      })
      Str = Str.substring(0, Str.length - 1)
      this.multipleSelection = Str
    },
    // 添加用户到组
    addUserToGroup (UserID) {
      if (UserID === '') {
        this.$message({
          type: 'warning',
          message: '请选择用户！'
        })
      } else {
        this.axios.post(`/group/addUserToGroup/${this.ID}/${UserID}`)
          .then((res) => {
            let data = res.data
            if (data.code === 'success') {
              this.$message({
                type: 'success',
                message: data.msg
              })
              this.$emit('refresh')
              this.handleDialog()
            }
          })
      }
    },
    // 搜索
    search (start = 0) {
      if (this.searchValue === '') {
        this.getUserToGroupInfo(this.ID, 'all', 'all', this.pageSize, start)
      } else {
        this.getUserToGroupInfo(this.ID, this.value, this.searchValue, this.pageSize, start)
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
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  margin-top: 10px;
  ::v-deep .el-table-column--selection .cell{
    padding-right: 10px;
  }
}
</style>
