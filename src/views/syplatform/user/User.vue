<template>
  <sy-container>
    <div class="user">
      <!-- 控制栏 start -->
      <div class="bar">
        <el-row>
          <el-col :span="12">
            <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="openDialog('AddUser')">添加</el-button>
            <el-button class="filter-item" type="primary" size="mini" icon="el-icon-minus" @click="deleteRecord(multipleSelection)">删除</el-button>
            <el-button class="filter-item" type="primary" size="mini" icon="el-icon-lock" @click="lock(multipleSelection)">锁定</el-button>
            <el-button class="filter-item" type="primary" size="mini" icon="el-icon-unlock" @click="lock(multipleSelection, true)">解锁</el-button>
          </el-col>
          <el-col :span="12">
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
        v-loading="loading"
        size="mini"
        :data="tableData"
        border
        highlight-current-row
        @selection-change="handleSelectionChange"
        class="table"
      >
        <el-table-column
          type="selection"
          align="center"
          width="35">
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
        <el-table-column label="所处组" min-width="100" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.GROUP }}</span>
          </template>
        </el-table-column>
        <el-table-column label="有效期自" min-width="100" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.STARTTIME }}</span>
          </template>
        </el-table-column>
        <el-table-column label="有效期至" min-width="100" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.ENDTIME }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="120" align="center">
          <template slot-scope="scope">
            <div>
              <el-tag size="small" :type="scope.row.ENABLE ? 'success' : 'info'">{{ scope.row.ENABLE | Status }}</el-tag>
              <el-button v-if="scope.row.ENABLE" size="mini" type="danger" class="lock" @click="lock(scope.row.ID)">{{ scope.row.ENABLE | Lock }}</el-button>
              <el-button v-else size="mini" type="success" class="lock" @click="lock(scope.row.ID, true)">{{ scope.row.ENABLE | Lock }}</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="编辑" min-width="130" align="center">
          <template slot-scope="scope">
            <div>
              <el-button size="mini" type="primary" @click="handleDetail(scope.row)">细节</el-button>
              <el-button size="mini" type="primary" @click="handleTime(scope.row)">有效期</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="" min-width="60" align="center">
          <template slot-scope="scope">
            <div>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRecord(scope.row.ID)"></el-button>
            </div>
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
      <!-- 用户细节-弹窗 -->
      <detail-dialog
        @showDialog="closeDialog"
        :dialogDetailVisible="dialogDetailVisible"
        :Info="Info"
      />
      <!-- 用户细节-弹窗 -->
      <!-- 有效期-弹窗 -->
      <valid-time-dialog
        @showDialog="closeDialog"
        :dialogTimeVisible="dialogTimeVisible"
        :Info="Info"
        :timeBtnType="timeBtnType"
        @refreshTable="refreshList"
      />
      <!-- 有效期-弹窗 -->
      <!-- 添加用户-弹窗 -->
      <add-user-dialog
        @showDialog="closeDialog"
        :dialogAddUserVisible="dialogAddUserVisible"
        ref="AddUser"
      />
      <!-- 添加用户-弹窗 -->
    </div>
  </sy-container>
</template>

<script>
import DetailDialog from './components/DetailDialog'
import ValidTimeDialog from './components/ValidTimeDialog'
import AddUserDialog from './components/AddUserDialog'
export default {
  name: 'user',
  components: {
    ValidTimeDialog,
    DetailDialog,
    AddUserDialog
  },
  data () {
    return {
      options: [{
        value: 'name',
        label: '用户名'
      }, {
        value: 'account',
        label: '账号'
      }, {
        value: 'email',
        label: '邮箱'
      }, {
        value: 'group',
        label: '所处组'
      }],
      value: 'name',
      searchValue: '', // 搜索内容
      tableData: [],
      currentPage: 1, // 当前页码
      pageSize: 20, // 页条数
      totalCount: null, // 总条数
      dialogDetailVisible: false, // 弹窗 用户细节 默认关闭
      dialogTimeVisible: false, // 弹窗 有效期 默认关闭
      dialogAddUserVisible: false, // 弹窗 添加用户 默认关闭
      Info: {}, // 当前行的细节信息
      loading: false,
      multipleSelection: '', // 多选集合
      timeBtnType: 1 //  有效期确认按钮（1：添加有效期 2：添加用户）
    }
  },
  mounted () {
    this.getUesrInfo()
  },
  methods: {
    // 获取用户数据
    getUesrInfo (type = 'all', name = 'all', limit = 20, start = 0) {
      this.loading = true
      this.axios.get(`/user/userAllQuery/${type}/${name}/${limit}/${start}`)
        .then(this.getInfoSucc)
    },
    // 成功获取数据
    getInfoSucc (res) {
      this.loading = true
      let data = res.data
      if (data.code === 'success') {
        this.tableData = data.data // 用户table
        this.totalCount = data.total // 总条数
        this.pageSize = data.pagesize // 页条数
        this.currentPage = data.pageNum // 当前页码
        this.loading = false
      }
    },
    // 用户数据查询
    search (start = 0) {
      if (this.searchValue === '') {
        this.getUesrInfo('all', 'all', this.pageSize, start)
      } else {
        this.getUesrInfo(this.value, this.searchValue, this.pageSize, start)
      }
    },
    // 刷新
    refresh () {
      this.searchValue = '' // 清空搜索
      this.getUesrInfo()
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
    // 细节
    handleDetail (row) {
      this.Info = Object.assign({}, row)
      this.openDialog('Detail')
    },
    // 有效期
    handleTime (row, timeBtnType = 1) {
      this.Info = Object.assign({}, row)
      this.timeBtnType = timeBtnType
      this.openDialog('Time')
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
    // 锁定 或 解锁 （批量）
    lock (ID, enable = false) {
      if (ID === '') {
        this.$message({
          type: 'warning',
          message: '请选择用户！'
        })
      } else {
        let enableStr = ''
        if (enable) {
          enableStr = '锁定'
        } else {
          enableStr = '解锁'
        }
        this.$confirm(`确定要${enableStr}选择的用户?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(`/user/${enable}/${ID}`)
          this.axios.post(`/user/${enable}/${ID}`)
            .then((res) => {
              if (res.data.code === 'success') {
                this.refresh() // 刷新
                this.$message({
                  type: 'success',
                  message: `已${enableStr}`
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
    // 删除 或 批量删除
    deleteRecord (ID) {
      if (ID === '') {
        this.$message({
          type: 'warning',
          message: '请选择用户！'
        })
      } else {
        this.$confirm(`确定要删除选择的用户?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete(`/user/${ID}`)
            .then((res) => {
              if (res.data.code === 'success') {
                this.refresh() // 刷新
                this.$message({
                  type: 'success',
                  message: '已删除'
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
    // 刷新LDAP Table
    refreshList () {
      this.$refs.AddUser.getldapUserInfo()
    },
    // 打开对话框
    openDialog (name) {
      switch (name) {
        case 'Detail':
          this.dialogDetailVisible = true
          break
        case 'Time':
          this.dialogTimeVisible = true
          break
        case 'AddUser':
          this.dialogAddUserVisible = true
          break
      }
    },
    // 关闭对话框
    closeDialog (name) {
      switch (name) {
        case 'Detail':
          this.dialogDetailVisible = false
          break
        case 'Time':
          this.dialogTimeVisible = false
          break
        case 'AddUser':
          this.dialogAddUserVisible = false
          break
      }
    }
  },
  filters: {
    Status (dataStr) {
      return dataStr ? '活动' : '禁止'
    },
    Lock (dataStr) {
      return dataStr ? '锁定' : '解锁'
    }
  }
}
</script>

<style lang="scss" scoped>
.user {
  padding: 8px;
  .table {
    margin-top: 5px;
    ::v-deep .el-table-column--selection .cell{
      padding-right: 10px;
    }
    ::v-deep .el-button--mini {
      padding: 5px 8px;
      vertical-align: top;
    }
    .lock {
      margin-left: 5px;
    }
    .btn-l {
      margin-left: 5px;
    }
  }
}
</style>
