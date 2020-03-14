<template>
  <div class="process">
    <!-- 控制栏 start -->
    <div class="bar">
      <el-row>
        <el-col :span="24">
          <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus">批量添加</el-button>
          <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus">添加审批路径</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 控制栏 end -->
    <!-- 用户修改table start -->
    <el-table
      size="mini"
      :data="tableData"
      border
      highlight-current-row
      class="table"
    >
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column label="名称" min-width="110" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.Name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" min-width="90" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.Type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="success" icon="el-icon-setting">配置</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 用户修改table end -->
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 20, 30, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
      class="pagination"
    >
    </el-pagination>
    <!-- 分页 -->
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'process-configuration',
  data () {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      totalCount: 1
    }
  },
  mounted () {
    this.getHomeInfo()
  },
  methods: {
    getHomeInfo () {
      axios.get('/mock/UserModify.json')
        .then(this.getInfoSucc)
    },
    getInfoSucc (res) {
      this.tableData = res.data.items
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.process {
  // padding: 8px;
  .bar:not(:first-child) {
    margin-top: 5px;
  }
  .table {
    margin-top: 5px;
    ::v-deep .el-table-column--selection .cell{
      padding-right: 10px;
    }
    ::v-deep .el-button--mini {
      padding: 4px 8px;
    }
    .active {
      color: green;
      margin-right: 5px;
    }
    .btn-l {
      margin-left: 5px;
    }
  }
}
</style>
