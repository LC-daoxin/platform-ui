<template>
  <div class="dashboard-editor-container">
    <search-bar ref="searchBar"></search-bar>
    <table-list></table-list>
    <el-pagination layout="total, sizes, prev, pager, next, jumper" size="mini"></el-pagination>
  </div>
</template>

<script>
import SearchBar from './components/SearchBar'
import TableList from './components/TableList'

export default {
  components: {
    SearchBar,
    TableList
  }
}
</script>

<style scoped></style>
