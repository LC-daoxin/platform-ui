<template>
  <el-dialog
    title="应用分类"
    :visible.sync="dialogAddCategoryVisible"
    @open="getInfo"
    :before-close='handleDialog'
    width="600px"
  >
    <!-- 控制栏 start -->
    <div class="filter-container">
      <el-row :gutter="10">
        <el-col :span="10">
          <el-input placeholder="分类名称" v-model="CategoryName"  size="mini"/>
        </el-col>
        <el-col :span="8">
          <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="search()">查询</el-button>
          <el-button class="filter-item" type="primary" size="mini" icon="el-icon-edit" @click="create()">创建</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 控制栏 end -->
    <!-- 应用table start -->
    <el-table
      v-loading="loading"
      size="mini"
      :data="tableData"
      border
      highlight-current-row
      class="table"
      height="400px"
      @current-change="handleCurrentUser"
    >
      <el-table-column label="分类名称" min-width="130" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-input v-model="scope.row.Name" size="mini"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="updateCategory(scope.row)">更新</el-button>
          <el-button size="mini" type="primary" @click="deleteCategory(scope.row.Name)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 应用table end -->
    <div slot="footer" class="dialog-footer">
      <el-button v-if="CategoryBtnType === 1" size="mini" type="primary" @click="handleDialog">确 定</el-button>
      <el-button v-if="CategoryBtnType === 2" size="mini" type="primary" @click="selectCategory()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'add-category',
  props: {
    CategoryBtnType: Number,
    dialogAddCategoryVisible: {
      default: false
    }
  },
  data () {
    return {
      CategoryName: '', // 分类名称 创建-搜索
      tableData: [],
      loading: false,
      currentCategory: '' // 选中应用分类
    }
  },
  methods: {
    // 关闭对话框
    handleDialog () {
      this.$emit('showDialog', 'AddCategory')
    },
    // 获取用户列表
    getInfo (name = 'all', limit = 20, start = 0) {
      this.loading = true
      console.log(`/reportmanage/appCategory/${name}/${limit}/${start}`)
      this.axios_M2.get(`/reportmanage/appCategory/${name}/${limit}/${start}`)
        .then(this.getInfoSucc)
    },
    getInfoSucc (res) {
      console.log(res)
      let data = res.data
      if (data.code === 'success') {
        this.tableData = data.data // ldap用户table
        this.loading = false
      }
    },
    // 刷新
    refresh () {
      this.CategoryName = ''
      this.search()
    },
    // 搜索
    search () {
      if (this.CategoryName === '') {
        this.getInfo('all')
      } else {
        this.getInfo(this.CategoryName)
      }
    },
    // 创建
    create () {
      if (this.CategoryName === '') {
        this.$message({
          type: 'warning',
          message: '请填写要创建的分类名称！'
        })
      } else {
        this.axios_M2.post(`/reportmanage/appCategory/${this.CategoryName}`)
          .then(res => {
            console.log(res)
            let data = res.data
            if (data.code === 'success') {
              this.$message({
                type: 'success',
                message: data.msg
              })
              this.refresh()
            } else {
              this.$message({
                type: 'error',
                message: data.msg
              })
            }
          })
      }
    },
    // 更新分类名称
    updateCategory (row) {
      this.axios_M2.put(`/reportmanage/appCategory/${row.ID}/${row.Name}`)
        .then(res => {
          console.log(res)
          let data = res.data
          if (data.code === 'success') {
            this.$message({
              type: 'success',
              message: data.msg
            })
            this.refresh()
          } else {
            this.$message({
              type: 'error',
              message: data.msg
            })
          }
        })
    },
    // 删除
    deleteCategory (name) {
      this.$confirm(`是否删除分类?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios_M2.delete(`/reportmanage/appCategory/${name}`)
          .then((res) => {
            console.log(res)
            if (res.data.code === 'success') {
              this.refresh() // 刷新
              this.$message({
                type: 'success',
                message: res.data.msg
              })
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 选中用户
    handleCurrentUser (val) {
      if (val) {
        this.currentCategory = val
      }
    },
    // 选择应用分类
    selectCategory () {
      console.log(this.currentCategory)
      if (this.currentCategory === '') {
        this.$message({
          type: 'warning',
          message: '请选择应用分类！'
        })
      } else {
        this.$emit('selectCategory', this.currentCategory)
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
