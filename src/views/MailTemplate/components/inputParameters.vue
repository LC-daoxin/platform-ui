<template>
  <div class="dashboard-editor-container">
    <header>
      <span>名称</span>
      <span>编码</span>
      <span>默认值</span>
      <span>操作</span>
    </header>
    <main>
      <div v-for="(param, paramIndex) of params" :key="paramIndex" class="params-row">
        <div>
          <el-input size="mini" v-model="params[paramIndex].name"></el-input>
        </div>
        <div>
          <el-input size="mini" v-model="params[paramIndex].code"></el-input>
        </div>
        <div>
          <el-input size="mini" v-model="params[paramIndex].default"></el-input>
        </div>
        <div>
          <el-button
            type="primary"
            size="small"
            :disabled="params.length === 1"
            @click="deleteParam(paramIndex)">删除</el-button>
        </div>
        <div
          v-if="paramIndex === params.length - 1"
          class="add-co">
          <el-button @click="addParam" type="success" icon="el-icon-plus" size="mini" circle></el-button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  data () {
    return {
      params: [
        {
          name: '',
          code: '',
          default: ''
        }
      ]
    }
  },
  methods: {
    addParam () {
      this.params.push({
        name: '',
        code: '',
        default: ''
      })
    },
    deleteParam (index) {
      this.params.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
  header {
    display: flex;
    margin-bottom: 10px;

    span {
      flex: 1;
    }
  }
  main
    .params-row {
      position: relative;
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      div {
        flex: 1;
        padding-right: 10px;
        box-sizing: border-box;
      }

      .add-co {
        position: absolute;
        left: calc(75% + 66px);
      }
    }
</style>
