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
            default-expand-all
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            ref="tree"
            :expand-on-click-node="false"
          ></el-tree>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'menu-tree',
  data () {
    return {
      filterText: '', // tree 搜索
      data: [], // tree数据
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf'
      }
    }
  },
  mounted () {
    this.getTree()
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    // 获取Tree
    getTree () {
      this.axios_M3.get('/svc/cate/cateTree')
        .then((res) => {
          if (res.data.code === 'success') {
            this.data = res.data.data
          }
        })
    },
    // 快速查询
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 点击tree Node
    handleNodeClick (data) {
      this.$emit('getScvRow', data)
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
