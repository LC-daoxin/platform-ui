<template>
  <div class="dashboard-editor-container">
    <header>
      <el-button type="primary" icon="el-icon-folder-add" size="mini" @click="addDialogVisible = true">新增流程组</el-button>
      <el-button type="primary" icon="el-icon-upload2" size="mini" @click="importDialogVisible = true">导入流程</el-button>
    </header>
    <main>
      <el-tree
        :data="data"
        node-key="id"
        :props="defaultProps"
        ref="ProcessTree"
        :default-expanded-keys="[0]"
        @node-click="handleNodeClick"
        :load="loadNode"
        lazy
        :expand-on-click-node="false"
      >
        <div class="custom-tree" slot-scope="{ node, data }">
          <span class="custom-tree-node" v-if="node.level === 1">
            <span>
              <i class="process el-icon-folder"></i>
              <span :class="data.status ? '' : 'info'">{{ node.data.text }}</span>
            </span>
            <span v-if="data.status && node.isCurrent">
              <el-tooltip class="item" effect="dark" content="添加流程" placement="bottom">
                <el-button size="mini" type="text" @click="console(node, data)">
                  <i class="iconfont pl-tianjia1 success"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                <el-button size="mini" type="text">
                  <i class="iconfont pl-ic_del danger"></i>
                </el-button>
              </el-tooltip>
            </span>
          </span>
          <span class="custom-tree-node" v-if="node.level === 2">
            <span>
              <i :class="{ 'process': data.status, 'info': !data.status, 'iconfont pl-shengchanliuchengguanli': true}"></i>
              <span :class="data.status ? '' : 'info'">{{ node.data.text }}</span>
            </span>
            <span v-if="data.status && node.isCurrent">
              <el-tooltip class="item" effect="dark" content="属性" placement="bottom">
                <el-button size="mini" type="text" @click="console(node, data)">
                  <i class="iconfont pl-shuxing warning"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="禁用" placement="bottom">
                <el-button size="mini" type="text">
                  <i class="iconfont pl-jinyong danger"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="添加策略组" placement="bottom">
                <el-button size="mini" type="text">
                  <i class="iconfont pl-celvezhihangpeizhi"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="功能调用" placement="bottom">
                <el-button size="mini" type="text">
                  <i class="iconfont pl-gongneng-"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="流程变量" placement="bottom">
                <el-button size="mini" type="text">
                  <i class="iconfont pl-liuchengguanli"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="邮件模版" placement="bottom">
                <el-button size="mini" type="text">
                  <i class="iconfont pl-youjian"></i>
                </el-button>
              </el-tooltip>
            </span>
            <span class="manage" v-if="!data.status && node.isCurrent">
              <el-tooltip class="item" effect="dark" content="启动" placement="bottom">
                <el-button size="mini" type="text">
                  <i class="iconfont pl-qiyong success"></i>
                </el-button>
              </el-tooltip>
            </span>
          </span>
          <span class="custom-tree-node" v-if="node.level === 3">
            <span>
              <i  :class="{ 'strategyGroup': data.status, 'info': !data.status, 'iconfont pl-shijiancelveweihu': true}"></i>
              <span :class="data.status ? 'groupText' : 'info'">{{ node.data.text }}</span>
              <span class="describe">{{ node.data.describe }}</span>
            </span>
            <span v-if="data.status && node.isCurrent">
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                <el-button size="mini" type="text" @click="console(node, data)">
                  <i class="iconfont pl-bianji"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="添加策略" placement="bottom">
                <el-button size="mini" type="text">
                  <i class="iconfont pl-tianjia1"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="入口规则" placement="bottom">
                <el-button size="mini" type="text">
                  <i class="iconfont pl-guizeguanli1"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="邮件" placement="bottom">
                <el-button size="mini" type="text">
                  <i class="iconfont pl-youjian"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="禁用" placement="bottom">
                <el-button size="mini" type="text">
                  <i class="iconfont pl-jinyong danger"></i>
                </el-button>
              </el-tooltip>
            </span>
            <span class="manage" v-if="!data.status && node.isCurrent">
              <el-tooltip class="item" effect="dark" content="启动" placement="bottom">
                <el-button size="mini" type="text">
                  <i class="iconfont pl-qiyong success"></i>
                </el-button>
              </el-tooltip>
            </span>
          </span>
          <span class="custom-tree-node" v-if="node.level === 4">
            <span>
              <i  :class="{ 'strategy': data.status, 'info': !data.status, 'iconfont pl-jiagecelve': true}"></i>
              <span :class="data.status ? 'groupText' : 'info'">{{ node.data.text }}</span>
              <span class="describe">{{ node.data.describe }}</span>
            </span>
            <span v-if="data.status && node.isCurrent">
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                <el-button size="mini" type="text" @click="console(node, data)">
                  <i class="iconfont pl-bianji"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="审批节点" placement="bottom">
                <el-button size="mini" type="text" @click="$router.push('/work-flow/process-design')">
                  <i class="iconfont pl-changyongtubiao_liuchengguanli"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="邮件" placement="bottom">
                <el-button size="mini" type="text">
                  <i class="iconfont pl-youjian"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="禁用" placement="bottom">
                <el-button size="mini" type="text">
                  <i class="iconfont pl-jinyong danger"></i>
                </el-button>
              </el-tooltip>
            </span>
            <span class="manage" v-if="!data.status && node.isCurrent">
              <el-tooltip class="item" effect="dark" content="启动" placement="bottom">
                <el-button size="mini" type="text">
                  <i class="iconfont pl-qiyong success"></i>
                </el-button>
              </el-tooltip>
            </span>
          </span>
        </div>
      </el-tree>
    </main>
    <el-dialog
      title="新增流程组"
      :visible.sync="addDialogVisible"
      width="420px">
      <el-form ref="form" size="mini" :model="addForm" label-width="100px">
        <el-form-item label="流程目录名称">
          <el-input v-model="addForm.name" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="流程目录编码">
          <el-input v-model="addForm.key" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单">
          <el-button type="text">选择父级</el-button>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="addForm.sort" size="mini"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false" size="mini">提交</el-button>
        <el-button type="primary" @click="addDialogVisible = false" size="mini">撤销</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="导入流程"
      :visible.sync="importDialogVisible"
      width="420px">
      <el-form ref="form" size="mini" :model="importForm" label-width="100px">
        <el-form-item label="选择目录">
          <el-input v-model="importForm.name" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="导入文件">
          <el-button type="primary">选择文件</el-button>
          <span class="import-tip">{{ importForm.file }}</span>
        </el-form-item>
        <el-form-item label="流程名称">
          <el-input v-model="importForm.key" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="流程编码">
          <el-input v-model="importForm.sort" size="mini"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importDialogVisible = false" size="mini">提交</el-button>
        <el-button type="primary" @click="importDialogVisible = false" size="mini">撤销</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      data: null,
      defaultProps: {
        children: 'children',
        label: 'text',
        isLeaf: function (res) {
          return !res.Leaf
        }
      },
      addDialogVisible: false,
      importDialogVisible: false,
      addForm: {
        name: '',
        key: '',
        sort: ''
      },
      importForm: {
        file: '未选择任何文件'
      }
    }
  },

  methods: {
    /**
     * 新增一级文件夹
     */
    addRootFolder() {

    },
    append(data) {
      const newChild = { id: id++, label: 'testtest', children: [] };
      if (!data.children) {
        this.$set(data, 'children', []);
      }
      data.children.push(newChild);
    },

    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },
    console (node, data) {
      console.log(node)
      console.log(data)
    },
    // 点击tree Node
    handleNodeClick (data) {
      console.log(data)
    },
    // 动态加载tree
    loadNode (node, resolve) {
      if (node.level === 0) {
        axios.get('/mock/ProcessGroupTree.json')
          .then((res) => {
            console.log(res)
            let arr = res.data.data
            resolve(arr)
          })
      }
      if (node.level === 1) {
        axios.get('/mock/ProcessTree.json')
          .then((res) => {
            console.log(res)
            let arr = res.data.data
            resolve(arr)
          })
      }
      if (node.level === 2) {
        axios.get('/mock/TacticsTree.json')
          .then((res) => {
            console.log(res)
            let arr = res.data.data
            resolve(arr)
          })
      }
      if (node.level === 3) {
        axios.get('/mock/Tactics2Tree.json')
          .then((res) => {
            console.log(res)
            let arr = res.data.data
            resolve(arr)
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  header {
    margin-bottom: 12px;
  }
  main {
    width: 80%;
  }
  .custom-tree {
    width: 100%;
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
      i.process {
        margin-right: 5px;
        font-weight: bold;
        color: #96a7ff;
      }
      i.info {
        margin-right: 5px;
        color: #909399;
      }
      span.info {color: #909399}
      i.danger { color: #F56C6C; }
      i.warning { color: #E6A23C; }
      i.success { color: #67C23A; }
      i.strategyGroup {
        margin-right: 5px;
        color: #9a6e3a;
      }
      i.strategy {
        margin-right: 5px;
        color: #eed61f;
      }
      .groupText {
        display: inline-block;
        width: 180px;
      }
      .describe {
        display: inline-block;
        font-weight: 100;
      }
    }
    ::v-deep .el-button--mini {
      padding: 0;
    }
  }
  .import-tip {
    font-size: 12px;
    color: red;
    margin-left: 5px;
  }
</style>