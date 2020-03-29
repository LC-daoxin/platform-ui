<template>
  <el-container class="user-permisson">
      <el-aside width="25%" class="page-left">
        <!-- 用户组Tree -->
        <group-user-tree
          @getGroupRow="getGroupRow"
        />
        <!-- 用户组Tree -->
      </el-aside>
      <el-main>
        <div class="user">
          <!-- 控制栏 start -->
          <div class="bar">
            <el-row>
              <el-col :span="9">
                <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="AddUserPermissionVisible = true">添加</el-button>
                <el-button class="filter-item" type="danger" size="mini" icon="el-icon-minus" @click="deleteRecord(multipleSelection)">删除</el-button>
              </el-col>
              <el-col :span="15">
                <el-row type="flex" :gutter="5" justify="end">
                  <el-col :span="7">
                    <el-select v-model="value" placeholder="请选择" size="mini">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="7">
                    <el-input placeholder="搜索..." v-model="searchValue" size="mini"/>
                  </el-col>
                  <el-col :span="10">
                    <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="search()">查询</el-button>
                    <el-button class="filter-item" type="primary" size="mini" icon="el-icon-refresh" @click="refresh()">刷新</el-button>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
          <!-- 控制栏 end -->
          <!-- table start -->
          <el-table
            size="mini"
            :data="tableData"
            border
            highlight-current-row
            v-loading="loading"
            @selection-change="handleSelectionChange"
            class="table"
          >
            <el-table-column
              type="selection"
              align="center"
              width="35">
            </el-table-column>
            <el-table-column label="系统" min-width="80" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{ scope.row.SYSTEMCODE }}</span>
              </template>
            </el-table-column>
            <el-table-column label="角色名称" min-width="120" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{ scope.row.ROLENAME }}</span>
              </template>
            </el-table-column>
            <el-table-column label="角色描述" min-width="140" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{ scope.row.ROLEDESC }}</span>
              </template>
            </el-table-column>
            <el-table-column label="来源" min-width="100" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span v-if="scope.row.EXTENT === 0"><span class="textSY">私有</span></span>
                <span v-if="scope.row.EXTENT === 1"><span class="textJC">继承</span>（{{ scope.row.FROM }}）</span>
              </template>
            </el-table-column>
          </el-table>
          <!-- table end -->
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
        </div>
      </el-main>
      <!-- 授权用户权限 -->
      <add-user-permission
        :AddUserPermissionVisible="AddUserPermissionVisible"
        @showDialog="closeDialog"
        :searchType="searchType"
        :userID="currentUserID"
        :groupID="currentGroupID"
        @refresh="refresh"
      />
      <!-- 授权用户权限 -->
    </el-container>
</template>

<script>
import GroupUserTree from './components/GroupUserTree'
import AddUserPermission from './components/AddUserPermission'
export default {
  name: 'user-permisson',
  components: {
    GroupUserTree,
    AddUserPermission
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
      parentID: 10, // 父级ID 默认0
      currentGroupID: 10, // 当前选择的用户组ID
      currentUserID: '', // 当前选择的用户ID
      loading: false,
      multipleSelection: '', // 多选
      AddUserPermissionVisible: false, //  授权用户权限 默认关闭
      searchType: 1 // 默认 1 （1标示组搜索 2标示用户搜索）
    }
  },
  mounted () {
    this.getGroupInfo()
    this.querySysAll()
  },
  methods: {
    // Tree回调
    getGroupRow (row) {
      if (row.isgroup === 1) {
        this.searchType = 1
      } else {
        this.searchType = 2
      }
      this.parentID = row.id.split('_')[2] // 父节点ID
      this.currentGroupID = row.id.split('_')[2] // 当前选择用户组ID
      if (this.searchType === 2) {
        this.currentUserID = row.id.split('_')[3] // 当前选择用户组ID
        this.getGroupInfo(this.currentUserID)
      } else {
        this.getGroupInfo(this.currentGroupID)
      }
    },
    // 获取所有系统列表
    querySysAll () {
      this.axios_M2.get('/system/querySysAll')
        .then((res) => {
          if (res.data.code === 'success') {
            this.options = res.data.data
          }
        })
    },
    // 当前用户组下用户查询
    search (start = 0) {
      let ID = this.searchType === 1 ? this.currentGroupID : this.currentUserID
      if (this.searchValue === '') {
        this.getGroupInfo(ID, 0, 'all', this.pageSize, start)
      } else {
        if (this.value === null) {
          this.getGroupInfo(ID, 0, this.searchValue, this.pageSize, start)
        } else {
          this.getGroupInfo(ID, this.value, this.searchValue, this.pageSize, start)
        }
      }
    },
    // 刷新
    refresh () {
      this.searchValue = '' // 清空搜索
      this.value = null
      this.getGroupInfo()
    },
    // 获取用户组或用户下角色table
    getGroupInfo (Id = 10, systemId = 0, queryName = 'all', limit = 20, start = 0) {
      this.loading = true
      if (this.searchType === 1) {
        console.log(`/role/findGroupRole/${Id}/${systemId}/${queryName}/${limit}/${start}`)
        this.axios_M2.get(`/role/findGroupRole/${Id}/${systemId}/${queryName}/${limit}/${start}`)
          .then((res) => {
            console.log(res)
            if (res.data.code === 'success') {
              let data = res.data
              let addEditData = data.data
              if (addEditData.length > 0) {
                addEditData.forEach((row) => {
                  row.edit = false
                })
              }
              this.tableData = addEditData
              this.totalCount = data.total // 总条数
              this.pageSize = data.pagesize // 页条数
              this.currentPage = data.pageNum // 当前页码
              this.loading = false
            }
          })
      } else if (this.searchType === 2) {
        console.log(`/role/findUserRole/${Id}/${systemId}/${queryName}/${limit}/${start}`)
        this.axios_M2.get(`/role/findUserRole/${Id}/${systemId}/${queryName}/${limit}/${start}`)
          .then((res) => {
            console.log(res)
            if (res.data.code === 'success') {
              let data = res.data
              let addEditData = data.data
              if (addEditData.length > 0) {
                addEditData.forEach((row) => {
                  row.edit = false
                })
              }
              this.tableData = addEditData
              this.totalCount = data.total // 总条数
              this.pageSize = data.pagesize // 页条数
              this.currentPage = data.pageNum // 当前页码
              this.loading = false
            }
          })
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
      let Str = ''
      val.forEach((el) => {
        Str += el.ROLEID + ','
      })
      Str = Str.substring(0, Str.length - 1)
      this.multipleSelection = Str
    },
    // 删除用户组下用户
    deleteRecord (ID) {
      if (ID === '') {
        this.$message({
          type: 'warning',
          message: '请选择角色！'
        })
      } else {
        this.$confirm('确定要删除选中的角色?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.searchType === 1) {
            console.log(`/role/deleteGroupRole/${this.currentGroupID}/${ID}`)
            this.axios_M2.delete(`/role/deleteGroupRole/${this.currentGroupID}/${ID}`)
              .then((res) => {
                console.log(res)
                if (res.data.code === 'success') {
                  this.refresh() // 刷新
                  this.$message({
                    type: 'success',
                    message: res.data.msg
                  })
                }
              })
          } else if (this.searchType === 2) {
            console.log(`/role/deleteUserRole/${this.currentUserID}/${ID}`)
            this.axios_M2.delete(`/role/deleteUserRole/${this.currentUserID}/${ID}`)
              .then((res) => {
                console.log(res)
                if (res.data.code === 'success') {
                  this.refresh() // 刷新
                  this.$message({
                    type: 'success',
                    message: res.data.msg
                  })
                }
              })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    },
    // 关闭对话框
    closeDialog (name) {
      switch (name) {
        case 'UserPermission':
          this.AddUserPermissionVisible = false
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-button+.el-button {
  margin-left: 8px;
}
::v-deep .el-table-column--selection .cell{
  padding-right: 10px;
}
::v-deep .el-main {
  padding: 0;
}
.user-permisson {
  height: 100%;
  .page-left {
    height: 100%;
    border-right: 1px solid #eaecef;
  }
  .user {
    padding: 12px;
    .table {
      margin-top: 5px;
      ::v-deep .el-button--mini {
        padding: 5px 8px;
        vertical-align: top;
      }
      .textSY {
        color: #3bcb23;
        font-weight: bold;
      }
      .textJC {
        color: red;
        font-weight: bold;
      }
    }
  }
}
</style>
