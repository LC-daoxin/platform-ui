<template>
  <main>
    <el-table
      :data="tableData"
      :height="tableHeight"
      size="mini"
      ref="multipleTable"
      @selection-change="selectChange"
      border
      stripe>
      <el-table-column type="selection" align="center" width="40"></el-table-column>
      <el-table-column fixed align="center" prop="displayName" label="流程分类名称"></el-table-column>
      <el-table-column fixed align="center" prop="setCode" label="流程分类编码"></el-table-column>
      <el-table-column fixed align="center" label="操作">
        <el-button type="primary" size="mini" @click="edit('修改', scope.row)">编辑</el-button>
      </el-table-column>
    </el-table>
  </main>
</template>

<script>
export default {
  props: {
    tableData: Array
  },
  data () {
    return {
      tableHeight: window.innerHeight - 212.67,
      columns: [
        {
          prop: 'displayName',
          label: '流程分类名称'
        }, {
          prop: 'setCode',
          label: '流程分类编码'
        }, {
          label: '操作'
        }
      ]
    }
  },
  methods: {
    selectChange (val) {
      this.$emit('select', val)
    },
    edit (title, row) {
      this.$emit('edit', title, row)
    }
  }
}
</script>

<style scoped>
  main {
    margin: 12px 0;
  }
</style>
