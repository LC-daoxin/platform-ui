<template>
  <el-dialog
    title="选择单位"
    :visible.sync="dialogAddCompanyVisible"
    @open="open"
    :before-close='handleDialog'
    width="450px"
  >
    <div class="treeBody">
      <el-tree
        class="tree-content"
        node-key="id"
        :data="data"
        :props="defaultProps"
        highlight-current
        :default-expand-all="false"
        @node-click="handleNodeClick"
        :default-expanded-keys="[0]"
        ref="tree"
        :load="loadNode"
        lazy
      ></el-tree>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="handleDialog()">取 消</el-button>
      <el-button type="primary" size="mini" @click="addCompany()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'add-company',
  props: {
    companyID: [String, Number],
    dialogAddCompanyVisible: {
      default: false
    }
  },
  data () {
    return {
      data: [], // tree数据
      defaultProps: {
        children: 'children',
        label: 'text',
        isLeaf: 'leaf'
      },
      selectCompany: '' // 选中的单位
    }
  },
  methods: {
    open () {
      this.refreshTree()
    },
    // 关闭对话框
    handleDialog () {
      this.$emit('showDialog', 'AddCompany')
    },
    // 刷新Tree
    refreshTree () {
      this.data = [{ text: '单位列表', id: 0 }] // 刷新还原
    },
    // 动态加载tree
    loadNode (node, resolve) {
      if (node.level === 0) {
        resolve([{ text: '单位列表', id: 0 }])
      }
      if (node.level === 1) {
        this.axios.get('/group/groupQuery/0')
          .then((res) => {
            let arr = res.data.data
            resolve(arr)
          })
      }
      if (node.level > 1) {
        this.axios.get(`/group/groupQuery/${node.data.id}`)
          .then((res) => {
            let arr = res.data.data
            resolve(arr)
          })
      }
    },
    // 点击tree Node
    handleNodeClick (data) {
      console.log(data)
      this.selectCompany = data.id
      this.$emit('getGroupRow', data)
    },
    // 添加单位
    addCompany () {
      if (this.selectCompany === '') {
        this.$message({
          type: 'warning',
          message: '请选择要添加的单位！'
        })
      } else {
        console.log(`/reportmanage/company/${this.companyID}/${this.selectCompany}`)
        this.axios_M2.post(`/reportmanage/company/${this.companyID}/${this.selectCompany}`).then((res) => {
          console.log(res)
          if (res.data.code === 'success') {
            this.$message({
              type: 'success',
              message: res.data.msg
            })
            this.$emit('refreshTree')
            this.handleDialog()
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
::v-deep .el-dialog__body {
  padding: 5px 20px;
}
.treeBody {
  height: 360px;
  overflow: auto;
}
</style>
