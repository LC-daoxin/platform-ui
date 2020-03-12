<template>
  <el-dialog
    title="配置角色应用权限"
    :visible.sync="dialogAppGrantVisible"
    :before-close='cancelSave'
    @open='open'
    width="780px"
  >
    <el-row type="flex" justify="center" align="middle">
      <el-col :span="13">
        <h3 class="tableTitle">系统列表</h3>
        <el-row>
          <el-col :span="24">
            <el-row type="flex" :gutter="10">
              <el-col :span="7">
                <el-select v-model="value" placeholder="请选择" size="mini">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="7">
                <el-input placeholder="快速检索" v-model="searchValue"  size="mini"/>
              </el-col>
              <el-col :span="4">
                <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="search()">查询</el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <!-- 系统table start -->
        <el-table
          size="mini"
          :data="tableData"
          border
          highlight-current-row
          @row-click="addClickSystem"
          class="table"
          height="450px"
          v-loading="loading"
        >
          <el-table-column label="系统ID" min-width="100" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.systemCode }}</span>
            </template>
          </el-table-column>
          <el-table-column label="描述" min-width="280" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.text }}</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 系统table end -->
        <el-row>
          <el-col :span="24">
            <!-- 分页 -->
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[20]"
              :page-size="pageSize"
              layout="prev, pager, next"
              :total="totalCount"
              class="pagination"
            >
            </el-pagination>
            <!-- 分页 -->
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="2">
        <el-button class="btnRight" type="primary" icon="el-icon-arrow-right" size="mini"></el-button>
      </el-col>
      <el-col :span="9">
        <h3 class="tableTitle">应用权限列表</h3>
        <!-- 应用权限列表 start -->
        <el-table
          size="mini"
          :data="oldTableData"
          border
          highlight-current-row
          class="oldTable"
          height="450px"
          v-loading="loading2"
        >
          <el-table-column label="系统描述" min-width="160" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.text }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="60" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteID(scope.row.id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 应用权限列表 end -->
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="cancelSave()">取 消</el-button>
      <el-button size="mini" type="primary" @click="updateSystem()">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'group-relevance',
  props: {
    currentRow: Object,
    dialogAppGrantVisible: {
      default: false
    }
  },
  data () {
    return {
      options: [{
        value: 'all',
        label: '请选择'
      }, {
        value: 'code',
        label: '系统ID'
      }, {
        value: 'des',
        label: '描述'
      }],
      value: 'all',
      searchValue: '', // 搜索内容
      tableData: [],
      currentPage: 1, // 当前页码
      pageSize: 20, // 页条数
      totalCount: null, // 总条数
      oldTableData: [],
      loading: false, // 加载
      loading2: false, // 加载
      oldIds: [], // 更新前的关联系统id
      newIds: [], // 更新后的关联系统id
      permissionType: 'EERP_APPLICATION'
    }
  },
  mounted () {
  },
  methods: {
    // 关闭对话框
    handleDialog () {
      this.searchValue = ''
      this.value = 'all'
      this.$emit('showDialog', 'AppGrant')
    },
    // 打开对话框时，回调
    open () {
      this.getSystemInfo()
      this.getOldInfo()
    },
    // 页面码数
    handleCurrentChange (val) {
      this.currentPage = val
      let currentNum = (val - 1) * this.pageSize
      this.search(currentNum)
    },
    // 查询
    search (start = 0) {
      if (this.searchValue === '') {
        this.getSystemInfo('all', 'all', this.pageSize, start)
      } else {
        this.getSystemInfo(this.value, this.searchValue, this.pageSize, start)
      }
    },
    // 获取全部系统列表
    getSystemInfo (type = 'all', name = 'all', limit = 20, start = 0) {
      this.loading = true
      console.log(`/sap/queryAppGrant/${type}/${name}/${limit}/${start}`)
      this.axios_M2.get(`/sap/queryAppGrant/${type}/${name}/${limit}/${start}`)
        .then((res) => {
          console.log(res)
          let data = res.data
          if (data.code === 'success') {
            this.tableData = data.data // table
            this.totalCount = data.total // 总条数
            this.pageSize = data.pagesize // 页条数
            this.currentPage = data.pageNum // 当前页码
            this.loading = false
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
        })
    },
    // 获取当前关联列表
    getOldInfo () {
      this.loading2 = true
      this.axios_M2.get(`/permission/oldAppCheck/${this.currentRow.ROLEID}`)
        .then((res) => {
          let data = res.data
          if (data.code === 'success') {
            this.oldTableData = data.data // ldap用户table
            this.oldIds = [] // 清空old
            this.loading2 = false
            this.oldTableData.forEach((item) => {
              this.oldIds.push(item.id.toString())
            })
          }
        })
    },
    // 添加应用到角色
    addClickSystem (row) {
      console.log(row)
      let arr = this.oldTableData
      let hasID = false
      arr.forEach((item) => {
        if (item.id === row.id) {
          hasID = true
        }
      })
      if (!hasID) { // 已存在的关联系统不添加
        this.oldTableData.push(row)
      }
    },
    // 删除应用
    deleteID (id) {
      let arr = this.oldTableData
      arr.forEach((item, index) => {
        if (item.id === id) {
          this.oldTableData.splice(index, 1)
        }
      })
    },
    // 保存|更新 应用与角色关联
    updateSystem () {
      this.newIds = [] // 清空new
      let arr = this.oldTableData
      arr.forEach((item) => {
        this.newIds.push(item.id.toString())
      })
      let data = {
        'newIds': this.newIds,
        'oldIds': this.oldIds
      }
      console.log(data)
      this.axios_M2.put(`/permission/appCheck/${this.currentRow.SYSID}/${this.currentRow.ROLEID}/${this.permissionType}`, data)
        .then((res) => {
          if (res.data.code === 'success') {
            this.$message({
              type: 'success',
              message: res.data.msg
            })
          }
        })
      this.handleDialog() // 关闭对话框
    },
    // 取消保存
    cancelSave () {
      this.handleDialog() // 关闭对话框
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 5px 20px;
}
.tableTitle {
  margin-bottom: 10px;
  font-weight: bold;
}
.btnRight {
  margin: 0 auto;
  display: block;
}
.table {
  margin-top: 10px;
  ::v-deep .el-table-column--selection .cell{
    padding-right: 10px;
  }
}
.oldTable {
  ::v-deep .el-button--mini {
    padding: 5px 8px;
    vertical-align: top;
  }
}
</style>
