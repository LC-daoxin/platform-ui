<template>
  <el-table :data="tableData" :height="tableHeight" size="mini" border stripe>
    <el-table-column
      v-for="(item, index) of columns"
      :key="index"
      :prop="item.prop"
      :label="item.label"
      :align="item.align"
      :width="item.width"
    >
      <template v-if="item.label==='操作'">
        <el-button type="primary" size="mini">编辑</el-button>
        <el-button type="primary" size="mini">校验</el-button>
        <el-button type="primary" size="mini">预览</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data () {
    return {
      tableHeight: window.innerHeight - 177,
      tableData: [{}],
      columns: [
        {
          label: '模板名称',
          prop: 'name',
          align: 'center'
        },
        {
          label: '模板编码',
          prop: '',
          align: 'center'
        },
        {
          label: '消息类型',
          prop: '',
          align: 'center'
        },
        {
          label: '版本',
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
          label: '创建操作',
          prop: '',
          align: 'center'
        },
        {
          label: '操作',
          prop: '',
          align: 'center',
          width: '230'
        }
      ]
    }
  }
}
</script>

<style>

</style>
