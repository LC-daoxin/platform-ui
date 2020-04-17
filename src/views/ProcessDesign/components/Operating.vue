<template>
  <div>
    <!-- 控制栏 start -->
    <div v-if="showMail" class="bar">
      <el-row>
        <el-col :span="12">
          <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="openDialog">添加</el-button>
          <el-button class="filter-item" type="danger" size="mini" icon="el-icon-minus" @click="deleteNodeAction(multipleSelection)">删除</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 控制栏 end -->
    <el-table
      v-if="showMail"
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
      <el-table-column label="操作名称" align="center" min-width="100">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input v-model="scope.row.actionName" class="edit-input" size="mini" />
          </template>
          <span v-else>{{ scope.row.actionName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="自定义名称" align="center" min-width="100">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input v-model="scope.row.displayName" class="edit-input" size="mini" />
          </template>
          <span v-else>{{ scope.row.displayName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="启用状态" align="center" min-width="80">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isEnable ? 'success' : 'danger'" size="mini">{{ scope.row.isEnable | Status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="240">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.edit && scope.row.isEnable === 1" type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-button v-if="!scope.row.edit && scope.row.isEnable === 1" type="primary" size="mini" @click="mailEdit(scope.row)">配置邮件</el-button>
          <el-button v-if="!scope.row.edit && scope.row.isEnable === 1" type="danger" size="mini" @click="stop(scope.row)">禁用</el-button>
          <el-button v-if="scope.row.edit && scope.row.isEnable === 1" type="success" size="mini" @click="saveEdit(scope.row)">保存</el-button>
          <el-button v-if="scope.row.edit && scope.row.isEnable === 1" type="primary" plain size="mini" @click="cancelEdit(scope.row)">取消</el-button>
          <el-button v-if="scope.row.isEnable === 0" type="success" size="mini" @click="start(scope.row)">启用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-card class="box-card" v-if="!showMail">
      <notice ref="notice" mailCategory="3"/>
      <div class="footer">
        <el-row>
          <el-col :span="24" class="col">
            <el-button class="filter-item" size="mini" @click="closeMail" >返回</el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!-- 新增节点动作-弹窗 -->
    <el-dialog
      title="新增节点动作"
      :visible.sync="dialogActionVisible"
      append-to-body
      width="450px"
    >
      <el-form ref="ActionForm" :rules="ActionRules" :model="temp" label-width="110px">
        <el-form-item label="操作名称:" prop="actionName">
          <el-col :span="22">
            <el-input class="input" size="mini" v-model="temp.actionName" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="自定义名称:" prop="displayName">
          <el-col :span="22">
            <el-input class="input" size="mini" v-model="temp.displayName" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeDialog">取 消</el-button>
        <el-button size="mini" type="primary" @click="addNodeAction">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增节点动作-弹窗 -->
  </div>
</template>

<script>
import Notice from './Notice'
import { mapState } from 'vuex'
export default {
  components: {
    Notice
  },
  data () {
    return {
      tableData: [],
      dialogActionVisible: false,
      temp: {
        actionName: '',
        displayName: ''
      },
      tempArr: { // 临时存放row 原数据
        actionName: '',
        displayName: '',
        isEnable: ''
      },
      ActionRules: {
        actionName: [
          { required: true, message: '请输入操作名称', trigger: 'blur' }
        ],
        displayName: [
          { required: true, message: '请输入自定义名称', trigger: 'blur' }
        ]
      },
      node: null,
      loading: false,
      multipleSelection: '', // 多选
      showMail: true
    }
  },
  computed: {
    ...mapState('sysStore/processConfig', [
      'configDate'
    ])
  },
  filters: {
    Status (dataStr) {
      return dataStr ? '可用' : '禁用'
    }
  },
  methods: {
    init (node) {
      this.node = node
      this.getNodeAction()
    },
    // 获取节点操作
    getNodeAction (nodeId = this.node.nodeId) {
      this.loading = true
      this.axios_M4.get(`/nodeaction/ByNode/${nodeId}`)
        .then(this.getInfoSucc)
    },
    getInfoSucc (res) {
      let data = res.data
      console.log('节点操作:', data)
      if (data.code === 'success') {
        let addEditData = data.data
        if (addEditData.length > 0) {
          addEditData.forEach((row) => {
            row.edit = false
          })
        }
        this.tableData = addEditData
        this.loading = false
      }
    },
    // 新增节点动作
    addNodeAction () {
      this.$refs['ActionForm'].validate((valid) => {
        if (valid) {
          let data = {
            processConfigID: this.configDate.processConfigID, // 策略Id
            nodeID: this.node.nodeId, // 节点Id
            actionName: this.temp.actionName, // 操作名称
            displayName: this.temp.displayName // 显示名称
          }
          this.axios_M4.post(`/nodeaction/`, data).then((res) => {
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
            this.getNodeAction() // 列表刷新
          }).catch((err) => {
            console.log(err)
          })
        }
      })
    },
    // 编辑
    edit (row) {
      console.log(row)
      row.edit = true
      this.tempArr.actionName = row.actionName
      this.tempArr.displayName = row.displayName
      this.tempArr.isEnable = row.isEnable
    },
    // 保存编辑
    saveEdit (row) {
      let data = {
        nodeActionID: row.nodeActionID, // 节点操作Id
        actionName: row.actionName, // 操作名称
        displayName: row.displayName, // 显示名称
        isEnable: row.isEnable
      }
      this.updateNodeAction(data)
      row.edit = false
    },
    // 禁用
    stop (row) {
      this.$confirm(`确定要禁用?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          nodeActionID: row.nodeActionID, // 节点操作Id
          actionName: row.actionName, // 操作名称
          displayName: row.displayName, // 显示名称
          isEnable: 0
        }
        this.updateNodeAction(data)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 启用
    start (row) {
      this.$confirm(`确定要启用？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          nodeActionID: row.nodeActionID, // 节点操作Id
          actionName: row.actionName, // 操作名称
          displayName: row.displayName, // 显示名称
          isEnable: 1
        }
        this.updateNodeAction(data)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 调用操作修改接口 api
    updateNodeAction (data) {
      this.axios_M4.put('/nodeaction/', data)
        .then((res) => {
          if (res.data.code === 'success') {
            this.getNodeAction() // 列表刷新
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
    // 取消编辑
    cancelEdit (row) {
      row.actionName = this.tempArr.actionName
      row.displayName = this.tempArr.displayName
      row.isEnable = this.tempArr.isEnable
      row.edit = false
    },
    // 清空
    clearTemp () {
      this.temp = {
        actionName: '',
        displayName: ''
      }
    },
    // 删除节点操作
    deleteNodeAction (ID) {
      if (ID === '') {
        this.$message({
          type: 'warning',
          message: '请选择要删除的节点操作,可多选'
        })
      } else {
        this.$confirm(`确定要删除选择的节点操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios_M4.delete(`/nodeaction/${ID}`)
            .then((res) => {
              if (res.data.code === 'success') {
                this.getNodeAction() // 刷新
                this.$message({
                  type: 'success',
                  message: '已删除'
                })
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
        Str += el.nodeActionID + ','
      })
      Str = Str.substring(0, Str.length - 1)
      this.multipleSelection = Str
    },
    // 配置邮件
    mailEdit (row) {
      this.showMail = false
      this.$nextTick(() => {
        this.$refs.notice.init(row) // 通知 邮件配置
      })
    },
    // 关闭配置邮件
    closeMail () {
      this.showMail = true
    },
    // 打开添加
    openDialog () {
      this.dialogActionVisible = true
    },
    // 关闭添加
    closeDialog () {
      this.dialogActionVisible = false
      this.clearTemp()
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
