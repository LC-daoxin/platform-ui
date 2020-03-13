<template>
  <div class="tree">
    <el-row :gutter="5">
      <el-col :span="17">
        <el-input
          size="mini"
          placeholder="快速检索"
          v-model="searchTreeValue">
        </el-input>
      </el-col>
      <el-col :span="7">
        <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="searchTree()">查询</el-button>
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
            @node-click="handleNodeClick"
            :default-expanded-keys="[0]"
            ref="tree"
            :load="loadNode"
            lazy
            :show-checkbox="checkbox"
            :check-strictly="true"
            @check="check"
          ></el-tree>
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
      searchTreeValue: '', // tree 搜索
      searchTreeArr: [], // 快速搜索Arr
      highLightArr: [], // 高亮Arr
      data: [], // tree数据
      initialID: null, // 初始化节点
      defaultProps: {
        children: 'children',
        label: 'text',
        isLeaf: 'leaf'
      }
    }
  },
  methods: {
    // 刷新Tree
    refreshTree () {
      this.data = [{ text: '用户组列表', id: 0 }] // 刷新还原
    },
    // 快速查询
    async searchTree () {
      if (this.searchTreeValue) {
        this.refreshTree()
        await this.axios.get(`/group/groupTreeSearchQuery/${this.searchTreeValue}`)
          .then((res) => {
            let list = res.data.data
            if (list.length > 0) {
              let newList = []
              let LightArr = []
              list.forEach((item) => {
                let FArr = item.path.substring(1).split('/')
                LightArr = LightArr.concat(FArr[FArr.length - 1])
                newList = newList.concat(FArr)
              })
              this.highLightArr = [...new Set(LightArr)]
              this.searchTreeArr = [...new Set(newList)]
            } else {
              this.data = [] // 未搜索到数据
            }
          })
        setTimeout(() => {
          this.refreshNodeBy(this.initialID) // 触发搜索展开
        }, 500)
      } else {
        this.refreshTree()
      }
    },
    // 主动刷新展开节点下的子节点
    refreshNodeBy (id) {
      if (this.$refs.tree.getNode(id) != null) {
        let node = this.$refs.tree.getNode(id) // 通过节点id找到对应树节点对象
        if (this.highLightArr.indexOf(id) > -1) {
          node.isCurrent = true // 高亮
        }
        node.expand() // 主动调用展开节点方法，重新查询该节点下的所有子节点
      }
    },
    // 动态加载tree
    loadNode (node, resolve) {
      if (node.level === 0) {
        resolve([{ text: '用户组列表', id: 0 }])
      }
      if (node.level === 1) {
        this.axios.get('/group/groupAndUserQuery/0')
          .then((res) => {
            let arr = res.data.data
            this.initialID = res.data.data[0].id // 初始化节点
            resolve(arr)
          })
      }
      if (node.level > 1) {
        let id = node.data.id.split('_')[2]
        this.axios.get(`/group/groupAndUserQuery/${id}`)
          .then((res) => {
            let arr = res.data.data
            resolve(arr)
            for (let v of this.searchTreeArr) {
              this.refreshNodeBy(v)
            }
          })
      }
    },
    // 点击tree Node
    handleNodeClick (data) {
      if (data.id !== 0) {
        this.$emit('getGroup', data.id)
        this.$emit('getGroupRow', data)
      }
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
    }
  }
}
</style>
