<template>
  <div class="process">
    <!-- 控制栏 start -->
    <!--<div class="bar">-->
      <!--<el-row :gutter="10">-->
        <!--<el-col :sm="5" :md="5" :lg="4">-->
          <!--<el-input placeholder="分类名称" size="mini"/>-->
        <!--</el-col>-->
        <!--<el-col :sm="6" :md="6" :lg="5">-->
          <!--<el-button class="filter-item" type="primary" size="mini" icon="el-icon-search">搜索</el-button>-->
          <!--<el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="openDialog('AddType')">新增流程分类</el-button>-->
        <!--</el-col>-->
      <!--</el-row>-->
    <!--</div>-->
    <!-- 控制栏 end -->
    <!-- 流程类别table start -->
    <el-table
      size="mini"
      :data="tableData"
      border
      highlight-current-row
      class="table"
    >
      <el-table-column
        type="selection"
        align="center"
        width="35">
      </el-table-column>
      <el-table-column label="功能名称" min-width="90" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.TypeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="70" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-tag size="small" :type="scope.row.Status ? 'success' : 'info'">{{ scope.row.Status ? 'True' : 'False' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="90" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <!--<el-button v-if="scope.row.Status" size="mini" type="danger" @click="start(scope)">禁用</el-button>-->
          <!--<el-button v-else size="mini" type="success" @click="start(scope)">启用</el-button>-->
          <el-button size="mini" type="primary" @click="openDialog('AddType')">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 流程类别table end -->
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
    <!-- 新增流程类型-弹窗 -->
    <add-process-type
      @showDialog="closeDialog"
      :dialogTypeVisible="dialogTypeVisible"
    />
    <!-- 新增流程类型-弹窗 -->
  </div>
</template>

<script>
import axios from 'axios'
import AddProcessType from './components/AddProcessType'
export default {
  name: 'process-type',
  components: {
    AddProcessType
  },
  data () {
    return {
      valueTime: '',
      tableData: [],
      currentPage: 1,
      pageSize: 5,
      totalCount: 20,
      dialogTypeVisible: false
    }
  },
  mounted () {
    this.getHomeInfo()
  },
  methods: {
    getHomeInfo () {
      axios.get('/api/Process3.json')
        .then(this.getHomeInfoSucc)
    },
    getHomeInfoSucc (res) {
      this.tableData = res.data.items
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    },
    lock () {
      this.$confirm('确定要锁定选择的用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '已锁定'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    deleteRecord () {
      this.$confirm('确定要删除选中的记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '已删除'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    openDialog (name) {
      switch (name) {
        case 'AddType':
          this.dialogTypeVisible = true
          break
      }
    },
    closeDialog (name) {
      switch (name) {
        case 'AddType':
          this.dialogTypeVisible = false
          break
      }
    },
    start (scope) {
      scope.row.Status = !scope.row.Status
    }
  }
}
</script>

<style lang="scss" scoped>
.process {
  padding: 8px;
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
