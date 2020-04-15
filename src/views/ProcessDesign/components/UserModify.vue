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
          <span>{{ scope.row.nodeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" min-width="90" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.nodeGroupType | Type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100" align="center" :show-overflow-tooltip="true">
        <template>
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
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
      nodeName: ''
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
            this.tableData = data.data // table
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
        console.log(data)
        this.axios_M4.post(`/node/UserModify/`, data).then((res) => {
          if (res.data.code === 'success') {
            this.$message({
              type: 'success',
              message: '成功新增用户修改节点'
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
