<template>
    <el-form :model="form" ref="form" label-width="80px" style="width:300px" size="mini">
      <el-form-item label="模版名称">
        <el-input size="mini"></el-input>
      </el-form-item>
      <el-form-item label="模版编码">
        <el-input size="mini"></el-input>
      </el-form-item>
      <el-form-item label="消息类型">
        <el-input size="mini"></el-input>
      </el-form-item>
      <el-form-item label="版本">
        <el-input size="mini"></el-input>
      </el-form-item>
      <el-form-item label="当前版本">
        <el-select v-model="form.version" size="mini">
          <el-option label="是" value="true"></el-option>
          <el-option label="否" value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="输出类型">
        <el-select v-model="form.outputType" size="mini">
          <el-option label="HTML" value="html"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述">
        <el-input size="mini"></el-input>
      </el-form-item>
    </el-form>
</template>

<script>
export default {
  data () {
    return {
      form: {
        version: '',
        outputType: ''
      },
      rules: {}
    }
  }
}
</script>
