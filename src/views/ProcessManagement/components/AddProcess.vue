<template>
	<el-dialog
		title="新增流程"
		:before-close='handleDialog'
		:visible.sync="addProcessVisible"
		width="420px">
		<el-form ref="addProcessForm" :rules="addProcessRules" size="mini" :model="processForm" label-width="120px">
			<el-form-item label="流程编码：" prop="ProcessCode">
				<el-input class="input" v-model="processForm.ProcessCode"></el-input>
			</el-form-item>
			<el-form-item label="显示名称：" prop="DisplayName">
				<el-input class="input" v-model="processForm.DisplayName"></el-input>
			</el-form-item>
			<el-form-item label="所属公司：" prop="CompanyCode">
				<el-input class="input" v-model="processForm.CompanyCode"></el-input>
			</el-form-item>
			<el-form-item label="是否合并审批：" prop="CombineApprovalType">
				<el-switch v-model="processForm.CombineApprovalType"></el-switch>
			</el-form-item>
			<el-form-item label="源系统：" prop="SystemId">
				<el-select v-model="processForm.SystemId" placeholder="请选择">
					<el-option
						v-for="item in options.System"
						:key="item.id"
						:label="item.systemCode"
						:value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="应用系统：" prop="ApplicationSystemID">
				<el-select v-model="processForm.ApplicationSystemID" placeholder="请选择">
					<el-option
						v-for="item in options.ApplicationSystem"
						:key="item.id"
						:label="item.systemCode"
						:value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="特殊业务编码：" prop="SpecialKey">
				<el-input class="input" v-model="processForm.SpecialKey"></el-input>
			</el-form-item>
			<el-form-item label="流程版本：" prop="processVersion">
				<el-input class="input" v-model="processForm.processVersion"></el-input>
			</el-form-item>
			<el-form-item label="排序：" prop="Sort">
				<el-input class="input" v-model="processForm.Sort"></el-input>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addProcess" size="mini">提交</el-button>
        <el-button @click="handleDialog" size="mini">取消</el-button>
      </span>
	</el-dialog>
</template>

<script>
export default {
  name: 'add-process',
  props: {
    ProcessClassData: Object,
    addProcessVisible: {
      default: false
    }
  },
  data () {
    return {
      processForm: {
        ProcSetID: '', // 流程分类Id
        DisplayName: '', // 显示名称
        // processReferenceID: '', // 入口规则引用id
        ProcessCode: '', // 流程编码
        // ProcessCategoryID: '', // 流程小分类Id
        processVersion: '', // 流程版本
        CombineApprovalType: 0, // 是否合并审批
        Status: 1, // 默认为1 开启
        // ControlPointType: '', // 策略组？
        SystemId: '', // 源系统
        SpecialKey: '', // 特殊业务编码
        CompanyCode: '', // 所属公司
        ApplicationSystemID: '', // 应用系统Id
        Sort: '' // 排序
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
      options: {
        System: [],
        ApplicationSystem: []
      }
    }
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    // 获取数据
    getInfo () {
      this.getSystemId()
      this.getApplicationSystemId()
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
    // 新增流程
    addProcess () {
      this.$refs['addProcessForm'].validate((valid) => {
        if (valid) {
          let data = {
            ProcSetID: this.ProcessClassData.procSetId, // 流程分类Id
            DisplayName: this.processForm.DisplayName, // 显示名称
            // processReferenceID: '', // 入口规则引用id
            ProcessCode: this.processForm.ProcessCode, // 流程编码
            // ProcessCategoryID: '', // 流程小分类Id
            processVersion: this.processForm.processVersion, // 流程版本
            CombineApprovalType: this.processForm.CombineApprovalType ? 1 : 0, // 是否合并审批
            Status: 1, // 默认为1 开启
            // ControlPointType: '', // 策略组？
            SystemId: this.processForm.SystemId, // 源系统
            SpecialKey: this.processForm.SpecialKey, // 特殊业务编码
            CompanyCode: this.processForm.CompanyCode, // 所属公司
            ApplicationSystemID: this.processForm.ApplicationSystemID, // 应用系统Id
            Sort: this.processForm.Sort // 排序
          }
          this.axios_M4.post(`/process/`, data).then((res) => {
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
            this.clearAddProcessForm()
	          this.handleDialog()
          }).catch((err) => {
            console.log(err)
          })
        }
      })
    },
    // 清空processForm
    clearAddProcessForm () {
      this.processForm = {
        ProcSetID: '', // 流程分类Id
        DisplayName: '', // 显示名称
        // processReferenceID: '', // 入口规则引用id
        ProcessCode: '', // 流程编码
        // ProcessCategoryID: '', // 流程小分类Id
        processVersion: '', // 流程版本
        CombineApprovalType: 0, // 是否合并审批
        Status: 1, // 默认为1 开启
        // ControlPointType: '', // 策略组？
        SystemId: '', // 源系统
        SpecialKey: '', // 特殊业务编码
        CompanyCode: '', // 所属公司
        ApplicationSystemID: '', // 应用系统Id
        Sort: '' // 排序
      }
    },
    // 关闭对话框
    handleDialog () {
      this.clearAddProcessForm()
      this.$refs['addProcessForm'].resetFields()
      this.$emit('showDialog', 'AddProcess')
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
