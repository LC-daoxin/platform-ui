<template>
  <el-dialog
    title="SAP系统角色同步"
    :visible.sync="dialogsapRoleVisible"
    :before-close='handleDialog'
    @open="open"
    width="720px"
  >
    <!-- 控制栏 start -->
    <div class="filter-container">
      <el-row>
        <el-col :span="6">
          <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="addRoles()">批量添加</el-button>
        </el-col>
        <el-col :span="18">
          <el-row type="flex" :gutter="10" justify="end">
            <el-col :span="7">
              <el-select v-model="value" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="7">
              <el-input placeholder="角色名..." v-model="searchValue"  size="mini"/>
            </el-col>
            <el-col :span="4">
              <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="search()">查询</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <!-- 控制栏 end -->
    <!-- 同步table start -->
    <el-table
      v-loading="loading"
      size="mini"
      :data="tableData"
      border
      highlight-current-row
      class="table"
      max-height="450px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        align="center"
        width="55">
      </el-table-column>
      <el-table-column label="角色名称" min-width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.synrolename }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色描述" min-width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.synroledesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="" min-width="50" align="center">
        <template slot-scope="scope">
          <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="AddRole(scope.row)">添加</el-button>
        </template>
      </el-table-column>
    </el-table>
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
    <!-- 同步table end -->
  </el-dialog>
</template>

<script>
import axios from 'axios'
export default {
  name: 'sap-role',
  props: {
    dialogsapRoleVisible: {
      default: false
    }
  },
  data () {
    return {
      options: [],
      value: '',
      searchValue: '', // 搜索内容
      tableData: [],
      currentPage: 1, // 当前页码
      pageSize: 20, // 页条数
      totalCount: null, // 总条数
      multipleSelection: [], // 多选内容
      loading: false
    }
  },
  methods: {
    // 关闭对话框
    handleDialog () {
      this.$emit('showDialog', 'sapRole')
    },
    // open 初始化
    open () {
      this.querySapSystem() // 获取SAP系统列表
    },
    // 获取SAP系统角色列表
    getSAProleInfo (systemId = '', roleName = 'all', limit = 20, start = 0) {
      this.loading = true
      // this.axios_M2.get(`/role/sapRole/${systemId}/${roleName}/${limit}/${start}`)
      //   .then(this.getInfoSucc)
      axios.get('/api/sapRole.json').then((res) => {
        let data = res.data
        console.log(data)
        if (data.code === 'success') {
          this.tableData = data.data // ldap用户table
          this.loading = false
        }
      })
    },
    getInfoSucc (res) {
      let data = res.data
      console.log(data)
      if (data.code === 'success') {
        this.tableData = data.data // ldap用户table
        this.loading = false
      }
    },
    // 获取SAP系统列表
    querySapSystem (systemCode = 'all', name = 'all') {
      this.axios_M2.get(`/system/querySapSystem/${systemCode}/${name}`)
        .then((res) => {
          if (res.data.code === 'success') {
            this.options = res.data.data
            this.value = res.data.data[0].value
            this.getSAProleInfo(res.data.data[0].value) // 获取SAP系统角色列表
          }
        })
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
    // 批量加载
    addRoles () {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择角色！'
        })
      } else {
        this.AddRole(this.multipleSelection, 1)
      }
    },
    // 添加角色
    AddRole (row, type) {
      let data = []
      if (type === 1) {
        if (row.length > 0) {
          row.forEach((item) => {
            data.push({
              CHANGEDAT: item.synrolechangedat,
              ROLEDESC: item.synroledesc,
              ROLENAME: item.synrolename,
              SYSID: this.value
            })
          })
        }
      } else {
        data.push({
          CHANGEDAT: row.synrolechangedat,
          ROLEDESC: row.synroledesc,
          ROLENAME: row.synrolename,
          SYSID: this.value
        })
      }
      console.log(data)
      this.axios_M2.post(`/addBatchRole`, data)
        .then((res) => {
          console.log(res)
        })
    },
    // 搜索
    search (start = 0) {
      if (this.searchValue === '') {
        this.getSAProleInfo(this.value, 'all', this.pageSize, start)
      } else {
        this.getSAProleInfo(this.value, this.searchValue, this.pageSize, start)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  margin-top: 10px;
  ::v-deep .el-table-column--selection .cell{
    padding-right: 10px;
  }
}
</style>
