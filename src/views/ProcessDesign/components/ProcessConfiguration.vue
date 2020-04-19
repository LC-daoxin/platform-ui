<template>
  <div class="process">
    <!-- 功能调用table start -->
    <el-table
      size="mini"
      :data="tableData"
      border
      highlight-current-row
      class="table"
    >
      <el-table-column label="功能名称" min-width="130" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.featureName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="70" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div v-if="!scope.row.Edit">
            <span v-if="scope.row.featureType !== 'Bool'">{{ scope.row.featureValue }}</span>
            <el-tag v-else size="small" :type="scope.row.featureValue ? 'success' : 'info'">{{ scope.row.featureValue ? 'True' : 'False' }}</el-tag>
          </div>
          <div v-else>
            <el-input  v-if="scope.row.featureType !== 'Bool'" class="input" size="mini" v-model="scope.row.featureValue"></el-input>
            <el-switch v-else v-model="scope.row.featureValue"></el-switch>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="80" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.Edit" type="primary" size="mini" icon="el-icon-edit" @click="edit(scope.row)">编辑</el-button>
          <div v-else>
            <el-button type="success" size="mini" icon="el-icon-s-claim" @click="save(scope.row)">保存</el-button>
            <el-button size="mini" icon="el-icon-circle-close" @click="cancel(scope.row)">取消</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 功能调用table end -->
  </div>
</template>

<script>
export default {
  name: 'process-configuration',
  props: {
    Type: String
  },
  data () {
    return {
      tableData: [],
      tempData: '', // 临时存储
      currentData: null
    }
  },
  methods: {
    init (data) {
      this.currentData = data
      let id
      if (this.Type === 'node') {
        id = data.nodeId
      } else if (this.Type === 'process') {
        id = data.ProcessID
      }
      this.axios_M4.get(`/featureconfig/${this.Type}/${id}`)
        .then(res => {
          console.log('流程功能调用', res)
          let data = res.data
          if (data.code === 'success') {
            let arr = data.data
            if (arr.length > 0) {
              arr.forEach((row) => {
                row.Edit = false
                if (row.featureType === 'Bool') {
                  // eslint-disable-next-line
                  row.featureValue = eval(row.featureValue.toLowerCase())
                }
              })
            }
            this.tableData = arr
          }
        })
    },
    // 编辑
    edit (row) {
      row.Edit = true
      this.tempData = row.featureValue
    },
    // 保存
    save (row) {
      let data = {
        featureConfigId: row.featureConfigId,
        featureValue: row.featureValue
      }
      console.log(data)
      this.axios_M4.put(`/featureconfig/updateFeatureValue`, data)
        .then(res => {
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
          this.init(this.currentData) // 刷新列表
          row.Edit = false
        })
    },
    // 取消
    cancel (row) {
      row.featureValue = this.tempData
      this.tempData = '' // 清空
      row.Edit = false
    }
  }
}
</script>

<style lang="scss" scoped>
.process {
  padding-bottom: 10px;
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
