<template>
  <div class="basic-info">
    <el-form size="mini">
      <el-form-item label="策略名称:">
        <el-input size="mini" style="width:240px" v-model="Name" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="策略描述:">
        <el-input size="mini" style="width:240px" v-model="Describe"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      Name: 'ASZDDemo01-TEST-审批策略',
      Describe: 'Test策略审批'
    }
  }
}
</script>

<style lang="scss" scoped>
  .basic-info {
    padding: 10px;
  }
</style>