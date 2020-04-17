<template>
  <el-table :data="tableData" :height="tableHeight" size="mini" border>
    <el-table-column label="代理授予对象" prop="toUserName" align="center">
    </el-table-column>
    <el-table-column label="代理时间" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.startDate }} - {{ scope.row.endDate }}</span>
      </template>
    </el-table-column>
    <el-table-column label="授权流程" prop="processName" align="center"></el-table-column>
    <el-table-column label="状态" align="center">
      <template slot-scope="scope">
        <span>{{ checkStatus(scope.row.status) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="描述" prop="remark" align="center"></el-table-column>
    <el-table-column label="操作" align="center">
      <template slot-scope="scope">
        <el-button type="primary" @click="handleEdit(scope.row.processID)">编辑</el-button>
        <el-button type="danger" @click="handleDelete(scope.row.processID)">删除</el-button>
        <el-button type="warning" v-show="scope.row.status === 0" @click="delegationSettings(scope.row.processID, 3)">禁用</el-button>
        <el-button type="success" v-show="scope.row.status === 1" @click="delegationSettings(scope.row.processID, 1)">启用</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    tableData: Array
  },
  data () {
    return {
      tableHeight: window.innerHeight - this.$parent.$children[0].$el.offsetHeight - 217
    }
  },
  methods: {
    checkStatus (status) {
      switch (status) {
        case 0:
          return '未生效'
        case 1:
          return '已生效'
        case 2:
          return '已过期'
        default:
          return '已禁用'
      }
    },
    handleEdit (processID) {
      this.$emit('edit', '编辑', processID)
    },
    handleDelete (processID) {
      this.axios_M4.delete(`/delegationSettings/${processID}`)
        .then(res => {
          res = res.data
          if (res.code === 'success') {
            this.$message.success('删除成功')
          } else {
            this.$message.warning(res.msg)
          }
        })
    },
    delegationSettings (id, status) {
      this.axios_M4.put(`/delegationSettings/${id}/${status}`)
        .then(res => {
          res = res.data
          if (res.code === 'success') {
            this.$message.success('操作成功')
          } else {
            this.$message.warning(res.msg)
          }
        })
    },
    enabled () {}
  }
}
</script>
