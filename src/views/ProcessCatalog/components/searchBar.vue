<template>
  <div class="search-bar">
    <div class="button-co">
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd" size="mini">新增</el-button>
      <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete">删除</el-button>
    </div>
    <div class="search-co">
      <div class="search-item">
        <span>流程分类名称：</span>
        <el-input size="mini" v-model="search[0]"></el-input>
      </div>
      <div class="search-item">
        <span>流程分类编码：</span>
        <el-input size="mini" v-model="search[1]"></el-input>
      </div>
      <el-button type="primary" icon="el-icon-search" size="mini" @click="handleSearch">搜索</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      search: []
    }
  },
  methods: {
    handleSearch () {
      this.$emit('search', this.search)
    },
    handleDelete () {
      this.$emit('delete')
    },
    handleAdd () {
      this.$emit('add')
    }
  }
}
</script>

<style lang="scss" scoped>
  .search-bar {
    display: flex;
    justify-content: space-between;

    .search-co {
      display: flex;

      .search-item {
        display: flex;
        align-items: center;
        margin-right: 12px;

        span {
          font-size: 12px;
        }

        .el-input {
          width: 150px;
        }
      }
    }
  }
</style>
