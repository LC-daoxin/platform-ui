<template>
  <el-dialog
    title="配置流程权限"
    :visible.sync="dialogFlowVisible"
    :before-close='cancelSave'
    @open='open'
    width="780px"
  >
    <el-row type="flex" justify="center" align="middle">
      <el-col :span="11">
        <div class="content-box">
          <h3 class="tableTitle">菜单</h3>
          <div class="treeBox">
            <!-- 菜单Tree -->
            <flow-tree
              @getFlowRow="getFlowRow"
            />
            <!-- 菜单Tree -->
          </div>
        </div>
      </el-col>
      <el-col :span="2">
        <el-button class="btnRight" type="primary" icon="el-icon-arrow-right" size="mini"></el-button>
      </el-col>
      <el-col :span="11">
        <div class="content-box">
          <h3 class="tableTitle">已选流程</h3>
          <!-- 已选流程table start -->
          <el-table
            size="mini"
            :data="oldTableData"
            border
            highlight-current-row
            class="oldTable"
            height="450px"
            v-loading="loading2"
          >
            <el-table-column label="流程名称" min-width="160" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="60" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteID(scope.row.id)"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 已选流程table end -->
        </div>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="cancelSave()">取 消</el-button>
      <el-button size="mini" type="primary" @click="updateFlow()">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import FlowTree from './FlowTree'
export default {
  name: 'flow',
  components: {
    FlowTree
  },
  props: {
    currentRow: Object,
    flowType: String,
    dialogFlowVisible: {
      default: false
    }
  },
  data () {
    return {
      tableData: [],
      oldTableData: [],
      loading: false, // 加载
      loading2: false, // 加载
      oldIds: [], // 更新前的关联角色id
      newIds: [], // 更新后的关联角色id
      currentFlowID: '' // 当前选择流程ID
    }
  },
  methods: {
    // Tree回调
    getFlowRow (row) {
      this.addClickFlow(row)
      this.currentFlowID = row.id // 当前选择菜单ID
    },
    // 关闭对话框
    handleDialog () {
      this.$emit('showDialog', 'Flow')
    },
    // 打开对话框时，回调
    open () {
      if (this.currentRow) {
        this.getRoleFlowInfo(this.currentRow.ROLEID)
      }
    },
    // 获取当前角色流程关联列表
    getRoleFlowInfo (roleId) {
      this.loading2 = true
      this.axios_M2.get(`/permission/oldFlowCheck/${this.flowType}/${roleId}`)
        .then((res) => {
          console.log(res)
          let data = res.data
          if (data.code === 'success') {
            if (data.data.records.length > 0) {
              data.data.records.forEach((item) => {
                item.id = item.id.split('_')[1]
              })
            }
            this.oldTableData = data.data.records // 角色与用户组关联table
            if (data.data.oldIdList.split(',')[0] === '') {
              this.oldIds = []
            } else {
              this.oldIds = data.data.oldIdList.split(',')
            }
            this.loading2 = false
          }
        })
    },
    // 添加流程到关联列表
    addClickFlow (row) {
      console.log(row)
      let arr = this.oldTableData
      let hasID = false
      arr.forEach((item) => {
        if (item.id === row.id.split('_')[1]) {
          hasID = true
        }
      })
      if (!hasID) { // 已存在的关联系统不添加
        this.oldTableData.push({
          name: row.text,
          id: row.id.split('_')[1]
        })
      }
    },
    // 删除关联列表中的流程
    deleteID (id) {
      let arr = this.oldTableData
      arr.forEach((item, index) => {
        if (item.id === id) {
          this.oldTableData.splice(index, 1)
        }
      })
    },
    // 保存|更新 流程与角色新关联
    updateFlow () {
      this.newIds = [] // 清空new
      let arr = this.oldTableData
      arr.forEach((item) => {
        this.newIds.push(item.name.toString() + '&' + item.id.toString())
      })
      let data = {
        'newIds': this.newIds,
        'oldIds': this.oldIds
      }
      console.log(data)
      console.log(`/permission/FlowCheck/${this.flowType}/${this.currentRow.ROLEID}`)
      this.axios_M2.put(`/permission/FlowCheck/${this.flowType}/${this.currentRow.ROLEID}`, data)
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
        })
      this.handleDialog() // 关闭对话框
    },
    // 取消保存
    cancelSave () {
      this.handleDialog() // 关闭对话框
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 5px 20px;
}
.content-box {
  height: 500px;
  .treeBox {
    height: 480px;
    overflow: auto;
  }
  .tableTitle {
    height: 20px;
    margin-bottom: 10px;
    font-weight: bold;
  }
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
