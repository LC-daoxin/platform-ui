<template>
  <div class="content">
	  <el-form ref="addProcessConfigForm" :rules="addprocessConfigRules" size="mini" :model="processConfigFormCopy" label-width="100px">
		  <el-form-item label="策略名称：" prop="controlPointID">
			  <el-input class="input" v-model="processConfigFormCopy.controlPointID" :disabled="disabled"></el-input>
		  </el-form-item>
		  <el-form-item label="策略描述：" prop="controlPointDesc">
			  <el-input class="input" v-model="processConfigFormCopy.controlPointDesc" :disabled="disabled"></el-input>
		  </el-form-item>
		  <el-form-item>
			  <el-button v-if="!editShow" type="primary" size="mini" icon="el-icon-edit" @click="edit">编辑</el-button>
			  <div v-else>
				  <el-button type="success" size="mini" icon="el-icon-s-claim" @click="save">保存</el-button>
				  <el-button size="mini" icon="el-icon-circle-close" @click="cancel">取消</el-button>
			  </div>
		  </el-form-item>
	  </el-form>
  </div>
</template>

<script>
export default {
  props: {
    ProcessConfigData: Object
  },
  data () {
    return {
      processConfigFormCopy: {}, // Copy processConfigForm
      processConfigForm: {
        processConfigID: this.ProcessConfigData.processConfigID, // 策略ID
        processBaseId: this.ProcessConfigData.processBaseId, // 策略组ID
        controlPointID: this.ProcessConfigData.controlPointID, // 策略
        controlPointDesc: this.ProcessConfigData.controlPointDesc // 策略描述
      },
      options: {
        System: []
      },
      addprocessConfigRules: {
        controlPointID: [
          { required: true, message: '请输入策略名称', trigger: 'blur' }
        ],
        controlPointDesc: [
          { required: true, message: '请输入策略描述', trigger: 'blur' }
        ]
      },
      editShow: false,
      disabled: true // 编辑状态
    }
  },
  mounted () {
    this.getInfo()
  },
  watch: {
    ProcessConfigData (data) { // 监听改变
      this.processConfigForm = {
        processConfigID: this.ProcessConfigData.processConfigID, // 策略ID
        processBaseId: this.ProcessConfigData.processBaseId, // 策略组ID
        controlPointID: this.ProcessConfigData.controlPointID, // 策略
        controlPointDesc: this.ProcessConfigData.controlPointDesc // 策略描述
      }
      this.processConfigFormCopy = Object.assign({}, this.processConfigForm)
    }
  },
  methods: {
    // 获取数据
    getInfo () {
	    this.processConfigFormCopy = Object.assign({}, this.processConfigForm)
    },
    // 编辑属性
    edit () {
      this.editShow = true
      this.disabled = false
    },
	  // 保存属性
    save () {
      this.$refs['addProcessConfigForm'].validate((valid) => {
        if (valid) {
          let data = this.processConfigFormCopy
          console.log(data)
          this.axios_M4.put(`/processconfig/`, data).then((res) => {
            console.log(res)
            if (res.data.code === 'success') {
              this.$message({
                type: 'success',
                message: res.data.msg
              })
              this.editShow = false
              this.disabled = true
              this.$emit('updateTree')
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            }
          }).catch((err) => {
            console.log(err)
          })
        }
      })
    },
    // 取消属性
    cancel () {
      this.processConfigFormCopy = this.processConfigForm
      this.editShow = false
      this.disabled = true
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding: 10px 10px 10px 20px;
  .input {
    width: 240px;
  }
  ::v-deep .el-select {
		min-width: 240px;
  }
  ::v-deep .el-input.is-disabled .el-input__inner {
		background-color: #f9fbfe;
		border-color: #E4E7ED;
		color: #979ba2;
		cursor: not-allowed;
  }
}
</style>
