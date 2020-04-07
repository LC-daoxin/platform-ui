<template>
  <el-table :data="tableData" :height="tableHeight" size="mini" border stripe>
    <el-table-column porp="" label="模板名称" align="center"></el-table-column>
    <el-table-column porp="" label="模板编码" align="center"></el-table-column>
    <el-table-column porp="" label="消息类型" align="center"></el-table-column>
    <el-table-column porp="" label="版本" align="center"></el-table-column>
    <el-table-column porp="" label="描述" align="center"></el-table-column>
    <el-table-column porp="" label="创建人" align="center"></el-table-column>
    <el-table-column porp="" label="创建日期" align="center"></el-table-column>
    <el-table-column porp="" label="创建操作" align="center"></el-table-column>
    <el-table-column
      label="操作"
      align="center"
      :width="230"
    >
      <template slot-scope="scope">
        <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
        <el-button type="primary" size="mini">校验</el-button>
        <el-button type="primary" size="mini">预览</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    tableData: Array
  },
  data () {
    return {
      tableHeight: window.innerHeight - 177,
    }
  },
  methods: {
    handleEdit (row) {
      console.log(row)
      this.$emit('edit')
    }
  }
}
</script>

<style>

</style>
