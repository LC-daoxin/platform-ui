<template>
  <div class="content">
	  <el-form ref="addNodeForm" :rules="addNodeRules" size="mini" :model="NodeFormCopy" label-width="100px">
		  <el-form-item label="节点名称：" prop="nodeName">
			  <el-input class="input" v-model="NodeFormCopy.nodeName" :disabled="disabled"></el-input>
		  </el-form-item>
		  <el-form-item label="节点类型：" prop="nodeGroupType">
			  <el-select v-model="NodeFormCopy.nodeGroupType" placeholder="请选择" :disabled="disabled">
				  <el-option label="单项节点" :value="1"></el-option>
				  <el-option label="会签节点" disabled :value="2"></el-option>
			  </el-select>
		  </el-form-item>
		  <el-form-item label="节点顺序：" prop="nodeName">
			  <el-input class="input" v-model.number="NodeFormCopy.nodeOrder" :disabled="disabled"></el-input>
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
    NodeData: Object
  },
  data () {
    return {
      NodeFormCopy: {}, // Copy processConfigForm
      NodeForm: {
        nodeId: '', // 节点id
        processConfigID: '', // 策略ID
        nodeActivityID: null, // 活动Id
        nodeName: '', // 节点名
        nodeOrder: 1, // 节点排序
        nodeGroupType: '', // 节点类型 1.单项节点 2.会签节点
        parentNodeID: 0, // 父节点Id
        precedingRuleExpression: null, // 前置表达式
        endRuleExpression: null // 后置表达式
      },
      options: {
        System: []
      },
      addNodeRules: {
        nodeName: [
          { required: true, message: '请输入节点名称', trigger: 'blur' }
        ],
        nodeGroupType: [
          { required: true, message: '请输入节点类型', trigger: 'blur' }
        ],
        nodeOrder: [
          { required: true, message: '请输入节点顺序', trigger: 'blur' }
        ]
      },
      editShow: false,
      disabled: true, // 编辑状态
	    JSON: null,
	    currentOrder: null // 原始排序
    }
  },
  methods: {
    // 初始化
    init (node, json) {
      this.JSON = json
	    this.currentOrder = node.nodeOrder
      this.NodeForm.nodeId = node.nodeId // 节点id
      this.NodeForm.processConfigID = node.processConfigID // 策略ID
      this.NodeForm.nodeActivityID = node.nodeActivityID // 活动Id
      this.NodeForm.nodeName = node.nodeName // 节点名
      this.NodeForm.nodeOrder = node.nodeOrder // 节点排序
      this.NodeForm.nodeGroupType = node.nodeGroupType // 节点类型 1.单项节点 2.会签节点
      this.NodeForm.parentNodeID = node.parentNodeID // 父节点Id
      this.NodeForm.precedingRuleExpression = node.precedingRuleExpression // 前置表达式
      this.NodeForm.endRuleExpression = node.endRuleExpression // 后置表达式
      this.NodeFormCopy = Object.assign({}, this.NodeForm)
    },
    // 编辑属性
    edit () {
      this.editShow = true
      this.disabled = false
    },
	  // 保存属性
    save () {
      this.$refs['addNodeForm'].validate((valid) => {
        if (valid) {
          if (this.equalOrder()) {
            this.$message.error('该节点顺序已存在,不允许重复')
          } else {
            let data = this.NodeFormCopy
            console.log('更新基本信息', data)
            this.axios_M4.put(`/node/`, data).then((res) => {
              console.log(res)
              if (res.data.code === 'success') {
                this.$message({
                  type: 'success',
                  message: res.data.msg
                })
                this.editShow = false
                this.disabled = true
                this.$emit('updatePanel') // 刷新画布
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
        }
      })
    },
	  // 判断是否存在相同排序
    equalOrder () {
	    let flag = false
	    if (this.JSON) {
	      let currentOrder = this.NodeFormCopy.nodeOrder
        this.JSON.nodeList.forEach(item => {
          if (currentOrder === item.nodeOrder && currentOrder !== this.currentOrder) {
            flag = true
          }
        })
	    }
	    return flag
    },
    // 取消属性
    cancel () {
      this.NodeFormCopy = Object.assign({}, this.NodeForm)
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
