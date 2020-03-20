<template>
  <div class="flow-menu" ref="tool">
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
        <template slot="title">
          {{menuList.name}}
        </template>
        <draggable @end="end" @start="move" v-model="menuList.children" :options="draggableOptions">
          <div v-for="(son, sonIndex) in menuList.children"
            :key="sonIndex"
            :type="son.type"
            class="flow-node-menu"
            :style="son.style"
          >
            <div class="flow-node-menu-left"></div>
            <div class="flow-node-menu-left-ico">
              <i :class="son.ico"></i>
            </div>
            <div class="flow-node-menu-text">
              {{son.name}}
            </div>
          </div>
        </draggable>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          操作
        </template>
        <el-row>
          <el-button class="buttonSty" icon="el-icon-refresh" size="small" @click="refresh">刷新</el-button>
        </el-row>
        <el-row>
          <el-button class="buttonSty" icon="el-icon-edit-outline" size="small" @click="changeLabel">设置连线</el-button>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
var mousePosition = {
  left: -1,
  top: -1
}
export default {
  data () {
    return {
      activeNames: ['1', '2'],
      // draggable配置参数参考 https://www.cnblogs.com/weixin186/p/10108679.html
      draggableOptions: {
        preventOnFilter: false,
        sort: false,
        disabled: false,
        ghostClass: 'tt',
        // 不使用H5原生的配置
        forceFallback: true
        // 拖拽的时候样式
        // fallbackClass: 'flow-node-draggable'
      },
      menuList: {
        name: '工具箱',
        children: [
          {
            id: '1',
            type: 'node',
            name: '审批节点',
            ico: 'iconfont pl-jiedian',
            // 自定义覆盖样式
            style: {}
          }, {
            id: '2',
            type: 'start',
            name: '流程开始',
            ico: 'iconfont pl-kaishi',
            // 自定义覆盖样式
            style: {}
          }, {
            id: '3',
            type: 'end',
            name: '流程结束',
            ico: 'iconfont pl-jieshu',
            // 自定义覆盖样式
            style: {}
          }
        ]
      },
      nodeMenu: {}
    }
  },
  components: {
    draggable
  },
  created () {
    /**
     * 以下是为了解决在火狐浏览器上推拽时弹出tab页到搜索问题
     * @param event
     */
    if (this.isFirefox()) {
      document.body.ondrop = function (event) {
        // 解决火狐浏览器无法获取鼠标拖拽结束的坐标问题
        mousePosition.left = event.layerX
        mousePosition.top = event.clientY - 50
        event.preventDefault()
        event.stopPropagation()
      }
    }
  },
  methods: {
    // 刷新
    refresh () {
      this.$emit('dataReloadC')
    },
    // 设置连线
    changeLabel () {
      this.$emit('changeLabel')
    },
    // 根据类型获取左侧菜单对象
    getMenu (type) {
      let children = this.menuList.children
      for (let j = 0; j < children.length; j++) {
        if (children[j].type === type) {
          return children[j]
        }
      }
    },
    // 拖拽开始时触发
    move (evt, a, b, c) {
      console.log(evt, a, b, c)
      let type = evt.item.attributes.type.nodeValue
      this.nodeMenu = this.getMenu(type)
    },
    // 拖拽结束时触发
    end (evt, e) {
      this.$emit('addNode', evt, this.nodeMenu, mousePosition)
    },
    // 是否是火狐浏览器
    isFirefox () {
      let userAgent = navigator.userAgent
      if (userAgent.indexOf('Firefox') > -1) {
        return true
      }
      return false
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-collapse-item__wrap {
  border-bottom: none;
}
::v-deep .el-collapse-item__header {
  border-bottom: none;
}
::v-deep .el-collapse-item__content {
  padding-bottom: 0;
}
.flow-menu {
    text-align: center;
}
.flow-tool-menu {
    background-color: #eeeeee;
    cursor: pointer;
    padding-left: 5px;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #979797
}
.flow-tool-submenu {
    background-color: white;
    padding-left: 20px;
    cursor: pointer;
    height: 50px;
    line-height: 50px;
    vertical-align: middle;
    border-bottom: 1px solid #d3d3d3
}
.flow-node-draggable {
    border: 1px solid #1879FF;
    height: 35px !important;
    width: 170px !important;
    line-height: 35px;
}
.flow-node-menu {
    margin: 10px;
    display: flex;
    width: 80%;
    height: 30px;
    border: 1px solid #E0E3E7;
    border-radius: 5px;
    background-color: #fff;
}
.flow-node-menu:hover {
    /* 设置移动样式*/
    cursor: move;
    background-color: #F0F7FF;
    /*box-shadow: #1879FF 0px 0px 12px 0px;*/
    background-color: #F0F7FF;
    border: 1px solid #1879FF;
}
.flow-node-menu-left {
    width: 4px;
    background-color: #1879FF;
    border-radius: 3px 0 0 3px;
}
.flow-node-menu-left-ico {
    line-height: 30px;
    margin-left: 4px;
}
.flow-node-menu-text {
    color: #565758;
    font-size: 12px;
    line-height: 30px;
    margin-left: 4px;
    width: 70px;
    /* 设置超出宽度文本显示方式*/
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.buttonSty {
  margin: 5px 10px;
  display: flex;
  width: 80%;
  height: 30px;
}
</style>
