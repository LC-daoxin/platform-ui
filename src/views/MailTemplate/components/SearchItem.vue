<template>
  <div class="search-item">
    <p>{{ label }}</p>
    <div class="container">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: String
  }
}
</script>

<style lang="scss" scoped>
  .search-item {
    display: flex;
    align-items: center;
    margin: 0 10px 0 0;

    p {
      font-size: 12px;
      white-space: nowrap;
      margin: 0 10px 0 0;
    }

    .container
      .el-input, .el-select {
        width: 130px;
      }
  }
</style>
