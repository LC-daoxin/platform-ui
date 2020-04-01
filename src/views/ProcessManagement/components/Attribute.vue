<template>
  <div class="content">
	  <el-form ref="addProcessForm" :rules="addProcessRules" size="mini" :model="processFormCopy" label-width="120px">
		  <el-form-item label="流程编码：" prop="ProcessCode">
			  <el-input class="input" v-model="processFormCopy.ProcessCode" :disabled="disabled"></el-input>
		  </el-form-item>
		  <el-form-item label="显示名称：" prop="DisplayName">
			  <el-input class="input" v-model="processFormCopy.DisplayName" :disabled="disabled"></el-input>
		  </el-form-item>
		  <el-form-item label="所属公司：" prop="CompanyCode">
			  <el-input class="input" v-model="processFormCopy.CompanyCode" :disabled="disabled"></el-input>
		  </el-form-item>
		  <el-form-item label="是否合并审批：" prop="CombineApprovalType">
			  <el-switch v-model="processFormCopy.CombineApprovalType" :disabled="disabled"></el-switch>
		  </el-form-item>
		  <el-form-item label="源系统：" prop="SystemId">
			  <el-select v-model="processFormCopy.SystemId" placeholder="请选择" :disabled="disabled">
				  <el-option
					  v-for="item in options.System"
					  :key="item.id"
					  :label="item.systemCode"
					  :value="item.id">
				  </el-option>
			  </el-select>
		  </el-form-item>
		  <el-form-item label="应用系统：" prop="ApplicationSystemID">
			  <el-select v-model="processFormCopy.ApplicationSystemID" placeholder="请选择" :disabled="disabled">
				  <el-option
					  v-for="item in options.ApplicationSystem"
					  :key="item.id"
					  :label="item.systemCode"
					  :value="item.id">
				  </el-option>
			  </el-select>
		  </el-form-item>
		  <el-form-item label="特殊业务编码：" prop="SpecialKey">
			  <el-input class="input" v-model="processFormCopy.SpecialKey" :disabled="disabled"></el-input>
		  </el-form-item>
		  <el-form-item label="流程版本：" prop="processVersion">
			  <el-input class="input" v-model="processFormCopy.processVersion" :disabled="disabled"></el-input>
		  </el-form-item>
		  <el-form-item label="排序：" prop="Sort">
			  <el-input class="input" v-model="processFormCopy.Sort" :disabled="disabled"></el-input>
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
    ProcessData: Object
  },
  data () {
    return {
      processFormCopy: {}, // Copy processForm
      processForm: {
        ProcessID: this.ProcessData.ProcessID, // 流程ID
        ProcSetID: this.ProcessData.ProcSetID, // 流程分类Id
        DisplayName: this.ProcessData.DisplayName, // 显示名称
        // processReferenceID: '', // 入口规则引用id
        ProcessCode: this.ProcessData.ProcessCode, // 流程编码
        // ProcessCategoryID: '', // 流程小分类Id
        processVersion: this.ProcessData.processVersion, // 流程版本
        CombineApprovalType: this.ProcessData.CombineApprovalType, // 是否合并审批
        Status: this.ProcessData.Status, // 默认为1 开启
        // ControlPointType: '', // 策略组？
        SystemId: this.ProcessData.SystemId, // 源系统
        SpecialKey: this.ProcessData.SpecialKey, // 特殊业务编码
        CompanyCode: this.ProcessData.CompanyCode, // 所属公司
        ApplicationSystemID: this.ProcessData.ApplicationSystemID, // 应用系统Id
        Sort: this.ProcessData.Sort // 排序
      },
      options: {
        System: [],
        ApplicationSystem: []
      },
      addProcessRules: {
        DisplayName: [
          { required: true, message: '请输入显示名称', trigger: 'blur' }
        ],
        ProcessCode: [
          { required: true, message: '请输入流程编码', trigger: 'blur' }
        ],
        processVersion: [
          { required: true, message: '请输入流程版本', trigger: 'blur' }
        ],
        SystemId: [
          { required: true, message: '请选择源系统', trigger: 'blur' }
        ],
        ApplicationSystemID: [
          { required: true, message: '请选择应用系统', trigger: 'blur' }
        ],
        SpecialKey: [
          { required: true, message: '请输入特殊业务编码', trigger: 'blur' }
        ],
        CompanyCode: [
          { required: true, message: '请输入所属公司', trigger: 'blur' }
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
    ProcessData (data) { // 监听改变
      this.processForm = {
        ProcessID: this.ProcessData.ProcessID, // 流程ID
        ProcSetID: this.ProcessData.ProcSetID, // 流程分类Id
        DisplayName: this.ProcessData.DisplayName, // 显示名称
        // processReferenceID: '', // 入口规则引用id
        ProcessCode: this.ProcessData.ProcessCode, // 流程编码
        // ProcessCategoryID: '', // 流程小分类Id
        processVersion: this.ProcessData.processVersion, // 流程版本
        CombineApprovalType: this.ProcessData.CombineApprovalType, // 是否合并审批
        Status: this.ProcessData.Status, // 默认为1 开启
        // ControlPointType: '', // 策略组？
        SystemId: this.ProcessData.SystemId, // 源系统
        SpecialKey: this.ProcessData.SpecialKey, // 特殊业务编码
        CompanyCode: this.ProcessData.CompanyCode, // 所属公司
        ApplicationSystemID: this.ProcessData.ApplicationSystemID, // 应用系统Id
        Sort: this.ProcessData.Sort // 排序
      }
      this.processFormCopy = Object.assign({}, this.processForm)
    }
  },
  methods: {
    // 获取数据
    getInfo () {
      this.getSystemId()
      this.getApplicationSystemId()
	    this.processFormCopy = Object.assign({}, this.processForm)
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
    // 获取应用系统
    getApplicationSystemId () {
      this.axios_M4.get(`/system/all/EERP/10000/1`)
        .then(res => {
          let data = res.data
          if (data.code === 'success') {
            this.options.ApplicationSystem = data.data
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
      this.$refs['addProcessForm'].validate((valid) => {
        if (valid) {
          this.processFormCopy.CombineApprovalType = this.processFormCopy.CombineApprovalType ? 1 : 0
          let data = this.processFormCopy
          this.axios_M4.put(`/process/`, data).then((res) => {
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
      this.processFormCopy = Object.assign({}, this.processForm)
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
