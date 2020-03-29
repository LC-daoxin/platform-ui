<template>
  <div
    ref="node"
    :style="nodeContainerStyle"
    @mouseenter="mouseEnter=true"
    @mouseleave="mouseEnter=false"
    @click="clickNode"
    @mouseup="changeNodePosition"
    class="flow-node-container"
  >
    <div class="flow-node-left"></div>
    <div class="flow-node-left-ico flow-node-drag">
      <i :class="nodeIcoClass"></i>
    </div>
    <div class="flow-node-text" :show-overflow-tooltip="true">
      {{node.nodeName}}
    </div>
    <div class="flow-node-right-attribute" v-if="mouseEnter" @click="openNode">
      <i class="el-icon-s-tools"></i>
    </div>
    <div class="flow-node-right-del" v-if="mouseEnter" @click="deleteNode">
      <i class="el-icon-delete"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    node: Object,
    processData: Object
  },
  data () {
    return {
      // 控制节点操作显示
      mouseEnter: false,
      currentNode: null
    }
  },
  computed: {
    // 节点容器样式
    nodeContainerStyle () {
      return {
        top: this.node.top,
        left: this.node.left
      }
    },
    nodeIcoClass () {
      var nodeIcoClass = {}
      nodeIcoClass[this.node.ico] = true
      // 添加该class可以推拽连线出来
      nodeIcoClass['flow-node-drag'] = true
      return nodeIcoClass
    }
  },
  methods: {
    // 获取当前nodeData
    getNodeData (Data, id) {
      for (let index of Data) {
        if (index.id === id) {
          this.currentNode = index
          break
        }
      }
    },
    // 删除节点
    deleteNode () {
      this.$emit('deleteNode', this.node)
    },
    // 节点属性
    openNode () {
      this.$emit('openNode', this.node.id)
    },
    // 点击节点
    clickNode () {
      this.$emit('clickNode', this.node.id)
      this.getNodeData(this.processData.nodeList, this.node.id)
      console.log(this.currentNode)
    },
    // 鼠标移动后抬起
    changeNodePosition () {
      // 避免抖动
      if (this.node.left === this.$refs.node.style.left && this.node.top === this.$refs.node.style.top) {
        return
      }
      this.$emit('changeNodeSite', {
        nodeId: this.node.id,
        left: this.$refs.node.style.left,
        top: this.$refs.node.style.top
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.flow-node-header {
  background-color: #66a6e0;
  height: 25px;
  cursor: pointer;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.flow-node-header a {
  text-decoration: none;
  line-height: 25px;
  vertical-align: middle;
}

.flow-node-header a img {
  line-height: 25px;
  vertical-align: middle;
  margin-bottom: 5px;
}

.flow-node-body {
  /*background-color: beige;*/
  background-color: white;
  text-align: center;
  cursor: pointer;
  height: 25px;
  line-height: 25px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}

/* 修改、删除按钮样式*/
.flow-node-operate {
  position: absolute;
  top: 0px;
  right: 0px;
  line-height: 25px
}

.flow-node-container {
  position: absolute;
  display: flex;
  width: 170px;
  height: 35px;
  border: 1px solid #E0E3E7;
  border-radius: 5px;
  background-color: #fff;
}

.flow-node-container:hover {
  /* 设置移动样式*/
  cursor: move;
  background-color: #F0F7FF;
  /*box-shadow: #1879FF 0px 0px 12px 0px;*/
  background-color: #F0F7FF;
  border: 1px solid #1879FF;
}

.flow-node-left {
  width: 4px;
  background-color: #1879FF;
  border-radius: 4px 0 0 4px;
}

.flow-node-left-ico {
  line-height: 35px;
  margin-left: 8px;
}

.flow-node-left-ico:hover {
  /* 设置拖拽的样式 */
  cursor: crosshair;
}

.flow-node-text {
  color: #565758;
  font-size: 12px;
  line-height: 35px;
  margin-left: 8px;
  width: 100px;
  /* 设置超出宽度文本显示方式*/
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.flow-node-right-attribute {
  line-height: 35px;
  position: absolute;
  right: 35px;
  color: #409EFF;
  cursor: default;
}

.flow-node-right-del {
  line-height: 35px;
  position: absolute;
  right: 10px;
  color: #84CF65;
  cursor: default;
}
</style>
