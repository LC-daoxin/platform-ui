<template>
	<el-dialog
		title="新增策略组"
		:before-close='handleDialog'
		:visible.sync="addProcessBaseVisible"
		width="420px">
		<el-form ref="addProcessBaseForm" :rules="addProcessBaseRules" size="mini" :model="processBaseForm" label-width="120px">
			<el-form-item label="策略组名称：" prop="controlPointTypeCode">
				<el-input class="input" v-model="processBaseForm.controlPointTypeCode"></el-input>
			</el-form-item>
			<el-form-item label="策略组描述：" prop="controlPointTypeCodeDesc">
				<el-input class="input" v-model="processBaseForm.controlPointTypeCodeDesc"></el-input>
			</el-form-item>
			<el-form-item label="源系统：" prop="systemId">
				<el-select v-model="processBaseForm.systemId" placeholder="请选择">
					<el-option
						v-for="item in options.System"
						:key="item.id"
						:label="item.systemCode"
						:value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addProcessBase" size="mini">提交</el-button>
        <el-button @click="handleDialog" size="mini">取消</el-button>
      </span>
	</el-dialog>
</template>

<script>
export default {
  name: 'add-process-base',
  props: {
    ProcessData: Object,
    addProcessBaseVisible: {
      default: false
    }
  },
  data () {
    return {
      processBaseForm: {
        controlPointTypeCode: '', // 策略组名称
        controlPointTypeCodeDesc: '', // 策略组描述
        ProcessID: this.ProcessData.ProcessID,
        processName: this.ProcessData.DisplayName,
        processCode: this.ProcessData.processCode,
        controlPointType: null,
        systemId: '', // 源系统id
        referenceId: ''
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
      options: {
        System: []
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
    // 新增策略组
    addProcessBase () {
      this.$refs['addProcessBaseForm'].validate((valid) => {
        if (valid) {
          let data = {
            controlPointTypeCode: this.processBaseForm.controlPointTypeCode, // 策略组名称
            controlPointTypeCodeDesc: this.processBaseForm.controlPointTypeCodeDesc, // 策略组描述
            ProcessID: this.ProcessData.ProcessID,
            processName: this.ProcessData.DisplayName,
            processCode: this.ProcessData.processCode,
            controlPointType: null,
            systemId: this.processBaseForm.systemId, // 源系统id
            referenceId: ''
          }
          this.axios_M4.post(`/processbase/`, data).then((res) => {
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
            this.clearAddProcessBaseForm()
	          this.handleDialog()
          }).catch((err) => {
            console.log(err)
          })
        }
      })
    },
    // 清空processBaseForm
    clearAddProcessBaseForm () {
      this.processBaseForm = {
        controlPointTypeCode: '', // 策略组名称
        controlPointTypeCodeDesc: '', // 策略组描述
        ProcessID: '',
        processName: '',
        processCode: '',
        controlPointType: null,
        systemId: '', // 源系统id
        referenceId: ''
      }
    },
    // 关闭对话框
    handleDialog () {
      this.clearAddProcessBaseForm()
      this.$refs['addProcessBaseForm'].resetFields()
      this.$emit('showDialog', 'AddProcessBase')
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
