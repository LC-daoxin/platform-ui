<template>
  <div class="content">
	  <el-form size="mini" :model="data" ref="dataForm" label-width="80px">
		  <el-form-item label="流程名称:">
			  <el-input class="input" v-model="data.name" :disabled="true" size="mini"></el-input>
		  </el-form-item>
		  <el-form-item label="流程描述:">
			  <el-input class="input" v-model="data.describe" size="mini" :disabled="disabled"></el-input>
		  </el-form-item>
		  <el-form-item label="所属公司:">
			  <el-select v-model="data.company" placeholder="请选择" :disabled="disabled">
				  <el-option
					  v-for="item in options.company"
					  :key="item.value"
					  :label="item.label"
					  :value="item.value">
				  </el-option>
			  </el-select>
		  </el-form-item>
		  <el-form-item label="源系统:">
			  <el-select v-model="data.other" placeholder="请选择" :disabled="disabled">
				  <el-option
					  v-for="item in options.other"
					  :key="item.value"
					  :label="item.label"
					  :value="item.value">
				  </el-option>
			  </el-select>
		  </el-form-item>
		  <el-form-item label="应用系统:">
			  <el-select v-model="data.other" placeholder="请选择" :disabled="disabled">
				  <el-option
					  v-for="item in options.other"
					  :key="item.value"
					  :label="item.label"
					  :value="item.value">
				  </el-option>
			  </el-select>
		  </el-form-item>
		  <el-form-item label="流程大类:">
			  <el-select v-model="data.other" placeholder="请选择" :disabled="disabled">
				  <el-option
					  v-for="item in options.other"
					  :key="item.value"
					  :label="item.label"
					  :value="item.value">
				  </el-option>
			  </el-select>
		  </el-form-item>
		  <el-form-item label="流程小类:">
			  <el-select v-model="data.other" placeholder="请选择" :disabled="disabled">
				  <el-option
					  v-for="item in options.other"
					  :key="item.value"
					  :label="item.label"
					  :value="item.value">
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
  data() {
    return {
      data: {
        name: 'ASZ测试流程0206',
        describe: 'ASZDemo01-001-Demo02',
	      company: '1',
        other: ''
      },
	    options: {
        company: [{
          value: '1',
          label: '中国海洋石油总公司'
        }],
        other: [{
          value: '选项1',
          label: 'Test'
        }]
	    },
      editShow: false,
      disabled: true // 编辑状态
    }
  },
  methods: {
    // 编辑属性
    edit () {
      this.editShow = true
	    this.disabled = false
    },
    // 保存属性
    save () {
      this.editShow = false
      this.disabled = true
    },
	  // 取消属性
    cancel () {
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