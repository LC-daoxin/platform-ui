<template>
    <div class="dashboard-editor-container">
        <header :class="{
          'header-layout-left': headerLayout === 'left'
        }">
            <slot name="header"></slot>
        </header>
        <main>
            <slot name="main"></slot>
        </main>
        <footer>
            <slot name="footer"></slot>
        </footer>
    </div>
</template>

<script>
export default {
  name: 'CurrencyTablePage',
  props: {
    headerLayout: String
  }
}
</script>

<style scoped>
    header {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
    .header-layout-left {
        justify-content: flex-start;
    }
    main {
        margin: 10px 0;
    }
</style>
