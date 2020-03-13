<template>
  <div class="dashboard-editor-container">
    <div class="adapter">
      <!-- 控制栏 start -->
      <div class="bar">
        <el-row>
          <el-col :span="14">
            <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="openAdapter()">新增</el-button>
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
      <!-- 适配器table start -->
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
        <el-table-column label="适配器名称" min-width="120" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.adapterName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="适配器描述" min-width="120" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.desc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="系统Id" min-width="90" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.systemId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="updateAdapter(scope.row)">编辑</el-button>
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
      <!-- 适配器table end -->
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
        :visible.sync="dialogAddAdapterVisible"
        :before-close='closeDialogApp'
        width="600px"
        class="AddDatabase"
      >
        <div class="dialogBody">
          <el-form ref="AddAdapterForm" :rules="rules" :model="temp" label-width="70px">
            <el-form-item label="适配器名称:" :label-width="formLabelWidth" prop="adapterName">
              <el-col :span="22">
                <el-input size="mini" v-model="temp.adapterName" autocomplete="off"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="关联系统id:" :label-width="formLabelWidth" prop="systemId">
              <el-col :span="22">
                <el-input size="mini" v-model="temp.systemId" autocomplete="off"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="适配器描述:" :label-width="formLabelWidth" prop="desc">
              <el-col :span="22">
                <el-input size="mini" v-model="temp.desc" autocomplete="off"></el-input>
              </el-col>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="closeDialogApp">取 消</el-button>
          <el-button size="mini" type="primary" @click="addAdapter()" v-if="titleText === '新增'">确 定</el-button>
          <el-button size="mini" type="primary" @click="saveUpdate()" v-if="titleText === '编辑'">保 存</el-button>
        </div>
      </el-dialog>
      <!-- 创建-弹窗 -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'adapter',
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
      dialogAddAdapterVisible: false, // 新增适配器 弹窗
      formLabelWidth: '140px',
      temp: {
        adapterName: '',
        systemId: '',
        desc: ''
      },
      rules: {
        adapterName: [
          { required: true, message: '请输入适配器名称', trigger: 'blur' }
        ],
        systemId: [
          { required: true, message: '请输入关联系统id', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请输入适配器描述', trigger: 'blur' }
        ]
      },
      titleText: '',
      adapterId: '', // 当前适配器ID
      loadingbtn: false // 导出loading
    }
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    // 获取适配器列表
    getInfo (pageSize = 20, pageNum = 0) {
      this.loading = true
      this.axios_M3.get(`/adapter/${pageSize}/${pageNum}`)
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
        Arr.push(el.adapterId)
      })
      this.multipleSelection = Arr
    },
    // 搜索
    search (start = 0) {
      if (this.searchValue === '') {
        this.getInfo(this.pageSize, start)
      } else {
        this.loading = true
        this.axios_M3.get(`/adapter/${this.searchValue}/${this.pageSize}/${start}`)
          .then(this.getInfoSucc)
      }
    },
    // 打开新增适配器
    openAdapter () {
      this.dialogAddAdapterVisible = true
      this.titleText = '新增'
    },
    // 添加适配器接口
    addAdapter () {
      this.$refs['AddAdapterForm'].validate((valid) => {
        if (valid) {
          let data = {
            adapterName: this.temp.adapterName,
            systemId: this.temp.systemId,
            desc: this.temp.desc
          }
          console.log(data)
          console.log(`/adapter/`)
          this.axios_M3.post(`/adapter/`, data).then((res) => {
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
          message: '请选择要删除的适配器！'
        })
      } else {
        this.$confirm(`确定要删除选择的适配器?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ID.forEach(item => {
            this.deleteAdapter(item)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    },
    // 删除适配器请求
    deleteAdapter (adapterId) {
      this.axios_M3.delete(`/adapter/${adapterId}`)
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
    // 打开编辑
    updateAdapter (row) {
      console.log(row)
      this.titleText = '编辑'
      this.adapterId = row.adapterId
      this.temp.adapterName = row.adapterName
      this.temp.systemId = row.systemId
      this.temp.desc = row.desc
      this.dialogAddAdapterVisible = true
      console.log(this.temp)
    },
    // 保存更新
    saveUpdate () {
      let data = {
        adapterId: this.adapterId,
        adapterName: this.temp.adapterName,
        systemId: this.temp.systemId,
        desc: this.temp.desc
      }
      console.log(data)
      this.axios_M3.put(`/adapter/`, data).then((res) => {
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
      this.adapterId = ''
    },
    // 关闭适配器对话框
    closeDialogApp () {
      this.clearTemp()
      this.$refs['AddAdapterForm'].resetFields()
      this.dialogAddAdapterVisible = false
    },
    // 导入适配器接口
    importFile (param) {
      let fd = new FormData()
      fd.append('file', param.file)
      this.axios_M3.post(`/adapter/import`, fd).then((res) => {
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
    // 导出适配器接口
    exportFile (param) {
      this.loadingbtn = true
      let fd = new FormData()
      fd.append('file', param.file)
      this.axios_M3.post(`/adapter/export`, fd, { responseType: 'blob' }).then((res) => {
        this.download(res)
        this.loadingbtn = false
      }).catch((err) => {
        console.log(err)
      })
    },
    // 导出适配器 单行接口
    exportFileRow (param) {
      console.log(param)
      param.data.loading = true
      console.log(`/adapter/export/${param.data.adapterId}`)
      let fd = new FormData()
      fd.append('file', param.file)
      this.axios_M3.post(`/adapter/export/${param.data.adapterId}`, fd, { responseType: 'blob' }).then((res) => {
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
.adapter {
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
