<template>
  <el-container class="user-group">
    <el-aside width="25%" class="page-left">
      <div class="header">用户组</div>
      <!-- 用户组Tree -->
      <group-tree
        :checkbox="checkbox"
        @getCheck="getCheck"
      />
      <!-- 用户组Tree -->
    </el-aside>
    <el-main>
      <div class="fileBox">
        <div class="header">导入</div>
        <div class="fileBox-content">
          <el-row class="select-box">
            <el-col :span="3">
              <div class="labelText">
                系统:
              </div>
            </el-col>
            <el-col :span="21">
              <el-select class="select" v-model="value" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
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
            <el-button size="mini" type="primary" @click="submitUpload('1')">添加用户授权</el-button>
            <el-button size="mini" type="primary" @click="submitUpload('2')">删除用户授权</el-button>
            <el-button size="mini" type="primary" @click="submitUpload('3')">添加用户组授权</el-button>
            <el-button size="mini" type="primary" @click="submitUpload('4')">删除用户组授权</el-button>
          </el-row>
          <el-row class="downloadBox" type="flex" justify="center">
            <el-tag size="small">用户授权模版下载</el-tag>
            <el-tag size="small">用户组模版下载</el-tag>
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
            <el-table-column label="用户名称" min-width="60" align="center" :show-overflow-tooltip="true">
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
            <el-button size="mini" type="primary" :loading="loading.btn1" @click="submitExport('1')">用户角色清单</el-button>
            <el-button size="mini" type="primary" :loading="loading.btn2" @click="submitExport('2')">用户组角色清单</el-button>
          </el-row>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import GroupTree from '../user/components/GroupTree'
export default {
  name: 'batch-user-permission',
  components: {
    GroupTree
  },
  data () {
    return {
      options: [],
      value: '', // 当前系统ID
      checkbox: true, // tree 多选
      currentGroupID: '', // 当前选择的用户组ID
      ImportType: '', // 导入类型
      ExportType: '', // 导出类型
      loading: {
        btn1: false, // 用户角色清单 加载
        btn2: false // 用户组角色清单 加载
      },
      tableData: [],
      exportBoxShow: false // 结果显示
    }
  },
  mounted () {
    this.querySysAll()
  },
  methods: {
    // Tree回调
    getCheck (id) {
      console.log(id)
      this.currentGroupID = id // 当前选择用户组ID
    },
    // 获取所有系统列表
    querySysAll () {
      this.axios_M2.get('/system/querySysAll')
        .then((res) => {
          if (res.data.code === 'success') {
            this.options = res.data.data
            this.options.unshift({
              name: '请选择系统',
              value: ''
            })
          }
        })
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
    submitUpload (type) {
      if (this.$refs.upload.uploadFiles.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要导入的文件！'
        })
      } else if (this.value === '' || this.value === null) {
        this.$message({
          type: 'warning',
          message: '请选择要导入的系统！'
        })
      } else {
        this.ImportType = type
        this.$refs.upload.submit()
      }
    },
    // 自定义导入请求
    importFile (param) {
      let fd = new FormData()
      fd.append('file', param.file)
      switch (this.ImportType) {
        case '1':
          this.batchImportUserAuth(fd, param) // 添加用户授权
          break
        case '2':
          this.batchDeleteUserAuth(fd, param) // 删除用户授权
          break
        case '3':
          this.batchImportGroupAuth(fd, param) // 添加用户组授权
          break
        case '4':
          this.batchUpdateUserFromAD(fd, param) // 删除用户组授权
          break
      }
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
            case 'notExistedArray':
              for (let user of arrObj[prop]) {
                tableData.push({
                  'userAD': user,
                  'operation': operation,
                  'describe': msg3
                })
              }
              break
          }
        }
      }
      this.tableData = tableData
    },
    // 添加用户授权
    batchImportUserAuth (data, param) {
      this.axios_M2.post(`/role/batchImportUserAuth/${this.value}`, data).then((res) => {
        console.log(res)
        if (res.data.code === 'success') {
          this.exportResult(res, '授权', '用户授权成功', '用户授权失败', '授权失败，用户已授权') // 导入结果
          param.onSuccess()
        } else {
          this.exportTableClear() // 导入结果table清空
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
          message: '未成功导入用户授权, 请按照模版导入！'
        })
      })
    },
    // 删除用户授权
    batchDeleteUserAuth (data, param) {
      this.axios_M2.post(`/role/batchDeleteUserAuth/${this.value}`, data).then((res) => {
        console.log(res)
        if (res.data.code === 'success') {
          this.exportResult(res, '删除授权', '成功删除用户授权', '删除用户授权失败', '用户已经删除授权') // 导入结果
          param.onSuccess()
        } else {
          this.exportTableClear() // 导入结果table清空
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
          message: '未成功导入删除用户授权, 请按照模版导入！'
        })
      })
    },
    // 添加用户组授权
    batchImportGroupAuth (data, param) {
      this.axios_M2.post(`/role/batchImportGroupAuth/${this.value}`, data).then((res) => {
        console.log(res)
        if (res.data.code === 'success') {
          this.exportResult(res, '授权', '用户组授权成功', '用户组授权失败', '授权失败，用户组已授权') // 导入结果
          param.onSuccess()
        } else {
          this.exportTableClear() // 导入结果table清空
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
          message: '未成功添加用户组授权, 请按照模版导入！'
        })
      })
    },
    // 删除用户组授权
    batchUpdateUserFromAD (data, param) {
      this.axios_M2.post(`/role/batchDeleteGroupAuth/${this.value}`, data).then((res) => {
        console.log(res)
        if (res.data.code === 'success') {
          this.exportResult(res, '删除授权', '成功删除用户组授权', '删除用户组授权失败', '用户组已经删除授权') // 导入结果
          param.onSuccess()
        } else {
          this.exportTableClear() // 导入结果table清空
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
          message: '未成功删除用户组授权, 请按照模版导入！'
        })
      })
    },
    // 导出按钮
    submitExport (type) {
      if (this.$refs.Export.uploadFiles.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要导出的文件！'
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
          this.batchExportUserRole(fd, param) // 用户角色清单导出
          break
        case '2':
          if (this.currentGroupID === '') {
            this.$message({
              type: 'warning',
              message: '请选择要导出的用户组！'
            })
          } else {
            this.batchExportUserGroupRole(fd, param) // 用户组角色清单导出
          }
          break
      }
    },
    // 清空已上传的文件列表
    exportClear () {
      this.$refs.Export.clearFiles() // 清空已上传的文件列表
    },
    // 用户角色清单导出
    batchExportUserRole (data, param) {
      this.loading.btn1 = true
      this.axios_M2.post(`/role/batchExportUserRole`, data, { responseType: 'blob' }).then((res) => {
        this.download(res)
        this.loading.btn1 = false
      }).catch((err) => {
        console.log(err)
        this.loading.btn1 = false
        this.$message({
          type: 'warning',
          message: '未成功导出用户, 请按照模版导出！'
        })
      })
    },
    // 用户组角色清单导出
    batchExportUserGroupRole (data, param) {
      this.loading.btn2 = true
      this.axios_M2.post(`/role/batchExportUserGroupRole/${this.currentGroupID}`, data, { responseType: 'blob' }).then((res) => {
        this.loading.btn2 = false
        this.download(res)
      }).catch(() => {
        this.loading.btn2 = false
        this.$message({
          type: 'warning',
          message: '未成功导出全部用户'
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
.user-group {
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
    padding: 12px;
    .table {
      margin-top: 5px;
    }
  }
  .fileBox {
    &-content {
      padding: 10px;
      .select-box {
        margin-bottom: 10px;
        .labelText {
          height: 28px;
          line-height: 28px;
          font-size: 14px;
        }
        .select {
          margin-left: 7px;
        }
      }
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
          margin-right: 8px;
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
