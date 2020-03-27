<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="110px" size="mini">
    <el-form-item label="流程分类全称" prop="fullName">
      <el-input v-model="form.fullName" size="mini"></el-input>
    </el-form-item>
    <el-form-item label="流程分类名称" prop="displayName">
      <el-input v-model="form.displayName" size="mini"></el-input>
    </el-form-item>
    <el-form-item label="流程分类编码" prop="setCode">
      <el-input v-model="form.setCode" size="mini"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'DialogForm',
  props: {
    content: Object
  },
  data () {
    return {
      form: {
        fullName: '',
        displayName: '',
        setCode: ''
      },
      rules: {
        fullName: [
          { required: true, message: '请输入分类全称（K2）', trigger: 'blur' }
        ],
        displayName: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ],
        setCode: [
          { required: true, message: '请输入分类编码', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    content (newer) {
      if (newer) Object.assign(this.form, newer)
    }
  }
}
</script>

<style>

</style>
