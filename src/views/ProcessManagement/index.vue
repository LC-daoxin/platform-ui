<template>
  <div class="dashboard-editor-container">
    <header>
      <el-button type="primary" size="mini" @click="addDialogVisible = true">新增一级文件夹</el-button>
      <el-button type="primary" size="mini" @click="importDialogVisible = true">导入流程</el-button>
      <el-button type="primary" size="mini" @click="$router.push('/work-flow/process-design')">流程设计</el-button>
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
      :visible.sync="addDialogVisible"
      width="35%">
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
      width="35%">
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
  let id = 1000;

  export default {
    data() {
      // const data = [{
      //   id: 1,
      //   label: 'OA',
      //   children: [{
      //     id: 2,
      //     label: '二级 1-1',
      //     children: [{
      //       id: 3,
      //       label: '三级 1-1-1'
      //     }, {
      //       id: 4,
      //       label: '三级 1-1-2'
      //     }]
      //   }]
      // }];
      const data = [
        {
          "catalogId": "4683a87bd40f4b449d6089ade5afa829",
          "code": "cataB3",
          "name": "目录B3",
          "parentId": null,
          "parentCode": "cataB",
          "type": 1,
          "sort": 3,
          "desc": "目录B3",
          "systemId": null,
          "state": 1,
          "createdBy": "1",
          "createdOn": "2020-03-13 10:52:56",
          "modifyBy": null,
          "modifyOn": null,
          "version": "1"
        },
        {
          "catalogId": "f26e451c4e6341d19f8b4f012d8e7ae7",
          "code": "cataB2",
          "name": "目录B2",
          "parentId": null,
          "parentCode": "cataB",
          "type": 1,
          "sort": 1,
          "desc": "目录B1",
          "systemId": null,
          "state": 1,
          "createdBy": "1",
          "createdOn": "2020-03-13 10:08:16",
          "modifyBy": null,
          "modifyOn": null,
          "version": "1"
        }
      ]
      return {
        addDialogVisible: false,
        importDialogVisible: false,
        data: JSON.parse(JSON.stringify(data)),
        data: JSON.parse(JSON.stringify(data)),
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

      renderContent(h, { node, data, store }) {
        return (
          <span class="custom-tree-node">
            <span>
              <i class="el-icon-folder"></i>
              {node.data.name}
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
  .import-tip {
    font-size: 12px;
    color: red;
    margin-left: 5px;
  }
</style>