<template>
  <el-dialog
    title="授予用户权限"
    :visible.sync="AddUserPermissionVisible"
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
            <el-col :span="8">
              <el-select v-model="value" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-input placeholder="角色名称" v-model="searchValue"  size="mini"/>
            </el-col>
            <el-col :span="8">
              <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="search()">查询</el-button>
              <el-button class="filter-item" type="primary" size="mini" icon="el-icon-refresh" @click="refresh()">刷新</el-button>
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
      <el-table-column label="系统ID" min-width="60" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.SYSTEMCODE }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色类型" min-width="70" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.ROLETYPE }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名称" min-width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.ROLENAME }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色描述" min-width="120" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.ROLEDESC }}</span>
        </template>
      </el-table-column>
      <el-table-column label="" min-width="80" align="center">
        <template slot-scope="scope">
          <div>
            <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="addUserToGroup(scope.row.ROLEID)">添加</el-button>
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
  name: 'add-user-permission',
  props: {
    searchType: Number,
    userID: [Number, String],
    groupID: [Number, String],
    AddUserPermissionVisible: {
      default: false
    }
  },
  data () {
    return {
      options: [],
      value: null,
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
      this.refresh()
      this.$emit('showDialog', 'UserPermission')
    },
    // 刷新
    refresh () {
      this.searchValue = '' // 清空搜索
      this.value = null
    },
    // 打开对话框时，回调
    open () {
      if (this.searchType === 1) {
        this.getUserToGroupInfo(this.groupID, 1)
      } else {
        this.getUserToGroupInfo(this.userID, 0)
      }
      this.querySysAll()
    },
    // 获取所有系统列表
    querySysAll () {
      this.axios_M2.get('/system/querySysAll')
        .then((res) => {
          if (res.data.code === 'success') {
            this.options = res.data.data
            // this.value = res.data.data[0].value
          }
        })
    },
    // 获取查询不在用户组中的用户列表
    getUserToGroupInfo (usergroupid = 10, isgroup = 1, systemId = 0, rolename = 'all', limit = 20, start = 0) {
      this.loading = true
      console.log(`/role/roleExcludeByGroupOrUserPart/${usergroupid}/${isgroup}/${systemId}/${rolename}/${limit}/${start}`)
      this.axios_M2.get(`/role/roleExcludeByGroupOrUserPart/${usergroupid}/${isgroup}/${systemId}/${rolename}/${limit}/${start}`)
        .then((res) => {
          console.log(res)
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
        Str += el.ROLEID + ','
      })
      Str = Str.substring(0, Str.length - 1)
      this.multipleSelection = Str
    },
    // 添加角色到用户/组
    addUserToGroup (roleId) {
      if (roleId === '') {
        this.$message({
          type: 'warning',
          message: '请选择角色！'
        })
      } else {
        if (this.searchType === 1) {
          console.log(`/role/addGrantToGroup/${this.groupID}/${roleId}`)
          this.axios_M2.post(`/role/addGrantToGroup/${this.groupID}/${roleId}`)
            .then((res) => {
              console.log(res)
              let data = res.data
              if (data.code === 'success') {
                this.$message({
                  type: 'success',
                  message: data.msg
                })
                this.$emit('refresh')
                this.handleDialog()
              } else {
                this.$message({
                  type: 'error',
                  message: data.msg
                })
              }
            })
        } else {
          console.log(`/role/addGrantToUser/${roleId}/${this.userID}`)
          this.axios_M2.post(`/role/addGrantToUser/${roleId}/${this.userID}`)
            .then((res) => {
              console.log(res)
              let data = res.data
              if (data.code === 'success') {
                this.$message({
                  type: 'success',
                  message: data.msg
                })
                this.$emit('refresh')
                this.handleDialog()
              } else {
                this.$message({
                  type: 'error',
                  message: data.msg
                })
              }
            })
        }
      }
    },
    // 搜索
    search (start = 0) {
      if (this.searchValue === '') {
        if (this.searchType === 1) {
          if (this.value === null) {
            this.getUserToGroupInfo(this.groupID, 1, 0, 'all', this.pageSize, start)
          } else {
            this.getUserToGroupInfo(this.groupID, 1, this.value, 'all', this.pageSize, start)
          }
        } else {
          if (this.value === null) {
            this.getUserToGroupInfo(this.userID, 0, 0, 'all', this.pageSize, start)
          } else {
            this.getUserToGroupInfo(this.userID, 0, this.value, 'all', this.pageSize, start)
          }
        }
      } else {
        if (this.searchType === 1) {
          if (this.value === null) {
            this.getUserToGroupInfo(this.groupID, 1, 0, this.searchValue, this.pageSize, start)
          } else {
            this.getUserToGroupInfo(this.groupID, 1, this.value, this.searchValue, this.pageSize, start)
          }
        } else {
          if (this.value === null) {
            this.getUserToGroupInfo(this.userID, 0, 0, this.searchValue, this.pageSize, start)
          } else {
            this.getUserToGroupInfo(this.userID, 0, this.value, this.searchValue, this.pageSize, start)
          }
        }
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
