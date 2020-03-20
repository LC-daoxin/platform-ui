<template>
  <div class="basic-info">
    <el-form size="mini" :model="node" ref="dataForm" label-width="80px">
      <el-form-item label="类型">
        <el-input v-model="node.type" :disabled="true" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="node.name" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="left坐标">
        <el-input v-model="node.left" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="top坐标">
        <el-input v-model="node.top" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="ico图标">
        <el-input v-model="node.ico" size="mini"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="reset" size="mini" icon="el-icon-close">重置</el-button>
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
      data: {}
    }
  },
  methods: {
    /**
     * 表单修改，这里可以根据传入的ID进行业务信息获取
     * @param data
     * @param id
     */
    init (data, id) {
      this.data = data
      data.nodeList.filter((node) => {
        if (node.id === id) {
          console.log(node)
          this.node = cloneDeep(node)
        }
      })
    },
    reset () {
      this.data.nodeList.filter((node) => {
        if (node.id === this.node.id) {
          this.node = cloneDeep(node)
        }
      })
    },
    save () {
      this.data.nodeList.filter((node) => {
        if (node.id === this.node.id) {
          node.name = this.node.name
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .basic-info {
    padding: 10px;
  }
</style>
