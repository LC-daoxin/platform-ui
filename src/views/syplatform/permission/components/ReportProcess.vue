<template>
  <div class="Administrator">
    <!-- 控制栏 start -->
    <div class="filter-container">
      <el-row>
        <el-col :span="24">
          <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="openProcess()">新增流程</el-button>
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
      <el-table-column label="流程类型" min-width="90" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.ProcessType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流程" min-width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.DisplayName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" min-width="120" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.FullName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属公司" min-width="80" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.CompanyCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流程状态" min-width="70" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.StatusDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否可用" min-width="70" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.IsEnableDesc }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 管理员table end -->
    <!-- 新增流程-弹窗 -->
    <add-process
      @showDialog="closeDialog"
      :dialogAddProcessVisible="dialogAddProcessVisible"
    />
    <!-- 新增流程-弹窗 -->
  </div>
</template>

<script>
import axios from 'axios'
import AddProcess from './AddProcess'
export default {
  name: 'administrator',
  components: {
    AddProcess
  },
  props: {
    currentCompanyID: [String, Number]
  },
  data () {
    return {
      tableData: [],
      multipleSelection: '', // 多选内容
      loading: false,
      dialogAddProcessVisible: false // 新增流程 弹窗
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
      axios.get('/api/Process6.json')
        .then(this.getInfoSucc)
      console.log(`/reportmanage/rptGroupProcessList/${this.currentCompanyID}`)
      // this.axios_M2.get(`/reportmanage/rptGroupProcessList/${this.currentCompanyID}`)
      //   .then(this.getInfoSucc)
    },
    getInfoSucc (res) {
      console.log(res)
      let data = res.data
      if (data.code === 'success') {
        this.tableData = data.data // 流程table
        this.loading = false
      }
    },
    // 多选
    handleSelectionChange (val) {
      let Str = ''
      val.forEach((el) => {
        Str += el.ProcessID + ','
      })
      Str = Str.substring(0, Str.length - 1)
      this.multipleSelection = Str
    },
    // 打开 新增管理员
    openProcess () {
      this.dialogAddProcessVisible = true
    },
    // 添加管理员
    addProcess (processId) {
      console.log(`/reportmanage/processToCompany/${this.currentCompanyID}/${processId}`)
      this.axios_M2.post(`/reportmanage/processToCompany/${this.currentCompanyID}/${processId}`).then((res) => {
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
          message: '请选择要删除的流程！'
        })
      } else {
        this.$confirm(`确定要删除选择的流程信息?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(`/reportmanage/processToCompany/${this.currentCompanyID}/${ID}`)
          this.axios_M2.delete(`/reportmanage/processToCompany/${this.currentCompanyID}/${ID}`)
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
      this.dialogAddProcessVisible = false
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
