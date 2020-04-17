<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="110px" size="mini">
    <div class="form-header">
      <el-form-item label="代理授权人" style="margin-right:10px;">
        <span></span>
      </el-form-item>
      <el-form-item label="代理授权对象" prop="toUserID">
        <el-select
          v-model="form.toUserID"
          placeholder="请输入用户"
          :loading="loading"
          :remote-method="remoteMethod"
          filterable
          remote
          reserve-keyword
        >
          <el-option v-for="(agent, index) of agents" :key="index" :label="agent.name" :value="agent.name"></el-option>
        </el-select>
      </el-form-item>
    </div>
    <el-form-item label="代理时间" prop="startDate">
      <el-date-picker
        v-model="form.startDate"
        type="datetime"
        placeholder="开始日期">
      </el-date-picker>
      <span style="margin:0 10px;">至</span>
      <el-date-picker
        v-model="form.endDate"
        type="datetime"
        placeholder="结束日期">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="描述" prop="remark">
      <el-input type="textarea" :rows="2" v-model="form.remark">
      </el-input>
    </el-form-item>
    <el-form-item label="授权流程" prop="processID">
      <span class="process-placeholder">{{ form.processName ? form.processName : '请选择' }}</span>
      <!-- <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText">
      </el-input> -->
      <el-tree
        class="filter-tree"
        :data="processData"
        :props="defaultProps"
        :filter-node-method="filterNode"
        @node-click="handleClickNode"
        :load="loadNode"
        lazy
        ref="tree">
      </el-tree>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'DialogForm',
  props: {
    title: String,
    id: String
  },
  data () {
    return {
      loading: false,
      form: {
        remark: '',
        startDate: '',
        endDate: '',
        toUserID: '',
        processID: '',
        processName: ''
      },
      rules: {
        toUserID: [
          { required: true, message: '请选择代理授权对象', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入描述内容', trigger: 'blur' }
        ],
        startDate: [
          { required: true, message: '请选择开始时间', trigger: 'blur' }
        ],
        endDate: [
          { required: true, message: '请选择结束时间', trigger: 'blur' }
        ],
        processID: [
          { required: true, message: '请选择要授权的流程', trigger: 'blur' }
        ]
      },
      agents: [],
      filterText: '',
      processData: [],
      defaultProps: {
        label: function (data, node) {
          if (node.level === 1) {
            return data.displayName
          } else if (node.level === 2) {
            return data.DisplayName
          }
        },
        isLeaf: function (data) {
          return !data.Leaf
        }
      }
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleClickNode (data, node) {
      if (node.level === 2) {
        this.form.processID = data.ProcessID
        this.form.processName = data.DisplayName
      }
    },
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        this.getAgent(query)
      } else {
        this.options = []
      }
    },
    getAgent (name) {
      this.axios_M4.get(`/user/userAllQuery/all/${name}/1000/0`)
        .then(res => {
          this.loading = false
          res = res.data
          if (res.code === 'success') {
            this.agents = res.data
          }
        })
    },
    // 获取代理详情
    getDetails () {
      this.axios_M4.get(`/delegationSettings/${this.id}`)
        .then(res => {
          res = res.data
          const { code, msg, data } = res
          if (code === 'success') {
            Object.assign(this.form, data)
          } else {
            this.$message.error(msg)
          }
        })
    },
    // 返回唯一标识
    getUUID () {
      return Math.random().toString(36)
    },
    // 动态加载tree
    loadNode (node, resolve) {
      const { level } = node
      if (level === 0) {
        this.axios_M4.get(`/procset/list`)
          .then(res => {
            let data = res.data
            if (data.code === 'success') {
              let arr = data.data
              if (arr.length > 0) {
                arr.forEach((row) => {
                  row.Leaf = true
                  row.treeID = this.getUUID()
                })
              }
              resolve(arr)
            }
          })
      }
      if (level === 1) {
        this.axios_M4.get(`/process/${node.data.procSetId}/all/100000/1`)
          .then(res => {
            let data = res.data
            if (data.code === 'success') {
              let arr = data.data
              if (arr.length > 0) {
                arr.forEach((row) => {
                  row.isLeaf = true
                  row.treeID = this.getUUID()
                })
              }
              resolve(arr)
            }
          })
      }
    }
  },
  mounted () {
    if (this.title === '编辑') this.getDetails()
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  }
}
</script>

<style scoped>
  .el-form >>> .el-input--mini {
    width: 200px;
  }
  .el-form >>> .el-tree {
    border: 1px solid #ddd;
    margin-top: 10px;
    border-radius: 3px;
    height: 200px;
    overflow: auto;
  }
  .form-header {
    display: flex;
  }
  .process-placeholder {
    color: #999;
  }
</style>
