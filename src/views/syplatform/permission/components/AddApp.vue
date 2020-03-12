<template>
  <el-dialog
    title="应用选择"
    :visible.sync="dialogAddAppVisible"
    @open="getInfo"
    :before-close='handleDialog'
    width="720px"
  >
    <!-- 控制栏 start -->
    <div class="filter-container">
      <el-row :gutter="5">
        <el-col :span="5">
          <el-input placeholder="应用类型" v-model="temp.cateName" clearable size="mini"/>
        </el-col>
        <el-col :span="5">
          <el-input placeholder="应用名称" v-model="temp.appName" clearable size="mini"/>
        </el-col>
        <el-col :span="5">
          <el-input placeholder="数据库" v-model="temp.bizDataBase" clearable size="mini"/>
        </el-col>
        <el-col :span="5">
          <el-input placeholder="业务表名" v-model="temp.bizTable" clearable size="mini"/>
        </el-col>
        <el-col :span="4">
          <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="search()">查询</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 控制栏 end -->
    <!-- 用户table start -->
    <el-table
      v-loading="loading"
      size="mini"
      :data="tableData"
      border
      highlight-current-row
      class="table"
      height="420px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        align="center"
        width="35">
      </el-table-column>
      <el-table-column label="分类" min-width="80" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.cateName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应用名" min-width="90" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.appName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据库" min-width="90" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.bizDataBase }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务表名" min-width="120" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.bizTable }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 用户table end -->
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
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="addSure()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'add-admin',
  props: {
    dialogAddAppVisible: {
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
      temp: {
        appName: '',
        bizDataBase: '',
        bizTable: '',
        cateName: ''
      }
    }
  },
  methods: {
    // 关闭对话框
    handleDialog () {
      this.$emit('showDialog', 'AddApp')
    },
    // 获取应用列表
    getInfo (limit = 20, start = 0) {
      this.loading = true
      let data = {
        appName: this.temp.appName,
        bizDataBase: this.temp.bizDataBase,
        bizTable: this.temp.bizTable,
        cateName: this.temp.cateName
      }
      console.log(data)
      console.log(`/reportmanage/app/${limit}/${start}`)
      this.axios_M2.post(`/reportmanage/app/${limit}/${start}`, data)
        .then(this.getInfoSucc)
    },
    getInfoSucc (res) {
      console.log(res)
      let data = res.data
      if (data.code === 'success') {
        this.tableData = data.data // app table
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
      let currentNum = (val - 1) * this.pageSize
      this.search(currentNum)
    },
    // 多选
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 搜索
    search (start = 0) {
      this.getInfo(this.pageSize, start)
    },
    // 确定
    addSure () {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择应用！'
        })
      } else {
        this.multipleSelection.forEach(item => {
          this.$parent.addApp(item.id)
        })
        this.handleDialog()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 5px 20px;
}
.table {
  margin-top: 10px;
  ::v-deep .el-table-column--selection .cell{
    padding-right: 10px;
  }
}
</style>
