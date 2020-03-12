<template>
  <div class="dashboard-editor-container">
    <header>
      <el-button type="primary" size="mini" @click="dialogVisible = true">新增一级文件夹</el-button>
      <el-button type="primary" size="mini">导入流程</el-button>
    </header>
    <main>
      <el-tree
        :data="data"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        :render-content="renderContent">
      </el-tree>
    </main>
    <el-dialog
      title="新增一级文件夹"
      :visible.sync="dialogVisible"
      width="35%">
      <el-form ref="form" size="mini" :model="form" label-width="100px">
        <el-form-item label="流程目录名称">
          <el-input v-model="form.name" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="流程目录编码">
          <el-input v-model="form.key" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单">
          <el-button type="text">选择父级</el-button>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="form.sort" size="mini"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">提交</el-button>
        <el-button type="primary" @click="dialogVisible = false" size="mini">撤销</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  let id = 1000;

  export default {
    data() {
      const data = [{
        id: 1,
        label: 'OA',
        children: [{
          id: 2,
          label: '二级 1-1',
          children: [{
            id: 3,
            label: '三级 1-1-1'
          }, {
            id: 4,
            label: '三级 1-1-2'
          }]
        }]
      }];
      return {
        dialogVisible: false,
        data: JSON.parse(JSON.stringify(data)),
        data: JSON.parse(JSON.stringify(data)),
        form: {
          name: '',
          key: '',
          sort: ''
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

      renderContent(h, { node, data, store }) {
        return (
          <span class="custom-tree-node">
            <span>
              <i class="el-icon-folder"></i>
              {node.label}
            </span>
            <span>
              <el-tooltip class="item" effect="dark" content="添加流程目录" placement="bottom">
                <el-button icon="el-icon-folder-add" type="text"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="添加流程" placement="bottom">
                <el-button icon="el-icon-share" type="text"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                <el-button icon="el-icon-folder-delete" type="text"></el-button>
              </el-tooltip>
            </span>
          </span>);
      }
    }
  };
</script>

<style>
  header {
    margin-bottom: 12px;
  }
  main {
    width: 50vw;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .custom-tree-node i {
    margin-right: 5px
  }
</style>