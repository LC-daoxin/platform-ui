<template>
  <div class="process">
    <!-- 控制栏 start -->
    <div class="bar">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-input placeholder="节点名称" v-model="nodeName" size="mini"/>
        </el-col>
        <el-col :span="6">
          <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="addNode">添加</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 控制栏 end -->
    <!-- 用户修改table start -->
    <el-table
      size="mini"
      :data="tableData"
      border
      highlight-current-row
      class="table"
    >
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column label="名称" min-width="110" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input v-model="scope.row.nodeName" size="mini" />
          </template>
          <span v-else>{{ scope.row.nodeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" min-width="90" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.nodeGroupType | Type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.edit" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)">编辑</el-button>
          <el-button v-if="!scope.row.edit" size="mini" type="danger" icon="el-icon-delete" @click="deleteNode(scope.row)">删除</el-button>
          <el-button v-if="scope.row.edit" type="success" size="mini" @click="saveEdit(scope.row)">保存</el-button>
          <el-button v-if="scope.row.edit" type="primary" plain size="mini" @click="cancelEdit(scope.row)">取消</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 用户修改table end -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'user-modify',
  data () {
    return {
      tableData: [],
      nodeName: '',
      tempArr: { // 临时存放row 原数据
        nodeName: '',
        nodeGroupType: ''
      }
    }
  },
  computed: {
    ...mapState('sysStore/processConfig', [
      'configDate'
    ])
  },
  filters: {
    Type (Type) {
      if (Type === 1) {
        return '单向节点'
      } else if (Type === 2) {
        return '会签节点'
      }
    }
  },
  methods: {
    init () {
      this.getNode()
    },
    // 根据策略（processConfig）获取节点接口 用户修改
    getNode () {
      this.axios_M4.get(`/node/ByProcessConfig/UserModify/${this.configDate.processConfigID}`)
        .then(res => {
          console.log('用户修改', res.data)
          let data = res.data
          if (data.code === 'success') {
            let addEditData = data.data
            if (addEditData.length > 0) {
              addEditData.forEach((row) => {
                row.edit = false
              })
            }
            this.tableData = addEditData
          }
        })
    },
    // 新增用户修改节点
    addNode () {
      if (this.nodeName === '') {
        this.$message({
          type: 'warning',
          message: '请填写要添加的节点名称！'
        })
      } else {
        let data = {
          processConfigID: this.configDate.processConfigID, // 策略id
          nodeActivityID: null, // 活动Id
          nodeName: this.nodeName,
          nodeOrder: this.tableData.length + 1, // 节点排序
          nodeGroupType: 1, // 节点类型 1.单项节点 2.会签节点
          parentNodeID: 0, // 父节点Id
          precedingRuleExpression: null, // 前置表达式
          endRuleExpression: null // 后置表达式
        }
        this.axios_M4.post(`/node/UserModify/`, data).then((res) => {
          if (res.data.code === 'success') {
            this.$message({
              type: 'success',
              message: '新增成功'
            })
            this.nodeName = ''
            this.getNode() // 刷新table
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    // 编辑
    edit (row) {
      row.edit = true
      this.tempArr.nodeName = row.nodeName
      this.tempArr.nodeGroupType = row.nodeGroupType
    },
    // 保存编辑
    saveEdit (row) {
      let data = {
        nodeId: row.nodeId,
        processConfigID: row.processConfigID,
        nodeActivityID: row.nodeActivityID,
        nodeName: row.nodeName,
        nodeOrder: row.nodeOrder,
        nodeGroupType: row.nodeGroupType,
        parentNodeID: row.parentNodeID,
        precedingRuleExpression: row.precedingRuleExpression,
        endRuleExpression: row.endRuleExpression
      }
      this.updateNode(data)
      row.edit = false
    },
    // 取消编辑
    cancelEdit (row) {
      row.nodeName = this.tempArr.nodeName
      row.nodeGroupType = this.tempArr.nodeGroupType
      row.edit = false
    },
    // 调用更新接口 api
    updateNode (data) {
      this.axios_M4.put('/node/', data)
        .then((res) => {
          if (res.data.code === 'success') {
            this.getNode() // 列表刷新
            this.$message({
              type: 'success',
              message: res.data.msg
            })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 删除节点
    deleteNode (row) {
      this.$confirm(`确定要删除选择的用户修改节点?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios_M4.delete(`/node/${row.nodeId}`)
          .then((res) => {
            if (res.data.code === 'success') {
              this.getNode() // 刷新
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
  }
}
</script>

<style lang="scss" scoped>
.process {
  // padding: 8px;
  .bar:not(:first-child) {
    margin-top: 5px;
  }
  .table {
    margin-top: 5px;
    ::v-deep .el-table-column--selection .cell{
      padding-right: 10px;
    }
    ::v-deep .el-button--mini {
      padding: 4px 8px;
    }
    .active {
      color: green;
      margin-right: 5px;
    }
    .btn-l {
      margin-left: 5px;
    }
  }
}
</style>
