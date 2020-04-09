<template>
  <div class="search-item">
    <p>{{ label }}</p>
    <slot></slot>
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
      margin: 0 10px 10px 0;

      p {
        font-size: 12px;
        white-space: nowrap;
        margin: 0 10px 0 0;
      }
  }
</style>
