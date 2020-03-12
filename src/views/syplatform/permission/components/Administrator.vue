<template>
  <div class="Administrator">
    <!-- 控制栏 start -->
    <div class="filter-container">
      <el-row>
        <el-col :span="24">
          <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="addAdministrator()">新增管理员</el-button>
          <el-button class="filter-item" type="primary" size="mini" icon="el-icon-minus" @click="deleteRecord(multipleSelection)">删除</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 控制栏 end -->
    <!-- 管理员table start -->
    <el-table
      v-loading="loading"
      size="mini"
      :data="tableData"
      border
      highlight-current-row
      class="table"
      height="450px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        align="center"
        width="55">
      </el-table-column>
      <el-table-column label="账号" min-width="90" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.Account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="显示姓名" min-width="110" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.DIsplayName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" min-width="110" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.Email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" min-width="80" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.Mobile }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 管理员table end -->
    <!-- 新增管理员-弹窗 -->
    <add-admin
      @showDialog="closeDialog"
      :dialogAddAdminVisible="dialogAddAdminVisible"
    />
    <!-- 新增管理员-弹窗 -->
  </div>
</template>

<script>
import AddAdmin from './AddAdmin'
export default {
  name: 'administrator',
  components: {
    AddAdmin
  },
  props: {
    currentCompanyID: [String, Number]
  },
  data () {
    return {
      tableData: [],
      multipleSelection: '', // 多选内容
      loading: false,
      dialogAddAdminVisible: false // 新增管理员 弹窗
    }
  },
  mounted () {
    this.getInfo()
  },
  watch: {
    currentCompanyID () {
      this.getInfo()
    }
  },
  methods: {
    // 获取管理员列表
    getInfo () {
      this.loading = true
      this.axios_M2.get(`/reportmanage/rptGroupUserList/${this.currentCompanyID}`)
        .then(this.getInfoSucc)
    },
    getInfoSucc (res) {
      let data = res.data
      if (data.code === 'success') {
        this.tableData = data.data // 管理员table
        this.loading = false
      }
    },
    // 多选
    handleSelectionChange (val) {
      let Str = ''
      val.forEach((el) => {
        Str += el.ID + ','
      })
      Str = Str.substring(0, Str.length - 1)
      this.multipleSelection = Str
      console.log(this.multipleSelection)
    },
    // 新增管理员
    addAdministrator () {
      this.dialogAddAdminVisible = true
    },
    // 添加管理员
    addAdmin (userId) {
      this.axios_M2.post(`/reportmanage/userToCompany/${this.currentCompanyID}/${userId}`).then((res) => {
        console.log(res)
        if (res.data.code === 'success') {
          this.$message({
            type: 'success',
            message: '添加成功！'
          })
          this.refresh()
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 删除
    deleteRecord (ID) {
      if (ID === '') {
        this.$message({
          type: 'warning',
          message: '请选择要删除的管理员！'
        })
      } else {
        this.$confirm(`确定要删除选择的管理员信息?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(`/reportmanage/userToCompany/${this.currentCompanyID}/${ID}`)
          this.axios_M2.delete(`/reportmanage/userToCompany/${this.currentCompanyID}/${ID}`)
            .then((res) => {
              console.log(res)
              if (res.data.code === 'success') {
                this.$message({
                  type: 'success',
                  message: res.data.msg
                })
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.msg
                })
              }
              this.refresh() // 刷新
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    },
    // 刷新
    refresh () {
      this.getInfo()
    },
    // 关闭对话框
    closeDialog () {
      this.dialogAddAdminVisible = false
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
