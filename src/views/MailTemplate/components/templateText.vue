<template>
  <div>
    <header>
      <div>
        <span>数据源</span>
        <el-popover placement="right" width="230" trigger="click" accordion>
          <el-tree :props="props" :load="loadNode" @node-click="selectLeaf" lazy></el-tree>
          <el-button slot="reference" type="primary" size="mini">选择</el-button>
        </el-popover>
      </div>
      <div>
        <span>模版样式</span>
        <el-select v-model="templateStyle" size="mini" @change="selectTemplate">
          <el-option
            v-for="(item, index) of templateData"
            :key="index"
            :label="item.title"
            :value="index"
          ></el-option>
        </el-select>
      </div>
      <div class="params">
        <span>参数</span>
        <el-tag v-for="(item, index) of svcParams" :key="index" size="mini">
          <p
            @dragstart="drag(item.paramName)"
            draggable="true"
            style="margin: 0;"
          >{{item.paramName}}</p>
        </el-tag>
      </div>
    </header>
    <main @drop="onDrop" @dragover="dragOver">
      <ckeditor :editor="editor" v-model="editorData" @ready="onReady" ref="editor"></ckeditor>
    </main>
  </div>
</template>

<script>
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import templateData from '../templateData/data'
import { svcCate, svcMethod, svcParam } from '@/api/svc-controller'

export default {
  data () {
    return {
      templateData,
      templateStyle: '',
      editorData: '',
      editor: DecoupledEditor,
      props: {
        label: 'displayName',
        children: 'zones',
        isLeaf: 'leaf'
      },
      svcParams: [],
      dragPad: ''
    }
  },
  methods: {
    drag (name) {
      this.dragPad = name
    },
    onDrop () {
      this.insertValue(this.dragPad)
    },
    dragOver (e) {
      e.target.focus()
    },
    onReady (editor) {
      // Insert the toolbar before the editable area.
      editor.ui
        .getEditableElement()
        .parentElement.insertBefore(
          editor.ui.view.toolbar.element,
          editor.ui.getEditableElement()
        )
    },
    selectTemplate (index) {
      this.editorData = this.templateData[index].data
    },
    insertValue (param) {
      const editor = this.$refs.editor.instance
      editor.model.change(writer => {
        const insertPosition = editor.model.document.selection.getFirstPosition()
        writer.insertText(`[$${param}$]`, insertPosition)
      })
    },
    loadNode (node, resolve) {
      if (node.level === 0) {
        this._svcCate(resolve)
      }
      if (node.level === 1) {
        this._svcMethod(resolve, node.data.bizSvcId)
      }
    },
    _svcCate (resolve) {
      svcCate(`all/20/1`).then(res => {
        res = res.data
        const { code, data, msg } = res
        if (code === 'success') {
          resolve(data)
        } else {
          this.$message({
            showClose: true,
            message: msg,
            type: 'error'
          })
        }
      })
    },
    _svcMethod (resolve, cateId) {
      svcMethod(`${cateId}/20/1`).then(res => {
        res = res.data
        const { code, data, msg } = res
        if (code === 'success') {
          for (let item of data) {
            item['leaf'] = true
          }
          resolve(data)
        } else {
          this.$message({
            showClose: true,
            message: msg,
            type: 'error'
          })
        }
      })
    },
    _svcParam(id) {
      svcParam(`${id}/20/1`).then(res => {
        res = res.data
        const { code, data, msg } = res
        if (code === "success") {
          this.svcParams = data
        } else {
          this.$message({
            showClose: true,
            message: msg,
            type: "error"
          })
        }
      })
    },
    selectLeaf(data) {
      const { leaf, bizSvcMethodId } = data
      if (leaf) {
        this._svcParam(bizSvcMethodId)
      }
    }
  }
}
</script>

<style scoped>
header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 10px;
}
header div {
  margin-right: 10px;
}
header div span {
  font-size: 12px;
  margin-right: 10px;
}
header .params {
  width: calc(50vw - 40px);
  margin-top: 10px;
  min-height: 20px;
  display: flex;
  flex-wrap: wrap;
}
header .params /deep/ .el-tag {
  cursor: pointer;
  margin-bottom: 10px;
}
main /deep/ .ck-editor__editable {
  min-height: 300px;
}
main /deep/ .ck.ck-editor__editable_inline {
  background: #f7f7f7;
  height: 200px;
  overflow: auto;
}
</style>
