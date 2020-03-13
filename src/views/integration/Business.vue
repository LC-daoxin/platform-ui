<template>
  <el-container class="business">
    <el-aside width="25%" class="page-left">
      <!-- 分类列表Tree -->
      <scv-cate-tree
        @getScvRow="getScvRow"
      />
      <!-- 分类列表Tree -->
    </el-aside>
    <el-main>
      <div class="content">
        <!-- 控制栏 start -->
        <div class="bar">
          <el-row>
            <el-col :span="12">
              <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="openScv()">新增</el-button>
              <el-button class="filter-item" type="danger" size="mini" icon="el-icon-minus" @click="deleteRecord(multipleSelection)">删除</el-button>
              <el-upload
                ref="upload"
                action="url"
                class="upload"
                :http-request="importFile"
                :show-file-list="false"
                auto-upload
                :limit="1"
              >
                <el-button icon="el-icon-upload2" size="mini" type="primary" plain>导入</el-button>
              </el-upload>
            </el-col>
            <el-col :span="12">
              <el-row type="flex" :gutter="5" justify="end">
                <el-col :span="10">
                  <el-input placeholder="搜索..." v-model="searchValue" clearable size="mini"/>
                </el-col>
                <el-col :span="11">
                  <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="search()">查询</el-button>
                  <el-button class="filter-item" type="primary" size="mini" icon="el-icon-refresh" @click="refresh()">刷新</el-button>
                </el-col>
              </el-row>
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
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            align="center"
            width="35">
          </el-table-column>
          <el-table-column label="服务编码" min-width="90" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.bizSvcCode }}</span>
            </template>
          </el-table-column>
          <el-table-column label="服务名称" min-width="100" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.displayName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="适配器类型" min-width="130" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.adapterType }}</span>
            </template>
          </el-table-column>
          <el-table-column label="表名" min-width="100" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.tableName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="描述信息" min-width="130" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.desc }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="260" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="updateScv(scope.row)">编辑</el-button>
              <el-button size="mini" type="primary" icon="el-icon-tickets" @click="ScvMethod(scope.row)">查看方法</el-button>
              <el-button icon="el-icon-download" size="mini" :loading="scope.row.loading" type="primary" plain @click="exportFileRow(scope.row)">导出</el-button>
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
      </div>
    </el-main>
    <!-- 创建/更新-弹窗 -->
    <el-dialog
      :title="titleText"
      :visible.sync="dialogAddScvVisible"
      :before-close='closeDialogApp'
      width="600px"
      class="AddDatabase"
    >
      <div class="dialogBody">
        <el-form ref="AddScvForm" :rules="rules" :model="temp" label-width="70px">
          <el-form-item label="业务编码:" :label-width="formLabelWidth" prop="bizSvcCode">
            <el-col :span="22">
              <el-input size="mini" v-model="temp.bizSvcCode" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="显示名称:" :label-width="formLabelWidth" prop="displayName">
            <el-col :span="22">
              <el-input size="mini" v-model="temp.displayName" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="适配器类型:" :label-width="formLabelWidth" prop="adapterType">
            <el-col :span="22">
              <el-input size="mini" v-model="temp.adapterType" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="表名:" :label-width="formLabelWidth" prop="tableName">
            <el-col :span="22">
              <el-input size="mini" v-model="temp.tableName" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="数据库连接id:" :label-width="formLabelWidth" prop="bizDbConnId">
            <el-col :span="22">
              <el-input size="mini" v-model="temp.bizDbConnId" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="业务分类编号:" :label-width="formLabelWidth" prop="bizSvcCategoryId">
            <el-col :span="22">
              <el-input size="mini" v-model="temp.bizSvcCategoryId" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="请求服务Url地址:" :label-width="formLabelWidth" prop="webSvcUrl">
            <el-col :span="22">
              <el-input size="mini" v-model="temp.webSvcUrl" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="请求服务用户名:" :label-width="formLabelWidth" prop="webSvcUserName">
            <el-col :span="22">
              <el-input size="mini" v-model="temp.webSvcUserName" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="请求服务密码:" :label-width="formLabelWidth" prop="webSvcPassword">
            <el-col :span="22">
              <el-input size="mini" v-model="temp.webSvcPassword" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="请求服务域:" :label-width="formLabelWidth" prop="webSvcDomain">
            <el-col :span="22">
              <el-input size="mini" v-model="temp.webSvcDomain" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="描述信息:" :label-width="formLabelWidth" prop="desc">
            <el-col :span="22">
              <el-input size="mini" v-model="temp.desc" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="关联系统id:" :label-width="formLabelWidth" prop="systemId">
            <el-col :span="22">
              <el-input size="mini" v-model="temp.systemId" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeDialogApp">取 消</el-button>
        <el-button size="mini" type="primary" @click="addScv()" v-if="titleText === '新增'">确 定</el-button>
        <el-button size="mini" type="primary" @click="saveUpdate()" v-if="titleText === '编辑'">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 创建-弹窗 -->
    <!-- 查看服务方法-弹窗 -->
    <scv-method
      @showDialog="closeDialog"
      :bizSvcId="bizSvcId"
      :dialogScvMethodVisible="dialogScvMethodVisible"
    />
    <!-- 查看服务方法-弹窗 -->
  </el-container>
</template>

<script>
import ScvMethod from './components/ScvMethod'
import ScvCateTree from './components/ScvCateTree'
export default {
  name: 'business',
  components: {
    ScvMethod,
    ScvCateTree
  },
  data () {
    return {
      searchValue: '', // 搜索内容
      tableData: [], // table
      currentPage: 1, // 当前页码
      pageSize: 20, // 页条数
      totalCount: null, // 总条数
      loading: false, // 加载
      currentID: '', // 当前服务分类ID
      multipleSelection: [], // 多选
      dialogAddScvVisible: false, // 添加-显隐
      dialogScvMethodVisible: false, // 弹窗 查看方法 默认关闭
      titleText: '', // 标题
      formLabelWidth: '130px',
      temp: {
        bizSvcCode: '',
        displayName: '',
        adapterType: '',
        tableName: '',
        bizDbConnId: '',
        bizSvcCategoryId: '',
        webSvcUrl: '',
        webSvcUserName: '',
        webSvcPassword: '',
        webSvcDomain: '',
        desc: '',
        systemId: ''
      },
      rules: {
        bizSvcCode: [
          { required: true, message: '请输入业务编码', trigger: 'blur' }
        ],
        displayName: [
          { required: true, message: '请输入显示名称', trigger: 'blur' }
        ],
        adapterType: [
          { required: true, message: '请输入适配器类型', trigger: 'blur' }
        ],
        tableName: [
          { required: true, message: '请输入表名', trigger: 'blur' }
        ],
        bizDbConnId: [
          { required: true, message: '请输入数据库连接id', trigger: 'blur' }
        ],
        bizSvcCategoryId: [
          { required: true, message: '请输入业务分类编号', trigger: 'blur' }
        ],
        webSvcUrl: [
          { required: true, message: '请输入请求webService的Url地址', trigger: 'blur' }
        ],
        webSvcUserName: [
          { required: true, message: '请输入请求webService的用户名', trigger: 'blur' }
        ],
        webSvcPassword: [
          { required: true, message: '请输入请求webService的密码', trigger: 'blur' }
        ],
        webSvcDomain: [
          { required: true, message: '请输入请求webService的域', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请输入描述信息', trigger: 'blur' }
        ],
        systemId: [
          { required: true, message: '请输入关联系统id', trigger: 'blur' }
        ]
      },
      bizSvcId: '',
      loadingbtn: false
    }
  },
  mounted () {
    // 初始化获取数据
    this.getInfo() // 用户组数据
  },
  methods: {
    // 获取业务服务table
    getInfo (pageSize = 20, pageNum = 0) {
      this.loading = true
      this.axios_M3.get(`/svc/${pageSize}/${pageNum}`)
        .then(this.getInfoSucc)
    },
    getInfoSucc (res) {
      console.log(res)
      if (res.data.code === 'success') {
        let data = res.data
        let addLoadingData = data.data
        if (addLoadingData.length > 0) {
          addLoadingData.forEach((row) => {
            row.loading = false
          })
        }
        this.tableData = addLoadingData
        this.totalCount = data.total // 总条数
        this.pageSize = data.pagesize // 页条数
        this.currentPage = data.pageNum // 当前页码
        this.loading = false
      }
    },
    // 服务查询接口
    getScvRowInfo (cateId = 0, name = 'all', pageSize = 20, pageNum = 0) {
      this.loading = true
      console.log(`/svc/${cateId}/${name}/${pageSize}/${pageNum}`)
      this.axios_M3.get(`/svc/${cateId}/${name}/${pageSize}/${pageNum}`)
        .then(this.getInfoSucc)
    },
    // 查询
    search (start = 0) {
      if (this.searchValue === '') {
        this.getInfo(this.pageSize, start)
      } else {
        this.axios_M3.get(`/svc/${this.searchValue}/${this.pageSize}/${start}`)
          .then(this.getInfoSucc)
      }
    },
    // 刷新
    refresh () {
      this.searchValue = '' // 清空搜索
      this.getInfo()
    },
    // Tree回调
    getScvRow (row) {
      console.log(row)
      this.currentID = row.id // 当前服务分类ID
      this.getScvRowInfo(this.currentID)
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
    // 打开新增
    openScv () {
      this.dialogAddScvVisible = true
      this.titleText = '新增'
    },
    // 新增业务服务
    addScv () {
      this.$refs['AddScvForm'].validate((valid) => {
        if (valid) {
          let data = {
            bizSvcCode: this.temp.bizSvcCode,
            displayName: this.temp.displayName,
            adapterType: this.temp.adapterType,
            tableName: this.temp.tableName,
            bizDbConnId: this.temp.bizDbConnId,
            bizSvcCategoryId: this.temp.bizSvcCategoryId,
            webSvcUrl: this.temp.webSvcUrl,
            webSvcUserName: this.temp.webSvcUserName,
            webSvcPassword: this.temp.webSvcPassword,
            webSvcDomain: this.temp.webSvcDomain,
            desc: this.temp.desc,
            systemId: this.temp.systemId
          }
          console.log(data)
          this.axios_M3.post(`/svc/`, data).then((res) => {
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
        } else {
          return false
        }
      })
    },
    // 打开编辑
    updateScv (row) {
      console.log(row)
      this.titleText = '编辑'
      this.bizSvcId = row.bizSvcId
      this.temp.bizSvcCode = row.bizSvcCode
      this.temp.displayName = row.displayName
      this.temp.adapterType = row.adapterType
      this.temp.tableName = row.tableName
      this.temp.bizDbConnId = row.bizDbConnId
      this.temp.bizSvcCategoryId = row.bizSvcCategoryId
      this.temp.webSvcUrl = row.webSvcUrl
      this.temp.webSvcUserName = row.webSvcUserName
      this.temp.webSvcPassword = row.webSvcPassword
      this.temp.webSvcDomain = row.webSvcDomain
      this.temp.desc = row.desc
      this.temp.systemId = row.systemId
      this.dialogAddScvVisible = true
      console.log(this.temp)
    },
    // 更新
    saveUpdate () {
      this.$refs['AddScvForm'].validate((valid) => {
        if (valid) {
          let data = {
            bizSvcId: this.bizSvcId,
            bizSvcCode: this.temp.bizSvcCode,
            displayName: this.temp.displayName,
            adapterType: this.temp.adapterType,
            tableName: this.temp.tableName,
            bizDbConnId: this.temp.bizDbConnId,
            bizSvcCategoryId: this.temp.bizSvcCategoryId,
            webSvcUrl: this.temp.webSvcUrl,
            webSvcUserName: this.temp.webSvcUserName,
            webSvcPassword: this.temp.webSvcPassword,
            webSvcDomain: this.temp.webSvcDomain,
            desc: this.temp.desc,
            systemId: this.temp.systemId
          }
          console.log(data)
          this.axios_M3.put(`/svc/`, data).then((res) => {
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
        } else {
          return false
        }
      })
    },
    // 关闭新增业务服务对话框
    closeDialogApp () {
      this.clearTemp()
      this.$refs['AddScvForm'].resetFields()
      this.dialogAddScvVisible = false
    },
    // 清空temp
    clearTemp () {
      this.temp = {
        bizSvcCode: '',
        displayName: '',
        adapterType: '',
        tableName: '',
        bizDbConnId: '',
        bizSvcCategoryId: '',
        webSvcUrl: '',
        webSvcUserName: '',
        webSvcPassword: '',
        webSvcDomain: '',
        desc: '',
        systemId: ''
      }
      this.bizSvcId = ''
    },
    // 关闭对话框
    closeDialog (name) {
      switch (name) {
        case 'ScvMethod':
          this.dialogScvMethodVisible = false
          break
      }
    },
    // 关闭添加用户组对话框
    handleDialog () {
      this.dialogAddGroupVisible = false
    },
    // 添加用户组
    addGroup () {
      this.axios.post('/group/', {
        PARENTID: this.parentID,
        NAME: this.temp.NAME,
        ORGANIZATION: this.temp.ORGANIZATION
      })
        .then((res) => {
          if (res.data.code === 'success') {
            this.refresh() // 刷新
            this.$message({
              type: 'success',
              message: res.data.msg
            })
            this.handleDialog()
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 多选
    handleSelectionChange (val) {
      let Arr = []
      val.forEach((el) => {
        Arr.push(el.bizSvcId)
      })
      this.multipleSelection = Arr
    },
    // 批量删除
    deleteRecord (ID) {
      if (ID.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的业务服务！'
        })
      } else {
        this.$confirm(`确定要删除选择的业务服务?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ID.forEach(item => {
            this.deleteScv(item)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    },
    // 删除业务服务请求
    deleteScv (bizSvcId) {
      this.axios_M3.delete(`/svc/${bizSvcId}`)
        .then((res) => {
          console.log(res)
          if (res.data.code === 'success') {
            if (res.data.data === null) {
              this.$message({
                type: 'success',
                message: res.data.msg
              })
            } else {
              this.$message({
                type: 'warning',
                message: res.data.data
              })
            }
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
          this.refresh() // 刷新
        })
    },
    // 导入业务服务接口
    importFile (param) {
      let fd = new FormData()
      fd.append('file', param.file)
      this.axios_M3.post(`/svc/import/${this.cateId}`, fd).then((res) => {
        console.log(res)
        if (res.data.code === 'success') {
          if (res.data.data === null) {
            this.$message({
              type: 'success',
              message: res.data.msg
            })
          } else {
            this.$message({
              type: 'warning',
              message: res.data.data
            })
          }
        } else {
          this.$message({
            type: 'warning',
            message: res.data.msg
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 导出业务服务 单行接口
    exportFileRow (row) {
      row.loading = true
      console.log(`/svc/export/${row.bizSvcId}`)
      this.axios_M3.post(`/svc/export/${row.bizSvcId}`, {}, { responseType: 'blob' }).then((res) => {
        this.download(res)
        row.loading = false
      }).catch((err) => {
        console.log(err)
      })
    },
    // 下载文件
    download (res) {
      console.log(res)
      const blob = new Blob([res.data])
      const fileName = res.headers['content-disposition'].split('=')[1]
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    },
    // 查看方法
    ScvMethod (row) {
      this.bizSvcId = row.bizSvcId
      this.dialogScvMethodVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.business {
  ::v-deep .el-button+.el-button {
    margin-left: 8px;
  }
  ::v-deep .el-table-column--selection .cell{
    padding-right: 10px;
  }
  ::v-deep .el-main {
    padding: 0;
  }
  height: calc(100vh);
  .page-left {
    height: 100%;
    border-right: 1px solid #eaecef;
  }
  .content {
    padding: 12px;
    .bar {
      .upload {
        display: inline-block;
        ::v-deep .el-button {
          height: 29px;
          margin: 0 10px;
        }
      }
      .download {
        display: inline-block;
        ::v-deep .el-button {
          height: 29px;
        }
      }
    }
    .table {
      margin-top: 5px;
      ::v-deep .el-button--mini {
        padding: 5px 8px;
        vertical-align: top;
      }
      .download {
        display: inline-block;
        ::v-deep .el-button {
          height: 29px;
          margin-left: 10px;
        }
      }
    }
  }
  .AddDatabase {
    ::v-deep .el-dialog__body {
      padding: 5px 20px;
    }
    ::v-deep .el-form-item {
      margin-bottom: 8px;
    }
    ::v-deep .el-form-item__error {
      padding-top: 0;
    }
    .dialogBody {
      max-height: 450px;
      overflow-y: auto;
    }
  }
}
</style>
