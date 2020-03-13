<template>
  <div class="App">
    <h1>应用管理</h1>
    <!-- 控制栏 start -->
    <div class="filter-container">
      <el-row>
        <el-col :span="24">
          <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="openApp()">创建</el-button>
          <el-button class="filter-item" type="primary" size="mini" icon="el-icon-minus" @click="deleteRecord(multipleSelection)">删除</el-button>
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
      height="450px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        align="center"
        width="55">
      </el-table-column>
      <el-table-column label="分类" min-width="70" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.cateName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应用名" min-width="110" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.appName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据库" min-width="80" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.bizDataBase }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务表名" min-width="140" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.bizTable }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公司代码字段" min-width="120" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.bizCompanyField }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间字段" min-width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.bizCreatedTimeField }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="150" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="updateApp(scope.row)">更新</el-button>
          <el-button size="mini" type="primary" @click="deleteRowApp(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 应用table end -->
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
    <!-- 选择应用分类-弹窗 -->
    <app-category
      @showDialog="closeDialog"
      :dialogAddCategoryVisible="dialogAddCategoryVisible"
      :CategoryBtnType="CategoryBtnType"
      @selectCategory="selectCategory"
    />
    <!-- 选择应用分类-弹窗 -->
    <!-- 创建/更新-弹窗 -->
    <el-dialog
      :title="titleText"
      :visible.sync="dialogAddAppVisible"
      :before-close='closeDialogApp'
      width="600px"
      class="AddApp"
    >
      <el-form ref="AddAppForm" :rules="rules" :model="temp" label-width="70px">
        <el-form-item label="所属分类:" :label-width="formLabelWidth">
          <el-col :span="22">
            <el-button size="mini" type="primary" @click="openCategory()">选择</el-button>
            <span v-if="this.selectCategoryVal.Name" class="Valbtn">{{ selectCategoryVal.Name }}</span>
          </el-col>
        </el-form-item>
        <el-form-item label="应用名称:" :label-width="formLabelWidth" prop="appName">
          <el-col :span="22">
            <el-input size="mini" v-model="temp.appName" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="业务数据库:" :label-width="formLabelWidth" prop="bizDataBase">
          <el-col :span="22">
            <el-input size="mini" v-model="temp.bizDataBase" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="业务表:" :label-width="formLabelWidth" prop="bizTable">
          <el-col :span="22">
            <el-input size="mini" v-model="temp.bizTable" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="公司代码字段:" :label-width="formLabelWidth" prop="bizCompanyField">
          <el-col :span="22">
            <el-input size="mini" v-model="temp.bizCompanyField" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="创建时间字段:" :label-width="formLabelWidth" prop="bizCreatedTimeField">
          <el-col :span="22">
            <el-input size="mini" v-model="temp.bizCreatedTimeField" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeDialogApp">取 消</el-button>
        <el-button size="mini" type="primary" @click="addApp()" v-if="titleText === '创建应用'">确 定</el-button>
        <el-button size="mini" type="primary" @click="saveUpdateApp()" v-if="titleText === '修改应用'">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 创建-弹窗 -->
  </div>
</template>

<script>
import AppCategory from './AppCategory'
export default {
  name: 'app-manage',
  components: {
    AppCategory
  },
  props: {
    currentCompanyID: [String, Number]
  },
  data () {
    return {
      tableData: [],
      currentPage: 1, // 当前页码
      pageSize: 20, // 页条数
      totalCount: null, // 总条数
      multipleSelection: '', // 多选内容
      loading: false,
      dialogAddAppVisible: false, // 新增应用 弹窗
      dialogAddCategoryVisible: false, // 弹窗 应用分类
      formLabelWidth: '110px',
      temp: {
        appName: '',
        bizDataBase: '',
        bizTable: '',
        rptCategoryID: '',
        bizCompanyField: '',
        bizCreatedTimeField: '',
        id: ''
      },
      CategoryBtnType: 2, // 应用分类 1为关闭 2为选择
      selectCategoryVal: {
        Name: null,
        ID: null
      }, // 被选中的应用分类
      rules: {
        appName: [
          { required: true, message: '请输入应用名称', trigger: 'blur' }
        ]
      },
      titleText: ''
    }
  },
  mounted () {
    this.getInfo()
  },
  watch: {
    currentCompanyID () {
      this.getInfo()
    }
  },
  methods: {
    // 获取应用列表
    getInfo (limit = 20, start = 0) {
      this.loading = true
      console.log(`/reportmanage/app/${limit}/${start}`)
      this.axios_M2.post(`/reportmanage/app/${limit}/${start}`, {})
        .then(this.getInfoSucc)
    },
    getInfoSucc (res) {
      console.log(res)
      let data = res.data
      if (data.code === 'success') {
        this.tableData = data.data // 应用table
        this.totalCount = data.total // 总条数
        this.pageSize = data.pagesize // 页条数
        this.currentPage = data.pageNum // 当前页码
        this.loading = false
      }
    },
    // 当前页面条数
    handleSizeChange (val) {
      this.pageSize = val
      this.getInfo(this.pageSize)
    },
    // 页面码数
    handleCurrentChange (val) {
      this.currentPage = val
      let currentNum = (val - 1) * this.pageSize
      this.getInfo(this.pageSize, currentNum)
    },
    // 多选
    handleSelectionChange (val) {
      let Arr = []
      val.forEach((el) => {
        Arr.push(el.id)
      })
      this.multipleSelection = Arr
    },
    // 打开新增app
    openApp () {
      this.dialogAddAppVisible = true
      this.titleText = '创建应用'
    },
    // 添加应用
    addApp () {
      this.$refs['AddAppForm'].validate((valid) => {
        if (valid) {
          if (!this.selectCategoryVal) {
            this.$message({
              type: 'warning',
              message: '请选择应用分类！'
            })
          } else {
            let data = {
              appName: this.temp.appName,
              bizDataBase: this.temp.bizDataBase,
              bizTable: this.temp.bizTable,
              rptCategoryID: this.selectCategoryVal.ID,
              bizCompanyField: this.temp.bizCompanyField,
              bizCreatedTimeField: this.temp.bizCreatedTimeField
            }
            console.log(data)
            this.axios_M2.post(`/reportmanage/app`, data).then((res) => {
              console.log(res)
              if (res.data.code === 'success') {
                this.$message({
                  type: 'success',
                  message: res.data.msg
                })
                this.closeDialogApp()
                this.refresh()
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.msg
                })
              }
            }).catch((err) => {
              console.log(err)
            })
          }
        } else {
          return false
        }
      })
    },
    // 批量删除
    deleteRecord (ID) {
      if (ID.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的应用！'
        })
      } else {
        this.$confirm(`确定要删除选择的应用信息?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ID.forEach(item => {
            this.deleteApp(item)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    },
    // 删除单个应用
    deleteRowApp (id) {
      this.$confirm(`确定要删除选择的应用信息?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteApp(id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 删除应用请求
    deleteApp (ID) {
      this.axios_M2.delete(`/reportmanage/app/${ID}`)
        .then((res) => {
          console.log(res)
          if (res.data.code === 'success') {
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
          this.refresh() // 刷新
        })
    },
    // 选择应用分类
    openCategory () {
      this.dialogAddCategoryVisible = true
    },
    // 刷新
    refresh () {
      this.getInfo()
    },
    // 打开更新
    updateApp (row) {
      console.log(row)
      this.titleText = '修改应用'
      this.temp.appName = row.appName
      this.temp.bizDataBase = row.bizDataBase
      this.temp.bizTable = row.bizTable
      this.temp.rptCategoryID = row.rptCategoryID
      this.temp.bizCompanyField = row.bizCompanyField
      this.temp.bizCreatedTimeField = row.bizCreatedTimeField
      this.temp.id = row.id
      this.selectCategoryVal.Name = row.cateName
      this.dialogAddAppVisible = true
      console.log(this.temp)
    },
    // 保存更新
    saveUpdateApp () {
      let data = {
        appName: this.temp.appName,
        bizDataBase: this.temp.bizDataBase,
        bizTable: this.temp.bizTable,
        rptCategoryID: this.selectCategoryVal.ID,
        bizCompanyField: this.temp.bizCompanyField,
        bizCreatedTimeField: this.temp.bizCreatedTimeField,
        id: this.temp.id
      }
      console.log(data)
      this.axios_M2.put(`/reportmanage/app`, data).then((res) => {
        console.log(res)
        if (res.data.code === 'success') {
          this.$message({
            type: 'success',
            message: res.data.msg
          })
          this.closeDialogApp()
          this.refresh()
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 清空temp
    clearTemp () {
      this.temp = {
        appName: '',
        bizDataBase: '',
        bizTable: '',
        rptCategoryID: '',
        bizCompanyField: '',
        bizCreatedTimeField: '',
        id: ''
      }
      this.selectCategoryVal.Name = null
    },
    // 关闭App对话框
    closeDialogApp () {
      this.clearTemp()
      this.$refs['AddAppForm'].resetFields()
      this.dialogAddAppVisible = false
    },
    // 关闭对话框
    closeDialog (name) {
      switch (name) {
        case 'AddCategory':
          this.dialogAddCategoryVisible = false
          break
      }
    },
    // 选中的应用分类
    selectCategory (val) {
      this.selectCategoryVal = val
    }
  }
}
</script>

<style lang="scss" scoped>
.AddApp {
  ::v-deep .el-dialog__body {
    padding: 5px 20px;
  }
  ::v-deep .el-form-item {
    margin-bottom: 8px;
  }
}
h1 {
  // box-sizing: border-box;
  // width: 100%;
  height: 33px;
  background: #f9f9f9;
  line-height: 33px;
  font-size: 16px;
  padding: 6px 15px;
  margin-bottom: 5px;
}
.table {
  margin-top: 10px;
  ::v-deep .el-table-column--selection .cell{
    padding-right: 10px;
  }
}
.Valbtn {
  margin-left: 15px;
}
</style>
