<template>
  <div class="basic-info">
    <el-form size="mini" :model="node" ref="dataForm" :rules="Rules" label-width="100px">
      <el-form-item label="类型：">
        <el-input class="input" v-model="node.type" :disabled="true" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="left坐标：" prop="left">
        <el-input class="input" v-model="node.left" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="top坐标：" prop="top">
        <el-input class="input" v-model="node.top" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="ico图标：" prop="ico">
        <el-input class="input" v-model="node.ico" size="mini"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" icon="el-icon-check" @click="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
export default {
  data () {
    return {
      node: {},
      Rules: {
        left: [
          { required: true, message: '请输入left坐标', trigger: 'blur' }
        ],
        top: [
          { required: true, message: '请输入top坐标', trigger: 'blur' }
        ],
        ico: [
          { required: true, message: '请输入ico图标', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /**
     * 表单修改
     * @param node
     */
    init (node) {
      this.node = cloneDeep(node)
    },
    // 保存
    save () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$emit('Reload', this.node)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .basic-info {
    padding: 10px;
    .input {
      width: 240px;
    }
  }
</style>
