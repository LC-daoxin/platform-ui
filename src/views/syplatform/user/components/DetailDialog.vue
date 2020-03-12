<template>
  <el-dialog
    title="用户细节"
    :visible.sync="dialogDetailVisible"
    :before-close='handleDialog'
    width="600px"
    class="Detail"
  >
    <el-form>
      <el-form-item label="账号:" :label-width="formLabelWidth">
        <el-col :span="22">
          <el-input size="mini" v-model="Info.ACCOUNT" autocomplete="off" disabled></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="用户名:" :label-width="formLabelWidth">
        <el-col :span="22">
          <el-input size="mini" v-model="Info.NAME" autocomplete="off" disabled></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="显示姓名:" :label-width="formLabelWidth">
        <el-col :span="22">
          <el-input
            size="mini"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="Info.DISNAME"
            disabled
          >
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="邮箱:" :label-width="formLabelWidth">
        <el-col :span="22">
          <el-input size="mini" v-model="Info.EMAIL" autocomplete="off" disabled></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="电话:" :label-width="formLabelWidth">
        <el-col :span="22">
          <el-input size="mini" v-model="Info.TELPHONE" autocomplete="off" disabled></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="所处组:" :label-width="formLabelWidth">
        <el-col :span="22">
          <el-input
            size="mini"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="Info.GROUP"
            disabled
          >
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="状态:" :label-width="formLabelWidth">
        <el-col :span="22">
          <el-input size="mini" v-model="Status" autocomplete="off" disabled></el-input>
        </el-col>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: 'detail-dialog',
  props: {
    Info: Object,
    dialogDetailVisible: {
      default: false
    }
  },
  data () {
    return {
      formLabelWidth: '100px',
      Status: ''
    }
  },
  methods: {
    handleDialog () {
      this.$emit('showDialog', 'Detail')
    }
  },
  mounted () {
    this.Status = this.Info.ENABLE ? '禁止' : '活动'
  }
}
</script>

<style lang="scss" scoped>
  .Detail {
    ::v-deep .el-form-item {
      margin-bottom: 10px;
    }
  }
</style>
