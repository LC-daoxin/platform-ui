<template>
  <div>
    <header>
      <div>
        <span>数据源</span>
        <el-button type="primary" size="mini" icon="el-icon-plus"></el-button>
      </div>
      <div>
        <span>模版样式</span>
        <el-select v-model="templateStyle" size="mini" @change="selectTemplate">
          <el-option v-for="(item, index) of templateData" :key="index" :label="item.title" :value="index"></el-option>
        </el-select>
      </div>
      <el-button @click="insertValue">插入文本</el-button>
      <!-- <div>
        <span>编辑模式</span>
        <el-select size="mini"></el-select>
      </div> -->
    </header>
    <main>
      <ckeditor :editor="editor" v-model="editorData" @ready="onReady" ref="editor"></ckeditor>
    </main>
  </div>
</template>

<script>
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import templateData from '../templateData/data'

export default {
  data () {
    return {
      templateData,
      templateStyle: '',
      editorData: '',
      editor: DecoupledEditor
    }
  },
  methods: {
    onReady (editor) {
      // Insert the toolbar before the editable area.
      editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      )
    },
    selectTemplate (index) {
      this.editorData = this.templateData[index].data
    },
    insertValue () {
      const editor = this.$refs.editor.instance
      editor.model.change(writer => {
        const insertPosition = editor.model.document.selection.getFirstPosition()
        writer.insertText('foo', insertPosition)
      })
    }
  }
}
</script>

<style scoped>
  header {
    display: flex;
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
  main /deep/ .ck-editor__editable { min-height: 300px; }
</style>
