<template>
  <div class="content">
	  <el-form ref="addProcessBaseForm" :rules="addProcessBaseRules" size="mini" :model="processBaseFormCopy" label-width="120px">
		  <el-form-item label="策略组名称：" prop="controlPointTypeCode">
			  <el-input class="input" v-model="processBaseFormCopy.controlPointTypeCode" :disabled="disabled"></el-input>
		  </el-form-item>
		  <el-form-item label="策略组描述：" prop="controlPointTypeCodeDesc">
			  <el-input class="input" v-model="processBaseFormCopy.controlPointTypeCodeDesc" :disabled="disabled"></el-input>
		  </el-form-item>
		  <el-form-item label="源系统：" prop="systemId">
			  <el-select v-model="processBaseFormCopy.systemId" placeholder="请选择" :disabled="disabled">
				  <el-option
					  v-for="item in options.System"
					  :key="item.id"
					  :label="item.systemCode"
					  :value="item.id">
				  </el-option>
			  </el-select>
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
    ProcessBaseData: Object
  },
  data () {
    return {
      processBaseFormCopy: {}, // Copy processBaseForm
      processBaseForm: {
        ProcessBaseID: this.ProcessBaseData.ProcessBaseID, // 策略组ID
        controlPointTypeCode: this.ProcessBaseData.controlPointTypeCode, // 策略组名称
        controlPointTypeCodeDesc: this.ProcessBaseData.controlPointTypeCodeDesc, // 策略组描述
        ProcessID: this.ProcessBaseData.ProcessID,
        processName: this.ProcessBaseData.DisplayName,
        processCode: this.ProcessBaseData.processCode,
        controlPointType: this.ProcessBaseData.controlPointType,
        systemId: this.ProcessBaseData.systemId, // 源系统id
        referenceId: this.ProcessBaseData.referenceId
      },
      options: {
        System: []
      },
      addProcessBaseRules: {
        controlPointTypeCode: [
          { required: true, message: '请输入策略组名称', trigger: 'blur' }
        ],
        controlPointTypeCodeDesc: [
          { required: true, message: '请输入策略组描述', trigger: 'blur' }
        ],
        systemId: [
          { required: true, message: '请选择源系统', trigger: 'blur' }
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
    ProcessBaseData (data) { // 监听改变
      this.processBaseForm = {
        ProcessBaseID: this.ProcessBaseData.ProcessBaseID, // 策略组ID
        controlPointTypeCode: this.ProcessBaseData.controlPointTypeCode, // 策略组名称
        controlPointTypeCodeDesc: this.ProcessBaseData.controlPointTypeCodeDesc, // 策略组描述
        ProcessID: this.ProcessBaseData.ProcessID,
        processName: this.ProcessBaseData.DisplayName,
        processCode: this.ProcessBaseData.processCode,
        controlPointType: this.ProcessBaseData.controlPointType,
        systemId: this.ProcessBaseData.systemId, // 源系统id
        referenceId: this.ProcessBaseData.referenceId
      }
      this.processBaseFormCopy = Object.assign({}, this.processBaseForm)
    }
  },
  methods: {
    // 获取数据
    getInfo () {
      this.getSystemId()
	    this.processBaseFormCopy = Object.assign({}, this.processBaseForm)
    },
    // 获取源系统
    getSystemId () {
      this.axios_M4.get(`/system/all/SAP/10000/1`)
        .then(res => {
          let data = res.data
          if (data.code === 'success') {
            this.options.System = data.data
          }
        })
    },
    // 编辑属性
    edit () {
      this.editShow = true
      this.disabled = false
    },
	  // 保存属性
    save () {
      this.$refs['addProcessBaseForm'].validate((valid) => {
        if (valid) {
          let data = this.processBaseFormCopy
          console.log(data)
          this.axios_M4.put(`/processbase/`, data).then((res) => {
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
      this.processBaseFormCopy = this.processBaseForm
      this.editShow = false
      this.disabled = true
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding: 10px 10px 10px 30px;
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
