<template>
  <el-table :data="tableData" :height="tableHeight" size="mini" border stripe>
    <el-table-column
      v-for="(item, index) of columns"
      :key="index"
      :prop="item.prop"
      :label="item.label"
      :align="item.align"
    >
      <template v-if="item.label==='操作'">
        <el-button type="primary" size="mini">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data() {
    return {
      tableHeight: window.innerHeight - 177,
      tableData: [{}],
      columns: [
        {
          label: '样式名称',
          prop: 'name',
          align: 'center'
        },
        {
          label: '样式用途',
          prop: '',
          align: 'center'
        },
        {
          label: '描述',
          prop: '',
          align: 'center'
        },
        {
          label: '创建人',
          prop: '',
          align: 'center'
        },
        {
          label: '创建日期',
          prop: '',
          align: 'center'
        },
        {
          label: '操作',
          prop: '',
          align: 'center'
        }
      ]
    }
  }
}
</script>

<style>

</style>