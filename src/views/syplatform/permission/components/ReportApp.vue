<template>
  <div class="Administrator">
    <!-- 控制栏 start -->
    <div class="filter-container">
      <el-row>
        <el-col :span="24">
          <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="openApp()">新增应用</el-button>
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
      <el-table-column label="分类" min-width="70" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.CateName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应用名" min-width="110" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.AppName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据库" min-width="80" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.BizDataBase }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务表名" min-width="120" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.BizTable }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公司代码字段" min-width="80" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.BizCompanyField }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间字段" min-width="80" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.BizCreatedTimeField }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 管理员table end -->
    <!-- 新增应用-弹窗 -->
    <add-app
      @showDialog="closeDialog"
      :dialogAddAppVisible="dialogAddAppVisible"
    />
    <!-- 新增应用-弹窗 -->
  </div>
</template>

<script>
import AddApp from './AddApp'
export default {
  name: 'administrator',
  components: {
    AddApp
  },
  props: {
    currentCompanyID: [String, Number]
  },
  data () {
    return {
      tableData: [],
      multipleSelection: '', // 多选内容
      loading: false,
      dialogAddAppVisible: false // 新增应用 弹窗
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
    // 获取应用列表
    getInfo () {
      this.loading = true
      this.axios_M2.get(`/reportmanage/rptGroupAppList/${this.currentCompanyID}`)
        .then(this.getInfoSucc)
    },
    getInfoSucc (res) {
      console.log(res)
      let data = res.data
      if (data.code === 'success') {
        this.tableData = data.data // 应用table
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
    },
    // 打开 新增应用
    openApp () {
      this.dialogAddAppVisible = true
    },
    // 添加应用
    addApp (appId) {
      console.log(`/reportmanage/appToCompany/${this.currentCompanyID}/${appId}`)
      this.axios_M2.post(`/reportmanage/appToCompany/${this.currentCompanyID}/${appId}`).then((res) => {
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
            message: `应用ID为${appId}的应用${res.data.msg}`
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
          message: '请选择要删除的应用！'
        })
      } else {
        this.$confirm(`确定要删除选择的应用信息?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(`/reportmanage/userToCompany/${this.currentCompanyID}/${ID}`)
          this.axios_M2.delete(`/reportmanage/appToCompany/${this.currentCompanyID}/${ID}`)
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
      this.dialogAddAppVisible = false
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
