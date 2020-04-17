<template>
  <div class="search-item">
    <p>{{ label }}</p>
    <div class="container" :style="{width:coWidth}">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    coWidth: String
  }
}
</script>

<style lang="scss" scoped>
  .search-item {
    display: flex;
    align-items: center;
    margin-right: 10px;
    padding: 5px 0;

    p {
      font-size: 12px;
      white-space: nowrap;
      margin: 0 10px 0 0;
    }

    .container {
      width: 150px;
    }
  }
</style>
