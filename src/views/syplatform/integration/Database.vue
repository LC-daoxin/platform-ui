<template>
  <div class="dashboard-editor-container">
    <div class="database">
      <!-- 控制栏 start -->
      <div class="bar">
        <el-row>
          <el-col :span="14">
            <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="openDatabase()">新增</el-button>
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
            <el-upload
              ref="upload"
              action="url"
              class="download"
              :http-request="exportFile"
              :show-file-list="false"
              auto-upload
              :limit="1"
            >
              <el-button icon="el-icon-download" size="mini" :loading="loadingbtn" type="primary" plain>全部导出</el-button>
            </el-upload>
          </el-col>
          <el-col :span="10">
            <el-row type="flex" :gutter="10" justify="end">
              <el-col :span="10">
                <el-input placeholder="名称" v-model="searchValue" clearable size="mini"/>
              </el-col>
              <el-col :span="6">
                <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" v-model="searchValue" @click="search()">搜索</el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <!-- 控制栏 end -->
      <!-- 数据库连接table start -->
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
        <el-table-column label="编码" min-width="90" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.bizDbConnCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="显示名称" min-width="110" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.displayName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数据库类型" min-width="80" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.dbType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="连接字符串" min-width="190" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.connString }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="updateDatabase(scope.row)">编辑</el-button>
            <el-button size="mini" :loading="scope.row.loading" type="success" icon="el-icon-link" @click="connect(scope.row)">{{ scope.row.loading ? '连接中' : '测试连接' }}</el-button>
            <el-upload
              action="url"
              :data="scope.row"
              class="download"
              :http-request="exportFileRow"
              :show-file-list="false"
              auto-upload
              :limit="1"
            >
              <el-button icon="el-icon-download" size="mini" :loading="scope.row.loading" type="primary" plain>导出</el-button>
            </el-upload>
          </template>
        </el-table-column>
      </el-table>
      <!-- 数据库连接table end -->
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
      <!-- 创建/更新-弹窗 -->
      <el-dialog
        :title="titleText"
        :visible.sync="dialogAddSysVisible"
        :before-close='closeDialogApp'
        width="600px"
        class="AddDatabase"
      >
        <div class="dialogBody">
          <el-form ref="AddDatabaseForm" :rules="rules" :model="temp" label-width="70px">
            <el-form-item label="业务编码:" :label-width="formLabelWidth" prop="bizDbConnCode">
              <el-col :span="22">
                <el-input size="mini" v-model="temp.bizDbConnCode" autocomplete="off"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="名称:" :label-width="formLabelWidth" prop="displayName">
              <el-col :span="22">
                <el-input size="mini" v-model="temp.displayName" autocomplete="off"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="数据库类型:" :label-width="formLabelWidth" prop="dbType">
              <el-col :span="22">
                <el-radio-group v-model="temp.dbType">
                  <el-radio label="SQLSERVER">SqlServer</el-radio>
                  <el-radio label="ORACLE">Oracle</el-radio>
                  <el-radio label="MYSQL">MySql</el-radio>
                </el-radio-group>
              </el-col>
            </el-form-item>
            <el-form-item label="服务器地址:" :label-width="formLabelWidth" prop="serverName">
              <el-col :span="22">
                <el-input size="mini" v-model="temp.serverName" autocomplete="off"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="数据库名称:" :label-width="formLabelWidth" prop="dbName">
              <el-col :span="22">
                <el-input size="mini" v-model="temp.dbName" autocomplete="off"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="端口:" :label-width="formLabelWidth" prop="port">
              <el-col :span="22">
                <el-input size="mini" v-model="temp.port" autocomplete="off"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="用户名:" :label-width="formLabelWidth" prop="dbLoginName">
              <el-col :span="22">
                <el-input size="mini" v-model="temp.dbLoginName" autocomplete="off"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="密码:" :label-width="formLabelWidth" prop="dbLoginPwd">
              <el-col :span="22">
                <el-input size="mini" v-model="temp.dbLoginPwd" autocomplete="off"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="数据库连接字符串:" :label-width="formLabelWidth" prop="connString">
              <el-col :span="22">
                <el-input type="textarea" v-model="temp.connString"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="描述信息:" :label-width="formLabelWidth">
              <el-col :span="22">
                <el-input size="mini" v-model="temp.desc" autocomplete="off"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="服务名称:" :label-width="formLabelWidth">
              <el-col :span="22">
                <el-input size="mini" v-model="temp.serviceName" autocomplete="off"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="系统id:" :label-width="formLabelWidth">
              <el-col :span="22">
                <el-input size="mini" v-model="temp.systemId" autocomplete="off"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="版本号:" :label-width="formLabelWidth">
              <el-col :span="22">
                <el-input size="mini" v-model="temp.version" autocomplete="off"></el-input>
              </el-col>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="closeDialogApp">取 消</el-button>
          <el-button size="mini" type="primary" @click="addDatabase()" v-if="titleText === '新增'">确 定</el-button>
          <el-button size="mini" type="primary" @click="saveUpdateDatabase()" v-if="titleText === '编辑'">保 存</el-button>
        </div>
      </el-dialog>
      <!-- 创建-弹窗 -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'database',
  components: {
  },
  data () {
    return {
      searchValue: '', // 搜索内容
      tableData: [],
      currentPage: 1, // 当前页码
      pageSize: 20, // 页条数
      totalCount: null, // 总条数
      multipleSelection: '', // 多选内容
      loading: false,
      dialogAddSysVisible: false, // 新增数据库链接 弹窗
      formLabelWidth: '140px',
      temp: {
        bizDbConnCode: '',
        displayName: '',
        dbType: 'SQLSERVER',
        serverName: '',
        dbName: '',
        port: '',
        dbLoginName: '',
        dbLoginPwd: '',
        connString: '',
        desc: '',
        serviceName: '',
        systemId: '',
        version: '',
        linkMode: null
      },
      rules: {
        bizDbConnCode: [
          { required: true, message: '请输入业务编码', trigger: 'blur' }
        ],
        displayName: [
          { required: true, message: '请输入应用名称', trigger: 'blur' }
        ],
        serverName: [
          { required: true, message: '请输入服务器地址', trigger: 'blur' }
        ],
        dbName: [
          { required: true, message: '请输入数据库名称', trigger: 'blur' }
        ],
        port: [
          { required: true, message: '请输入端口号', trigger: 'blur' }
        ],
        dbLoginName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        dbLoginPwd: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        connString: [
          { required: true, message: '请输入数据库连接字符串', trigger: 'blur' }
        ]
      },
      titleText: '',
      bizDbConnId: '', // 当前数据库连接ID
      loadingbtn: false // 导出loading
    }
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    // 获取数据库连接列表
    getInfo (pageSize = 20, pageNum = 0) {
      this.loading = true
      this.axios_M3.get(`/dbconn/${pageSize}/${pageNum}`)
        .then(this.getInfoSucc)
    },
    getInfoSucc (res) {
      console.log(res)
      let data = res.data
      data.data.forEach(item => { // 增加loading
        item.loading = false
      })
      console.log(data)
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
      this.getInfo(this.pageSize, this.currentPage)
    },
    // 多选
    handleSelectionChange (val) {
      let Arr = []
      val.forEach((el) => {
        Arr.push(el.bizDbConnId)
      })
      this.multipleSelection = Arr
    },
    // 搜索
    search (start = 0) {
      if (this.searchValue === '') {
        this.getInfo(this.pageSize, start)
      } else {
        this.loading = true
        this.axios_M3.get(`/dbconn/${this.searchValue}/${this.pageSize}/${start}`)
          .then(this.getInfoSucc)
      }
    },
    // 打开新增数据库连接
    openDatabase () {
      this.dialogAddSysVisible = true
      this.titleText = '新增'
    },
    // 添加数据库连接接口
    addDatabase () {
      this.$refs['AddDatabaseForm'].validate((valid) => {
        if (valid) {
          let data = {
            bizDbConnCode: this.temp.bizDbConnCode,
            displayName: this.temp.displayName,
            dbType: this.temp.dbType,
            serverName: this.temp.serverName,
            dbName: this.temp.dbName,
            port: this.temp.port,
            dbLoginName: this.temp.dbLoginName,
            dbLoginPwd: this.temp.dbLoginPwd,
            connString: this.temp.connString,
            desc: this.temp.desc,
            serviceName: this.temp.serviceName,
            systemId: this.temp.systemId,
            version: this.temp.version,
            linkMode: null
          }
          console.log(data)
          this.axios_M3.post(`/dbconn/`, data).then((res) => {
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
    // 批量删除
    deleteRecord (ID) {
      if (ID.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的数据库连接！'
        })
      } else {
        this.$confirm(`确定要删除选择的数据库连接?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ID.forEach(item => {
            this.deleteDatabase(item)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    },
    // 删除数据库连接请求
    deleteDatabase (dbConnId) {
      this.axios_M3.delete(`/dbconn/${dbConnId}`)
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
    // 刷新
    refresh () {
      this.getInfo()
    },
    // 打开更新
    updateDatabase (row) {
      console.log(row)
      this.titleText = '编辑'
      this.bizDbConnId = row.bizDbConnId
      this.temp.bizDbConnCode = row.bizDbConnCode
      this.temp.displayName = row.displayName
      this.temp.dbType = row.dbType
      this.temp.serverName = row.serverName
      this.temp.dbName = row.dbName
      this.temp.port = row.port
      this.temp.dbLoginName = row.dbLoginName
      this.temp.dbLoginPwd = row.dbLoginPwd
      this.temp.connString = row.connString
      this.temp.desc = row.desc
      this.temp.serviceName = row.serviceName
      this.temp.systemId = row.systemId
      this.temp.version = row.version
      this.temp.linkMode = row.linkMode
      this.dialogAddSysVisible = true
      console.log(this.temp)
    },
    // 保存更新
    saveUpdateDatabase () {
      let data = {
        bizDbConnId: this.bizDbConnId,
        bizDbConnCode: this.temp.bizDbConnCode,
        displayName: this.temp.displayName,
        dbType: this.temp.dbType,
        serverName: this.temp.serverName,
        dbName: this.temp.dbName,
        port: this.temp.port,
        dbLoginName: this.temp.dbLoginName,
        dbLoginPwd: this.temp.dbLoginPwd,
        connString: this.temp.connString,
        desc: this.temp.desc,
        serviceName: this.temp.serviceName,
        systemId: this.temp.systemId,
        version: this.temp.version,
        linkMode: this.temp.linkMode
      }
      console.log(data)
      this.axios_M3.put(`/dbconn/`, data).then((res) => {
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
    // 测试连接
    connect (row) {
      row.loading = true
      let data = {
        dbType: row.dbType,
        serverName: row.serverName,
        dbName: row.dbName,
        port: row.port,
        dbLoginName: row.dbLoginName,
        dbLoginPwd: row.dbLoginPwd
      }
      this.axios_M3.post(`/dbconn/testDBConn`, data).then((res) => {
        console.log(res)
        row.loading = false
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
        bizDbConnCode: '',
        displayName: '',
        dbType: 'SQLSERVER',
        serverName: '',
        dbName: '',
        port: '',
        dbLoginName: '',
        dbLoginPwd: '',
        connString: '',
        desc: '',
        serviceName: '',
        systemId: '',
        version: '',
        linkMode: null
      }
      this.bizDbConnId = ''
    },
    // 关闭App对话框
    closeDialogApp () {
      this.clearTemp()
      this.$refs['AddDatabaseForm'].resetFields()
      this.dialogAddSysVisible = false
    },
    // 导入数据库连接接口
    importFile (param) {
      let fd = new FormData()
      fd.append('file', param.file)
      this.axios_M3.post(`/dbconn/import`, fd).then((res) => {
        console.log(res)
        if (res.data.code === 'success') {
          this.$message({
            type: 'warning',
            message: res.data.data
          })
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
    // 导出数据库连接接口
    exportFile (param) {
      this.loadingbtn = true
      let fd = new FormData()
      fd.append('file', param.file)
      this.axios_M3.post(`/dbconn/export`, fd, { responseType: 'blob' }).then((res) => {
        this.loadingbtn = false
        this.download(res)
      }).catch((err) => {
        console.log(err)
      })
    },
    // 导出数据库连接 单行接口
    exportFileRow (param) {
      console.log(param)
      param.data.loading = true
      console.log(`/dbconn/export/${param.data.bizDbConnId}`)
      let fd = new FormData()
      fd.append('file', param.file)
      this.axios_M3.post(`/dbconn/export/${param.data.bizDbConnId}`, fd, { responseType: 'blob' }).then((res) => {
        this.download(res)
        param.data.loading = false
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
    }
  }
}
</script>

<style lang="scss" scoped>
.database {
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
  .table {
    margin-top: 10px;
    ::v-deep .el-table-column--selection .cell{
      padding-right: 10px;
    }
    .download {
      display: inline-block;
      ::v-deep .el-button {
        height: 29px;
        margin-left: 10px;
      }
    }
  }
  .Valbtn {
    margin-left: 15px;
  }
}
</style>
