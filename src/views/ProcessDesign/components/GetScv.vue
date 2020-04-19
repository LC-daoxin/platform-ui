<template>
  <el-dialog
    title="服务"
    :visible.sync="dialogScvVisible"
    @open="getInfo"
    :before-close='handleDialog'
    append-to-body
    width="900px"
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
    <!-- 业务table start -->
    <el-table
      size="mini"
      :data="tableData"
      border
      highlight-current-row
      class="table"
      v-loading="loading"
    >
      <el-table-column label="服务编码" min-width="120" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.bizSvcCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务名称" min-width="120" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.displayName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="适配器类型" min-width="120" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.adapterType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表名" min-width="80" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.tableName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述信息" min-width="150" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-tickets" @click="ScvMethod(scope.row)">查看方法</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 业务table end -->
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
    <!--<div slot="footer" class="dialog-footer">-->
      <!--<el-button size="mini" type="primary" @click="handleDialog">确 定</el-button>-->
    <!--</div>-->
    <!-- 查看方法参数-弹窗 -->
    <get-scv-method
      @showDialog="closeDialog"
      @select="addNodeSvc"
      ref="method"
      :dialogScvMethodVisible="dialogScvMethodVisible"
    />
    <!-- 查看方法参数-弹窗 -->
  </el-dialog>
</template>

<script>
import GetScvMethod from './GetScvMethod'
export default {
  name: 'get-scv',
  components: {
    GetScvMethod
  },
  props: {
    bizSvcId: String,
    dialogScvVisible: {
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
      dialogScvMethodVisible: false,
      loading: false,
      bizSvcMethodId: ''
    }
  },
  methods: {
    // 关闭对话框
    handleDialog () {
      this.$emit('showDialog', 'ScvMethod')
    },
    // 获取服务table
    getInfo (pageSize = 20, pageNum = 0) {
      this.loading = true
      this.axios_M3.get(`/svc/${pageSize}/${pageNum}`)
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
        this.axios_M3.get(`/svc/${this.searchValue}/${this.pageSize}/${start}`)
          .then(this.getInfoSucc)
      }
    },
    // 打开方法
    ScvMethod (row) {
      this.$refs.method.init(row)
      this.dialogScvMethodVisible = true
    },
    // 添加关联接口
    addNodeSvc (data) {
      this.$emit('addNodeSvc', data)
    },
    // 关闭对话框
    closeDialog (name) {
      this.dialogScvMethodVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 5px 20px 20px;
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
