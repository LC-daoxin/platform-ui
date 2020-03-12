<template>
  <div class="tree">
    <el-row :gutter="5">
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
            :default-expand-all="false"
            @node-click="TreeCk"
            :filter-node-method="filterNode"
            ref="tree"
          ></el-tree>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'menu-tree',
  props: {
    roleId: Number
  },
  data () {
    return {
      filterText: '', // tree 搜索
      data: [], // tree数据
      defaultProps: {
        children: 'children',
        label: 'text',
        isLeaf: 'leaf'
      },
      temp: {
        newIds: [], // 更新后策略
        newGroupIds: [], // 更新后策略组
        oldIds: [], // 原有策略
        oldGroupIds: [] // 原有策略组
      },
      parentArr: [] // 当前策略组
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    // 获取Tree
    getTree () {
      this.axios_M2.get(`/permission/categoryGroupTree/${this.roleId}`)
        .then((res) => {
          console.log(res)
          if (res.data.code === 'success') {
            this.data = res.data.data
          }
        })
    },
    // 快速查询
    filterNode (value, data) {
      if (!value) return true
      return data.text.indexOf(value) !== -1
    },
    // 点击tree Node
    handleNodeClick (data) {
      this.$emit('getCategoryRow', data)
    },
    TreeCk (e, node, item) { // 树节点点击
      console.log(e)
      console.log(node)
      console.log(item)
      let tree = this.$refs.tree
      if (e.isgroup === 0) {
        this.getTreeNode(tree.getNode(e.id))
      } else {
        this.parentArr = e
      }
      console.log(this.parentArr)
    },
    getTreeNode (node) { // 获取当前树节点和其父级节点
      // console.log(node)
      if (node) {
        if (node.key !== undefined) {
          this.temp.newIds.push(node.key) // 在数组头部添加元素
          this.temp.newGroupIds.push(node.parent.key) // 递归
        }
      }
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
    }
  }
}
</style>
