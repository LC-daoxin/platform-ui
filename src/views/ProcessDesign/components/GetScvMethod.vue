<template>
  <el-dialog
    title="服务方法"
    :visible.sync="dialogScvMethodVisible"
    :before-close='handleDialog'
    append-to-body
    width="800px"
  >
    <!-- 控制栏 start -->
    <div class="filter-container">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="搜索..." v-model="searchValue" clearable size="mini"/>
        </el-col>
        <el-col :span="3">
          <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="search()">查询</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 控制栏 end -->
    <!-- table start -->
    <el-table
      v-loading="loading"
      size="mini"
      :data="tableData"
      border
      highlight-current-row
      @current-change="handleCurrentChange"
      class="table"
      height="400px"
    >
      <el-table-column label="业务编码" min-width="120" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.bizSvcMethodCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="显示名称" min-width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.displayName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="方法名称" min-width="80" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.methodName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="返回值类型" min-width="85" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.returnType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务服务方法对应的sql语句" min-width="175" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.methodSql }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述信息" min-width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.desc }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- table end -->
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
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="select">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'get-scv-method',
  props: {
    dialogScvMethodVisible: {
      default: false
    }
  },
  data () {
    return {
      searchValue: '', // 搜索
      tableData: [],
      currentPage: 1, // 当前页码
      pageSize: 20, // 页条数
      totalCount: null, // 总条数
      multipleSelection: [], // 多选内容
      loading: false,
      bizSvc: null,
      bizSvcId: null, // 服务Id
      bizSvcMethod: null
    }
  },
  methods: {
    // 关闭对话框
    handleDialog () {
      this.$emit('showDialog')
    },
    init (row) {
      this.bizSvc = row
      this.bizSvcId = row.bizSvcId
      this.getInfo()
    },
    // 获取服务方法查询列表
    getInfo (pageSize = 20, pageNum = 0) {
      this.loading = true
      this.axios_M3.get(`/svc/method/${this.bizSvcId}/${pageSize}/${pageNum}`)
        .then(this.getInfoSucc)
    },
    getInfoSucc (res) {
      let data = res.data
      if (data.code === 'success') {
        this.tableData = data.data // ldap用户table
        this.totalCount = data.total // 总条数
        this.pageSize = data.pagesize // 页条数
        this.currentPage = data.pageNum // 当前页码
        this.loading = false
      }
    },
    // 当前页面条数
    handleSizeChange (val) {
      this.pageSize = val
      this.search()
    },
    // 页面码数
    handleCurrentChange (val) {
      this.currentPage = val
      this.search(this.currentPage)
    },
    // 搜索
    search (start = 0) {
      if (this.searchValue === '') {
        this.getInfo(this.pageSize, start)
      } else {
        this.axios_M3.get(`/svc/method/${this.bizSvcId}/${this.searchValue}/${this.pageSize}/${start}`)
          .then(this.getInfoSucc)
      }
    },
    handleCurrentChange (val) {
      console.log('服务方法', val)
      this.bizSvcMethod = val
    },
    select () {
      if (this.currentRow === null) {
        this.$message({
          type: 'warning',
          message: '请选择一条方法！'
        })
      } else {
        let data = {
          bizSvcId: this.bizSvcMethod.bizSvcId,
          bizSvcMethodId: this.bizSvcMethod.bizSvcMethodId,
          bizSvcMethodName: this.bizSvcMethod.methodName,
          bizSvcName: this.bizSvc.displayName
        }
        this.$emit('select', data)
        this.handleDialog()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 5px 20px !important;
}
.table {
  margin-top: 10px;
  ::v-deep .el-table-column--selection .cell{
    padding-right: 10px;
  }
  ::v-deep .el-button--mini {
    padding: 5px 8px;
    vertical-align: top;
  }
}
</style>
