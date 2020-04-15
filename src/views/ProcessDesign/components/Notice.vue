<template>
  <div>
    <!-- 控制栏 start -->
    <div class="bar">
      <el-row>
        <el-col :span="24">
          <span>邮件模板类型</span>
          <el-select v-model="actionType" size="mini" style="margin-right: 10px">
            <el-option
              v-for="item in options.actionType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span>邮件模板名称</span>
          <el-select v-model="mailTemplateID" size="mini" style="margin-right: 10px">
            <el-option
              v-for="item in options.mail"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button type="primary" size="mini" @click="addMail">添加</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 控制栏 end -->
    <h1>邮件列表</h1>
    <el-table
      size="mini"
      v-loading="loading"
      :data="tableData"
      class="table"
      border
    >
      <el-table-column label="邮件模版名称" align="center" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.templateName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮件模版类型" align="center" min-width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.actionType | actionType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="50">
        <template slot-scope="scope">
          <el-button icon="el-icon-delete" type="danger" size="mini" @click="deleteMail(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    mailCategory: [Number, String]
  },
  data () {
    return {
      tableData: [],
      options: {
        actionType: [{ // 通知类型
          value: 'Approved',
          label: '批准'
        }, {
          value: 'Declined',
          label: '拒绝'
        }, {
          value: 'Modified',
          label: '修改'
        }, {
          value: 'Cancelled',
          label: '取消'
        }, {
          value: 'Notification',
          label: '通知'
        }, {
          value: 'Overdued',
          label: '过期'
        }],
        mail: [{ // mail类型
          value: 1,
          label: '模版1'
        }, {
          value: 2,
          label: '模版2'
        }, {
          value: 3,
          label: '模版3'
        }],
      },
      actionType: 'Approved', // 邮件模板类型
      mailTemplateID: '', // 邮件模板名称ID
      loading: false,
      node: null,
      nodeAction: null,
      currentID: null // 当前ID
    }
  },
  filters: {
    actionType (Type) {
      let mail = [{ // 通知类型
        value: 'Approved',
        label: '批准'
      }, {
        value: 'Declined',
        label: '拒绝'
      }, {
        value: 'Modified',
        label: '修改'
      }, {
        value: 'Cancelled',
        label: '取消'
      }, {
        value: 'Notification',
        label: '通知'
      }, {
        value: 'Overdued',
        label: '过期'
      }]
      let Str
      for (let item of mail) {
        if (item.value === Type) {
          Str = item.label
          break
        }
      }
      return Str
    }
  },
  computed: {
    ...mapState('sysStore/processConfig', [
      'configDate'
    ])
  },
  methods: {
    init (data = null) {
      console.log('邮件配置初始化：', this.mailCategory, data)
      this.mailTemplateID = this.options.mail[0].value
      if (this.mailCategory === '1') {
        this.getMailConfig(this.configDate.processConfigID)
        this.currentID = this.configDate.processConfigID
      } else if (this.mailCategory === '2') {
        this.node = data
        this.getMailConfig(data.nodeId)
        this.currentID = data.nodeId
      } else if (this.mailCategory === '3') {
        this.nodeAction = data
        this.getMailConfig(data.nodeActionID)
        this.currentID = data.nodeActionID
      }
    },
    // 获取邮件配置
    getMailConfig (id) { // 邮件配置类型mailCategory 1: ProcessConfig 2: Node 3: Action
      this.loading = true
      console.log(`/mailconfig/${this.mailCategory}/${id}`)
      this.axios_M4.get(`/mailconfig/${this.mailCategory}/${id}`)
        .then(this.getInfoSucc)
    },
    getInfoSucc (res) {
      let data = res.data
      console.log('邮件配置Node:', data)
      if (data.code === 'success') {
        this.tableData = data.data
        this.loading = false
      }
    },
    // 新增邮件配置
    addMail () {
      let data = {
        actionType: this.actionType, // 邮件模版通知类型
        mailCategory: this.mailCategory, // 邮件配置类型
        mailTemplateID: this.mailTemplateID, // 邮件模板Id
        nodeActionID: this.mailCategory === '3' ? this.nodeAction.nodeActionID : null, // 节点动作Id
        nodeID: this.mailCategory === '2' ? this.node.nodeId : null, // 节点Id
        processConfigID: this.configDate.processConfigID, // 策略Id
      }
      console.log(data)
      this.axios_M4.post(`/mailconfig/`, data).then((res) => {
        console.log(res)
        if (res.data.code === 'success') {
          this.$message({
            type: 'success',
            message: res.data.msg
          })
          this.getMailConfig(this.currentID)
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
    // 删除邮件
    deleteMail (row) {
      this.$confirm(`确定要删除选择的邮件模版?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios_M4.delete(`/mailconfig/${row.mailConfigID}`)
          .then((res) => {
            if (res.data.code === 'success') {
              this.getMailConfig(this.currentID) // 刷新
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
  .table {
    ::v-deep .el-button--mini {
      padding: 5px 8px;
      vertical-align: top;
    }
  }
  .bar {
    span {
      font-size: 12px;
      margin-right: 10px;
    }
  }
  h1 {
    font-size: 15px;
    font-weight: 300;
    padding: 8px 10px;
    margin: 0;
  }
</style>
