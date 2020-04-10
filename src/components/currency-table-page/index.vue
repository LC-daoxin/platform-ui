<template>
    <div class="dashboard-editor-container">
        <header :class="{'header-layout-left': leftLayout}">
            <div v-if="!leftLayout" class="header-section">
                <slot name="header-left"></slot>
            </div>
            <slot name="header"></slot>
            <div v-if="!leftLayout" class="header-section">
                <slot name="header-right"></slot>
            </div>
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
  },
  computed: {
      leftLayout () {
          return this.headerLayout === 'left'
      }
  }
}
</script>

<style lang="scss"scoped>
    header {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        .header-section {
            display: flex;
            align-items: center;
        }
    }
    .header-right >>> .search-item {
        margin: 0;
    }
    .header-layout-left {
        justify-content: flex-start;
    }
    main {
        margin: 10px 0;
    }
</style>
