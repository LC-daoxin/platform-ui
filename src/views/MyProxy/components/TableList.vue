<template>
  <el-table :height="tableHeight" size="mini" border>
    <el-table-column label="流水号" prop="" align="center"></el-table-column>
    <el-table-column label="主题" prop="" align="center"></el-table-column>
    <el-table-column label="流程名称" prop="" align="center"></el-table-column>
    <el-table-column label="当前节点" prop="" align="center"></el-table-column>
    <el-table-column label="申请人" prop="" align="center"></el-table-column>
    <el-table-column label="操作时间" prop="" align="center"></el-table-column>
    <el-table-column label="流程图" prop="" align="center"></el-table-column>
  </el-table>
</template>

<script>
export default {
  data () {
    return {
      tableHeight: window.innerHeight - this.$parent.$children[0].$el.offsetHeight - 259
    }
  }
}
</script>
