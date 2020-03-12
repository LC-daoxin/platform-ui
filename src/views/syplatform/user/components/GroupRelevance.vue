<template>
  <el-dialog
    title="用户组-系统关联"
    :visible.sync="dialogRelevanceVisible"
    :before-close='cancelSave'
    @open='open'
    width="780px"
  >
    <el-row type="flex" justify="center" align="middle">
      <el-col :span="14">
        <h3 class="tableTitle">系统列表</h3>
        <!-- 用户组关联table start -->
        <el-table
          size="mini"
          :data="tableData"
          border
          highlight-current-row
          @row-click="addClickSystem"
          class="table"
          height="450px"
          v-loading="loading"
        >
          <el-table-column label="系统ID" min-width="100" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.systemCode }}</span>
            </template>
          </el-table-column>
          <el-table-column label="描述" min-width="300" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.text }}</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 用户组关联table end -->
      </el-col>
      <el-col :span="2">
        <el-button class="btnRight" type="primary" icon="el-icon-arrow-right" size="mini"></el-button>
      </el-col>
      <el-col :span="8">
        <h3 class="tableTitle">当前用户组已关联系统</h3>
        <!-- 用户组已关联系统table start -->
        <el-table
          size="mini"
          :data="oldTableData"
          border
          highlight-current-row
          class="oldTable"
          height="450px"
          v-loading="loading2"
        >
          <el-table-column label="系统ID" min-width="160" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.systemCode }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="60" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteID(scope.row.id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 用户组已关联系统table end -->
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="cancelSave()">取 消</el-button>
      <el-button size="mini" type="primary" @click="updateSystem()">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'group-relevance',
  props: {
    currentGroupID: [String, Number],
    dialogRelevanceVisible: {
      default: false
    }
  },
  data () {
    return {
      tableData: [],
      oldTableData: [],
      loading: false, // 加载
      loading2: false, // 加载
      oldIds: [], // 更新前的关联系统id
      newIds: [] // 更新后的关联系统id
    }
  },
  mounted () {
  },
  methods: {
    // 关闭对话框
    handleDialog () {
      this.$emit('showDialog', 'Relevance')
    },
    // 打开对话框时，回调
    open () {
      this.getSystemInfo()
      this.getOldInfo()
    },
    // 获取全部系统列表
    getSystemInfo () {
      this.loading = true
      this.axios.get(`/system/systemQueryByType/all/all`)
        .then((res) => {
          let data = res.data
          if (data.code === 'success') {
            this.tableData = data.data // ldap用户table
            this.loading = false
          }
        })
    },
    // 获取当前用户组现关联的系统列表
    getOldInfo () {
      this.loading2 = true
      this.axios.get(`/system/oldCheckedSystem/${this.currentGroupID}`)
        .then((res) => {
          let data = res.data
          if (data.code === 'success') {
            this.oldTableData = data.data // ldap用户table
            this.oldIds = [] // 清空old
            this.loading2 = false
            this.oldTableData.forEach((item) => {
              this.oldIds.push(item.id.toString())
            })
          }
        })
    },
    // 添加系统到用户组
    addClickSystem (row) {
      let arr = this.oldTableData
      let hasID = false
      arr.forEach((item) => {
        if (item.id === row.id) {
          hasID = true
        }
      })
      if (!hasID) { // 已存在的关联系统不添加
        this.oldTableData.push(row)
      }
    },
    // 删除用户组连接的系统
    deleteID (id) {
      let arr = this.oldTableData
      arr.forEach((item, index) => {
        if (item.id === id) {
          this.oldTableData.splice(index, 1)
        }
      })
    },
    // 保存|更新 用户组与系统新关联
    updateSystem () {
      this.newIds = [] // 清空new
      let arr = this.oldTableData
      arr.forEach((item) => {
        this.newIds.push(item.id.toString())
      })
      let data = {
        'newIds': this.newIds,
        'oldIds': this.oldIds
      }
      this.axios.post(`/system/systemCheck/${this.currentGroupID}`, data)
        .then((res) => {
          if (res.data.code === 'success') {
            this.$message({
              type: 'success',
              message: res.data.msg
            })
          }
        })
      this.handleDialog() // 关闭对话框
    },
    // 取消保存
    cancelSave () {
      this.$confirm(`尚未保存，是否继续取消？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleDialog() // 关闭对话框
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 5px 20px;
}
.tableTitle {
  margin-bottom: 10px;
  font-weight: bold;
}
.btnRight {
  margin: 0 auto;
  display: block;
}
.table {
  margin-top: 10px;
  ::v-deep .el-table-column--selection .cell{
    padding-right: 10px;
  }
}
.oldTable {
  ::v-deep .el-button--mini {
    padding: 5px 8px;
    vertical-align: top;
  }
}
</style>
