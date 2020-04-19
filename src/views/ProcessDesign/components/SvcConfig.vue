<template>
  <div>
    <!-- 控制栏 start -->
    <div class="bar">
      <el-row>
        <el-col :span="12">
          <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="openDialog">添加</el-button>
          <!--<el-button class="filter-item" type="danger" size="mini" icon="el-icon-delete" @click="deleteNodeSvc(multipleSelection)">批量删除</el-button>-->
        </el-col>
      </el-row>
    </div>
    <!-- 控制栏 end -->
    <el-table
      size="mini"
      class="table"
      :data="tableData"
      @selection-change="handleSelectionChange"
      border
    >
      <el-table-column
        type="selection"
        align="center"
        width="45">
      </el-table-column>
      <el-table-column label="服务名称" align="center" min-width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.bizSvcName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务类型" align="center" min-width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.bizType | Type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="方法名称" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.bizSvcMethodName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" min-width="80">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status ? 'success' : 'danger'" size="mini">{{ scope.row.status | Status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteNodeSvc(scope.row.svcConfigId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 查看服务方法-弹窗 -->
    <get-scv
      @showDialog="closeDialog"
      @addNodeSvc="addNodeSvc"
      :dialogScvVisible="dialogScvVisible"
    />
    <!-- 查看服务方法-弹窗 -->
  </div>
</template>

<script>
import GetScv from './GetScv'
export default {
  components: {
    GetScv
  },
  data () {
    return {
      tableData: [],
      dialogScvVisible: false,
      node: null,
      Type: null, // 变量设置 服务类型 1: Process 2: ProcessBase 3.:Node 4: Email
      loading: false,
      multipleSelection: '' // 多选
    }
  },
  filters: {
    Status (dataStr) {
      return dataStr ? '启用' : '禁用'
    },
    Type (type) {
      if (type === '1') {
        return 'Process'
      } else if (type === '2') {
        return 'ProcessBase'
      } else if (type === '3') {
        return 'Node'
      } else if (type === '4') {
        return 'Email'
      }
    }
  },
  methods: {
    init (Type, node) {
      this.node = node
      this.Type = Type
      this.querySvcConfig(Type, node.nodeId)
    },
    // 获取关联集成服务列表
    querySvcConfig (bizType, id) {
      this.loading = true
      this.axios_M4.get(`/svcconfig/${bizType}/${id}`)
        .then(this.getInfoSucc)
    },
    getInfoSucc (res) {
      let data = res.data
      console.log('集成服务列表:', data)
      if (data.code === 'success') {
        this.tableData = data.data
        this.loading = false
      }
    },
    // 添加关联接口
    addNodeSvc (data) {
      let param = {
        bizId: this.node.nodeId,
        bizSvcId: data.bizSvcId,
        bizSvcMethodId: data.bizSvcMethodId,
        bizSvcMethodName: data.bizSvcMethodName,
        bizSvcName: data.bizSvcName,
        bizType: this.Type
      }
      console.log(param)
      this.axios_M4.post(`/svcconfig/`, param).then((res) => {
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
        this.closeDialog()
        this.$emit('updateSvc') // 更新节点字段
        this.querySvcConfig(this.Type, this.node.nodeId)
      }).catch((err) => {
        console.log(err)
      })
    },
    // 删除
    deleteNodeSvc (ID) {
      if (ID === '') {
        this.$message({
          type: 'warning',
          message: '请选择要删除的关联关系,可多选'
        })
      } else {
        this.$confirm(`确定要删除选择的关联关系?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios_M4.delete(`/svcconfig/${ID}`)
            .then((res) => {
              if (res.data.code === 'success') {
                this.querySvcConfig(this.Type, this.node.nodeId) // 刷新
                this.$message({
                  type: 'success',
                  message: '已删除'
                })
                this.$emit('updateSvc') // 更新节点字段
                this.multipleSelection = ''
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
    // 多选
    handleSelectionChange (val) {
      let Str = ''
      val.forEach((el) => {
        Str += el.svcConfigId + ','
      })
      Str = Str.substring(0, Str.length - 1)
      this.multipleSelection = Str
    },
    // 打开添加
    openDialog () {
      if (this.tableData.length === 1) {
        this.$message({
          type: 'warning',
          message: '只允许添加一个方法，请先删除原方法'
        })
      } else {
        this.dialogScvVisible = true
      }
    },
    // 关闭添加
    closeDialog () {
      this.dialogScvVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  ::v-deep .el-button--mini {
    padding: 5px 8px;
    vertical-align: top;
  }
}
::v-deep .el-table-column--selection .cell{
  padding-right: 10px;
}
.bar {
  margin-bottom: 10px;
}
.input {
  width: 270px;
}
.box-card {
  ::v-deep .el-card__body {
    padding: 5px 15px 15px;
  }
  .footer {
    margin-top: 15px;
    .col {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
