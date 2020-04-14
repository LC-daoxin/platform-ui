<template>
  <div>
    <!-- 控制栏 start -->
    <div class="bar">
      <el-row>
        <el-col :span="12">
          <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="openDialog">添加</el-button>
          <el-button class="filter-item" type="danger" size="mini" icon="el-icon-minus" @click="deleteRecord(multipleSelection)">删除</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 控制栏 end -->
    <el-table size="mini" :data="tableData" border>
      <el-table-column
        type="selection"
        align="center"
        width="45">
      </el-table-column>
      <el-table-column
        prop="name"
        label="操作名称"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="customName"
        label="自定义名称"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="status"
        label="启用状态"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag type="success" size="mini">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="240"
      >
        <template>
          <el-button type="primary" size="mini">编辑</el-button>
          <el-button type="primary" size="mini">配置邮件</el-button>
          <el-button type="danger" size="mini">禁用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增邮件配置-弹窗 -->
    <el-dialog
      title="新增邮件配置"
      :visible.sync="dialogMailVisible"
      append-to-body
      width="450px"
    >
      <el-form ref="AddMailForm" :model="temp" label-width="110px">
        <el-form-item label="通知类型:">
          <el-col :span="22">
            <el-select class="select" v-model="temp.actionType" placeholder="请选择" size="mini">
              <el-option
                v-for="item in options.actionType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="自定义名称:">
          <el-col :span="22">
            <el-input class="input" size="mini" v-model="temp.Name" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="邮件模板:">
          <el-col :span="22">
            <el-select v-model="temp.mailTemplateID" placeholder="请选择" size="mini">
              <el-option
                v-for="item in options.mail"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeDialog">取 消</el-button>
        <el-button size="mini" type="primary" @click="addMail()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增邮件配置-弹窗 -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    mailCategory: String
  },
  data () {
    return {
      tableData: [],
      dialogMailVisible: false,
      options: {
        actionType: [{ // 通知类型
          value: 'Approved',
          label: 'Approved'
        }, {
          value: 'Declined',
          label: 'Declined'
        }, {
          value: 'Modified',
          label: 'Modified'
        }, {
          value: 'Cancelled',
          label: 'Cancelled'
        }, {
          value: 'Notification',
          label: 'Notification'
        }, {
          value: 'Overdued',
          label: 'Overdued'
        }],
        mail: [{ // mail类型
          value: 1001,
          label: 'test1模版'
        }, {
          value: 1002,
          label: 'test2模版'
        }],
      },
      temp: {
        actionType: '',
        mailTemplateID: null,
        Name: ''
      },
      node: null
    }
  },
  computed: {
    ...mapState('sysStore/processConfig', [
      'configDate'
    ])
  },
  methods: {
    init (node) {
      console.log(node)
      this.node = node
      this.getMailConfig(node.nodeId)
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
      console.log('邮件配置:', data)
      if (data.code === 'success') {
        this.tableData = data.data
        this.loading = false
      }
    },
    // 新增邮件配置
    addMail () {
      let data = {
        actionType: this.temp.actionType, // 通知类型
        mailCategory: 2, // 邮件配置类型
        mailTemplateID: this.temp.mailTemplateID, // 邮件模板Id
        nodeActionID: null, // 节点动作Id
        nodeID: this.node.nodeId, // 节点Id
        processConfigID: this.configDate.processConfigID, // 策略Id
      }
      console.log(data)
      this.axios_M4.post(`/mailconfig/`, data).then((res) => {
        console.log(res)
        if (res.data.code === 'success') {
          // this.$message({
          //   type: 'success',
          //   message: res.data.msg
          // })
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        }
        // this.refresh(objectType) // 刷新
      }).catch((err) => {
        console.log(err)
      })
    },
    openDialog () {
      this.dialogMailVisible = true
    },
    closeDialog () {
      this.dialogMailVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-button--mini {
  padding: 5px 8px;
  vertical-align: top;
}
.bar {
  margin-bottom: 10px;
}
.input {
  width: 270px;
}
::v-deep .el-select {
  min-width: 270px;
}
</style>
