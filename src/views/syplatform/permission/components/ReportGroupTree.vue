<template>
  <div class="tree">
    <el-row>
      <el-col :span="24">
        <el-input
          size="mini"
          placeholder="快速检索"
          v-model="filterText">
        </el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="box">
          <el-tree
            class="tree-content"
            node-key="id"
            :data="data"
            :props="defaultProps"
            highlight-current
            @node-click="handleNodeClick"
            default-expand-all
            ref="tree"
            :load="loadNode"
            lazy
            :filter-node-method="filterNode"
            :show-checkbox="checkbox"
            :check-strictly="true"
            @check="check"
            :expand-on-click-node="false"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span v-if="node.isCurrent">
                <i class="el-icon-delete" size="mini" @click.stop="() => remove(node, data)"></i>
              </span>
            </span>
          </el-tree>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'group-tree',
  props: {
    checkbox: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      filterText: '', // tree 搜索
      data: [], // tree数据
      initialID: 0, // 根节点
      defaultProps: {
        children: 'children',
        label: 'Name',
        isLeaf: function (res) {
          return !res.IsParent
        }
      }
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    // 快速查询
    filterNode (value, data) {
      if (!value) return true
      return data.Name.indexOf(value) !== -1
    },
    // 动态加载tree
    loadNode (node, resolve) {
      if (node.level === 0) {
        this.axios_M2.get('/reportmanage/reportGroupTree')
          .then((res) => {
            let arr = []
            let data = res.data.data
            arr = data.filter(item => {
              return item.ParentID === 0
            })
            resolve(arr)
          })
      }
      if (node.level >= 1) {
        this.axios_M2.get('/reportmanage/reportGroupTree')
          .then((res) => {
            let arr = []
            let data = res.data.data
            arr = data.filter(item => {
              return item.ParentID === node.data.ID
            })
            resolve(arr)
          })
      }
    },
    // 删除节点
    remove (node, data) {
      if (data.ParentID === 1) {
        this.$confirm(`您要删除的节点为二级单位，其用户单位会一并删除，是否执行操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.removeCompany(data.ID)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      } else {
        this.$confirm(`您要删除的节点为用户单位，其用户单位会一并删除，是否执行操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.removeCompany(data.ID)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    },
    removeCompany (id) {
      this.axios_M2.delete(`/reportmanage/company/${id}`).then((res) => {
        if (res.data.code === 'success') {
          this.$message({
            type: 'success',
            message: res.data.msg
          })
          this.$emit('refreshTree')
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
    // 点击tree Node
    handleNodeClick (data, node, item) {
      console.log(data)
      this.$emit('getReportRow', data)
    },
    // check 复选框选中
    check () {
      let checkStr = this.$refs.tree.getCheckedKeys().join(',')
      this.$emit('getCheck', checkStr)
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .el-tree>.el-tree-node{
    min-width:100%;
    display: inline-block;
  }
  .tree {
    padding: 12px;
    .box {
      overflow-x: auto;
      width: 100%;
      .tree-content {
        margin-top: 5px;
        min-width: 100%;
        .custom-tree-node {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          padding-right: 8px;
        }
      }
    }
  }
</style>
