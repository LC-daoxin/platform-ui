<template>
	<el-dialog
		title="新增策略"
		:before-close='handleDialog'
		:visible.sync="addProcessConfigVisible"
		width="420px">
		<el-form ref="addProcessConfigForm" :rules="addProcessConfigRules" size="mini" :model="processConfigForm" label-width="120px">
			<el-form-item label="策略名称：" prop="controlPointID">
				<el-input class="input" v-model="processConfigForm.controlPointID"></el-input>
			</el-form-item>
			<el-form-item label="策略描述：" prop="controlPointDesc">
				<el-input class="input" v-model="processConfigForm.controlPointDesc"></el-input>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
        <el-button @click="addProcessConfig" size="mini">提交</el-button>
        <el-button type="primary" @click="handleDialog" size="mini">取消</el-button>
      </span>
	</el-dialog>
</template>

<script>
export default {
  name: 'add-process-base',
  props: {
    ProcessBaseData: Object,
    addProcessConfigVisible: {
      default: false
    }
  },
  data () {
    return {
      processConfigForm: {
        processBaseId: this.ProcessBaseData.ProcessBaseID, // 策略组id
        controlPointID: '', // 策略名称
        controlPointDesc: '' // 策略描述
      },
      addProcessConfigRules: {
        controlPointID: [
          { required: true, message: '请输入策略名称', trigger: 'blur' }
        ],
        controlPointDesc: [
          { required: true, message: '请输入策略描述', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 新增策略
    addProcessConfig () {
      this.$refs['addProcessConfigForm'].validate((valid) => {
        if (valid) {
          let data = {
            processBaseId: this.ProcessBaseData.ProcessBaseID, // 策略组id
            controlPointID: this.processConfigForm.controlPointID, // 策略名称
            controlPointDesc: this.processConfigForm.controlPointDesc // 策略描述
          }
          this.axios_M4.post(`/processconfig/`, data).then((res) => {
            console.log(res)
            if (res.data.code === 'success') {
              this.$message({
                type: 'success',
                message: res.data.msg
              })
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            }
            this.clearAddProcessConfigForm()
	          this.handleDialog()
          }).catch((err) => {
            console.log(err)
          })
        }
      })
    },
    // 清空 processConfigForm
    clearAddProcessConfigForm () {
      this.processConfigForm = {
        processBaseId: this.ProcessBaseData.ProcessBaseID, // 策略组id
        controlPointID: '', // 策略名称
        controlPointDesc: '' // 策略描述
      }
    },
    // 关闭对话框
    handleDialog () {
      this.clearAddProcessConfigForm()
      this.$refs['addProcessConfigForm'].resetFields()
      this.$emit('showDialog', 'AddProcessConfig')
    }
  }
}
</script>

<style lang="scss" scoped>
	.input {
		width: 250px;
	}
	::v-deep .el-dialog__body {
		padding: 5px 20px;
	}
	::v-deep .el-select {
		min-width: 250px;
	}
</style>
