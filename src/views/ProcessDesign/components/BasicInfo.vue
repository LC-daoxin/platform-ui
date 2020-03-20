<template>
  <div class="basic-info">
    <el-form size="mini">
      <el-form-item label="节点名称:">
        <el-input size="mini" style="width:193px"></el-input>
      </el-form-item>
      <el-form-item label="节点类型:">
        <el-select size="mini" v-model="nodeType">
          <el-option value="">单项节点</el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      nodeType: '单项节点'
    }
  }
}
</script>

<style lang="scss" scoped>
  .basic-info {
    padding: 10px;
  }
</style>
