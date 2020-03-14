<template>
  <div class="basic-info">
    <!-- <div class="info-item">
      <span>节点名称：</span>
      <el-input size="mini" style="width:193px"></el-input>
    </div>
    <div class="info-item">
      <span>节点类型：</span>
      <el-select size="mini">
        <el-option>单项节点</el-option>
      </el-select>
    </div> -->
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
  data() {
    return {
      nodeType: '单项节点'
    }
  }
}
</script>

<style lang="scss" scoped>
  .basic-info {
    padding: 10px;

  //   .info-item span {
  //     font-size: 12px;
  //   }
  }
</style>