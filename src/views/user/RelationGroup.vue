<template>
  <el-container class="user-group">
    <el-aside width="25%" class="page-left">
      <!-- 用户组Tree -->
      <group-tree
        @getGroup="getGroup"
      />
      <!-- 用户组Tree -->
    </el-aside>
    <el-main>
      <div class="user">
        <!-- 控制栏 start -->
        <div class="bar">
          <el-row>
            <el-col :span="8">
              <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="AddUserToGroupVisible = true">添加</el-button>
              <el-button class="filter-item" type="danger" size="mini" icon="el-icon-minus" @click="deleteRecord(multipleSelection)">删除</el-button>
            </el-col>
            <el-col :span="16">
              <el-row type="flex" :gutter="5" justify="end">
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
        <!-- 用户table start -->
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
          <el-table-column label="账号" min-width="80" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.ACCOUNT }}</span>
            </template>
          </el-table-column>
          <el-table-column label="用户名" min-width="80" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.NAME }}</span>
            </template>
          </el-table-column>
          <el-table-column label="显示名称" min-width="140" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.DISNAME }}</span>
            </template>
          </el-table-column>
          <el-table-column label="邮箱" min-width="100" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.EMAIL }}</span>
            </template>
          </el-table-column>
          <el-table-column label="电话" min-width="90" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.TELPHONE }}</span>
            </template>
          </el-table-column>
          <el-table-column label="" min-width="65" align="center">
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRecord(scope.row.ID)"></el-button>
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
      </div>
    </el-main>
    <!-- 添加非用户组 -->
    <add-user-to-group
      :AddUserToGroupVisible="AddUserToGroupVisible"
      @showDialog="closeDialog"
      :ID="parentID"
      @refresh="refresh"
    />
    <!-- 添加非用户组 -->
  </el-container>
</template>

<script>
import GroupTree from './components/GroupTree'
import AddUserToGroup from './components/AddUserToGroup'
export default {
  name: 'relation-group',
  components: {
    GroupTree,
    AddUserToGroup
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
      parentID: 10, // 父级ID 默认0
      currentGroupID: '', // 当前选择的用户组ID
      loading: false,
      multipleSelection: '', // 多选
      AddUserToGroupVisible: false // 添加非用户组 默认关闭
    }
  },
  mounted () {
    this.getGroupInfo()
  },
  methods: {
    // Tree回调
    getGroup (id) {
      this.parentID = id // 父节点ID
      this.currentGroupID = id // 当前选择用户组ID
      this.getGroupInfo(id)
    },
    // 当前用户组下用户查询
    search (start = 0) {
      if (this.searchValue === '') {
        this.getGroupInfo(this.parentID, 'all', 'all', this.pageSize, start)
      } else {
        this.getGroupInfo(this.parentID, this.value, this.searchValue, this.pageSize, start)
      }
    },
    // 刷新
    refresh () {
      this.searchValue = '' // 清空搜索
      this.getGroupInfo(this.parentID)
    },
    // 获取用户组下用户table 组用户查询接口
    getGroupInfo (groupId = 10, type = 'all', name = 'all', limit = 20, start = 0) {
      this.loading = true
      this.axios.get(`/group/groupChildUserQuery/${groupId}/${type}/${name}/${limit}/${start}`)
        .then((res) => {
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
        Str += el.ID + ','
      })
      Str = Str.substring(0, Str.length - 1)
      this.multipleSelection = Str
    },
    // 删除用户组下用户
    deleteRecord (ID) {
      if (ID === '') {
        this.$message({
          type: 'warning',
          message: '请选择用户组！'
        })
      } else {
        this.$confirm('确定要删除选中的用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete(`/group/deleteUserToGroup/${this.parentID}/${ID}`)
            .then((res) => {
              if (res.data.code === 'success') {
                this.refresh() // 刷新
                this.$message({
                  type: 'success',
                  message: res.data.msg
                })
              }
            })
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
        case 'AddUserToGroup':
          this.AddUserToGroupVisible = false
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
.user-group {
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
    }
  }
}
</style>
