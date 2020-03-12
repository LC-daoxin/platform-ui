<template>
  <el-container class="role">
    <el-aside width="25%" class="page-left">
      <div class="header">系统</div>
      <!-- 系统Tree -->
      <system-tree
        @getRoleRow="getRoleRow"
      />
      <!-- 用户组Tree -->
    </el-aside>
    <el-main>
      <div class="fileBox">
        <div class="header">导入</div>
        <div class="fileBox-content">
          <el-upload
            ref="upload"
            action="url"
            class="upload-demo"
            :http-request="importFile"
            :auto-upload="false"
            :on-success="importClear"
            :before-remove="beforeRemove"
            :limit="1"
            :on-exceed="handleExceed"
          >
            <span class="babel">上传Excel文件：</span>
            <el-button size="mini" type="primary" plain>点击上传</el-button>
          </el-upload>
          <el-row class="btnBox" type="flex" justify="center">
            <el-button size="mini" type="primary" @click="submitUpload()">导入角色</el-button>
          </el-row>
          <el-row class="downloadBox" type="flex" justify="center">
            <el-tag size="small">角色模版下载</el-tag>
          </el-row>
        </div>
        <div class="exportBox" v-if="exportBoxShow">
          <!-- 导入结果table start -->
          <el-table
            size="mini"
            :data="tableData"
            border
            highlight-current-row
            class="table"
            max-height="260px"
          >
            <el-table-column
              type="index"
              width="40"
              align="center"
            >
            </el-table-column>
            <el-table-column label="用户AD" min-width="60" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{ scope.row.userAD }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="60" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{ scope.row.operation }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" min-width="220" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{ scope.row.describe }}</span>
              </template>
            </el-table-column>
          </el-table>
          <!-- 导入结果table end -->
        </div>
      </div>
      <div class="fileBox">
        <div class="header">导出</div>
        <div class="fileBox-content">
          <el-upload
            ref="Export"
            class="upload-demo"
            action="url"
            :http-request="exportFile"
            :auto-upload="false"
            :on-success="exportClear"
            :before-remove="beforeRemove"
            :limit="1"
            :on-exceed="handleExceed"
          >
            <span class="babel">上传Excel文件：</span>
            <el-button size="mini" type="primary" plain>点击上传</el-button>
          </el-upload>
          <el-row class="btnBox" type="flex" justify="center">
            <el-button size="mini" type="primary" :loading="loading.btn1" @click="submitExport('1')">导出角色</el-button>
            <el-button size="mini" type="primary" :loading="loading.btn2" @click="batchExportSysRole()">导出系统角色</el-button>
            <el-button size="mini" type="primary" :loading="loading.btn3" @click="submitExport('3')">SAP角色查询</el-button>
            <el-button size="mini" type="primary" :loading="loading.btn4" @click="submitExport('4')">导出包含角色的用户</el-button>
          </el-row>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import SystemTree from './components/SystemTree'
export default {
  name: 'batch-import-role',
  components: {
    SystemTree
  },
  data () {
    return {
      currentSysID: '', // 当前选择的系统ID
      ExportType: '', // 导出类型
      loading: {
        btn1: false, // 导出用户 加载
        btn2: false, // 全部导出用户 加载
        btn3: false, // 导出用户组用户 加载
        btn4: false // 导出AD域用户 加载
      },
      tableData: [],
      exportBoxShow: false // 结果显示
    }
  },
  methods: {
    // Tree回调
    getRoleRow (row) {
      this.currentSysID = row.id // 当前选择用户组ID
    },
    // 文件超出个数限制时的钩子
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，请先删除文件再上传`)
    },
    // 删除文件之前的钩子，参数为上传的文件和文件列表
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 导入按钮
    submitUpload () {
      if (this.$refs.upload.uploadFiles.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要导入的文件！'
        })
      } else if (this.currentSysID === '') {
        this.$message({
          type: 'warning',
          message: '请选择要导入到的系统！'
        })
      } else {
        this.$refs.upload.submit()
      }
    },
    // 自定义导入请求
    importFile (param) {
      let fd = new FormData()
      fd.append('file', param.file)
      this.batchImportRole(fd, param) // 批量角色导入
    },
    // 清空已上传的文件列表
    importClear () {
      this.$refs.upload.clearFiles() // 清空已上传的文件列表
    },
    // 导入结果清空
    exportTableClear () {
      this.exportBoxShow = false
      this.tableData = []
    },
    // 导入结果
    exportResult (res, operation, msg1, msg2, msg3, msg4, msg5, msg6) {
      this.exportBoxShow = true
      let arrObj = res.data.data
      let tableData = []
      for (let prop in arrObj) {
        if (arrObj[prop].length > 0) {
          switch (prop) {
            case 'success':
              for (let user of arrObj[prop]) {
                tableData.push({
                  'userAD': user,
                  'operation': operation,
                  'describe': msg1
                })
              }
              break
            case 'fail':
              for (let user of arrObj[prop]) {
                tableData.push({
                  'userAD': user,
                  'operation': operation,
                  'describe': msg2
                })
              }
              break
            case 'existedArray':
              for (let user of arrObj[prop]) {
                tableData.push({
                  'userAD': user,
                  'operation': operation,
                  'describe': msg3
                })
              }
              break
            case 'activate':
              for (let user of arrObj[prop]) {
                tableData.push({
                  'userAD': user,
                  'operation': operation,
                  'describe': msg4
                })
              }
              break
            case 'locked':
              for (let user of arrObj[prop]) {
                tableData.push({
                  'userAD': user,
                  'operation': operation,
                  'describe': msg5
                })
              }
              break
            case 'notExist':
              for (let user of arrObj[prop]) {
                tableData.push({
                  'userAD': user,
                  'operation': operation,
                  'describe': msg6
                })
              }
              break
          }
        }
      }
      this.tableData = tableData
    },
    // 批量角色导入
    batchImportRole (data, param) {
      this.axios_M2.post(`/role/batchImportRole/${this.currentSysID}`, data).then((res) => {
        console.log(res)
        if (res.data.code === 'success') {
          // this.exportResult(res, '导入', '成功导入用户', '导入失败，添加用户失败', '导入失败，用户已存在') // 导入结果
          this.$message({
            type: 'success',
            message: '成功导入！'
          })
          param.onSuccess()
        } else {
          // this.exportTableClear() // 导入结果table清空
          this.$message({
            type: 'warning',
            message: res.data.msg
          })
        }
      }).catch((err) => {
        console.log(err)
        this.exportTableClear() // 导入结果table清空
        this.$message({
          type: 'warning',
          message: '未成功导入角色, 请按照模版导入！'
        })
      })
    },
    // 导出按钮
    submitExport (type) {
      if (this.$refs.Export.uploadFiles.length === 0) {
        this.$message({
          type: 'warning',
          message: '请上传导出的文件模版！'
        })
      } else if (this.currentSysID === '') {
        this.$message({
          type: 'warning',
          message: '请选择要导出的系统！'
        })
      } else {
        this.ExportType = type
        this.$refs.Export.submit()
      }
    },
    // 自定义导出请求
    exportFile (param) {
      let fd = new FormData()
      fd.append('file', param.file)
      switch (this.ExportType) {
        case '1':
          this.batchExportRole(fd, param) // 导出角色
          break
        case '2':
          this.batchExportSysRole(param) // 导出系统角色
          break
        case '3':
          this.exportSapRole(fd, param) // 导出Sap角色
          break
        case '4':
          this.batchExportUserRole(fd, param) // 导出包含角色的用户
          break
      }
    },
    // 清空已上传的文件列表
    exportClear () {
      this.$refs.Export.clearFiles() // 清空已上传的文件列表
    },
    // 批量角色导出
    batchExportRole (data, param) {
      this.loading.btn1 = true
      this.axios_M2.post(`/role/batchExportRole/${this.currentSysID}`, data, { responseType: 'blob' }).then((res) => {
        this.download(res)
        this.loading.btn1 = false
      }).catch((err) => {
        console.log(err)
        this.loading.btn1 = false
        this.$message({
          type: 'warning',
          message: '未成功导出角色, 请按照模版导出！'
        })
      })
    },
    // 批量导出系统角色
    batchExportSysRole () {
      if (this.currentSysID === '') {
        this.$message({
          type: 'warning',
          message: '请选择要导出的系统！'
        })
      } else {
        this.loading.btn2 = true
        this.axios_M2.post(`/role/batchExportSystemRole/${this.currentSysID}`, '', { responseType: 'blob' }).then((res) => {
          console.log(res)
          this.loading.btn2 = false
          this.download(res)
        }).catch((err) => {
          console.log(err)
          this.loading.btn2 = false
          this.$message({
            type: 'warning',
            message: '未成功导出系统角色, 请按照模版导出！'
          })
        })
      }
    },
    // 导出Sap角色
    exportSapRole (data, param) {
      this.loading.btn3 = true
      this.axios_M2.post(`/role/SearchSapRole/${this.currentSysID}`, data, { responseType: 'blob' }).then((res) => {
        this.loading.btn3 = false
        // this.download(res) 这个接口暂时无法使用
      }).catch(() => {
        this.loading.btn3 = false
        this.$message({
          type: 'warning',
          message: '未成功导出Sap角色, 请按照模版导出！'
        })
      })
    },
    // 导出包含角色的用户
    batchExportUserRole (data, param) {
      this.loading.btn4 = true
      this.axios_M2.get(`/role/ExportUsersByRoleName/${this.currentSysID}`, data, { responseType: 'blob' }).then((res) => {
        this.loading.btn4 = false
        this.download(res)
      }).catch((err) => {
        console.log(err)
        this.loading.btn4 = false
        this.$message({
          type: 'warning',
          message: '未成功导出包含角色的用户, 请按照模版导出！'
        })
      })
    },
    // 下载文件
    download (res) {
      this.exportClear()
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
::v-deep .el-main {
  padding: 0;
}
.role {
  height: 100%;
  .page-left {
    height: 100%;
    border-right: 1px solid #eaecef;
    .tree {
      padding: 12px;
      .tree-content {
        margin-top: 5px;
      }
    }
  }
  .user {
    padding: 8px;
    .table {
      margin-top: 5px;
    }
  }
  .fileBox {
    &-content {
      padding: 10px;
      .upload-demo {
        .babel {
          font-size: 14px;
          vertical-align: middle;
        }
      }
      .btnBox {
        margin-top: 15px;
      }
      .downloadBox {
        margin-top: 15px;
        .el-tag {
          // margin-right: 8px;
        }
      }
    }
    .exportBox {
      padding: 20px;
    }
  }
}
.header {
  // box-sizing: border-box;
  // width: 100%;
  height: 33px;
  background: #f9f9f9;
  line-height: 33px;
  font-size: 16px;
  padding: 6px 15px;
}
</style>
