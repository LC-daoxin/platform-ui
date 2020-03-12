<template>
  <el-container class="user-group">
    <el-main>
      <div class="fileBox">
        <div class="header">批量角色维护</div>
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
            <el-button size="mini" type="primary" :loading="loading.btn1" @click="submitUpload('1')">导入</el-button>
            <el-button size="mini" type="primary" :loading="loading.btn2" @click="submitUpload('2')">导出</el-button>
          </el-row>
          <el-row class="downloadBox" type="flex" justify="center">
            <el-tag size="small">批量角色维护导入模版下载</el-tag>
            <el-tag size="small">批量角色维护导出模版下载</el-tag>
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
            max-height="340px"
          >
            <el-table-column
              type="index"
              width="40"
              align="center"
            >
            </el-table-column>
            <el-table-column label="角色授权" min-width="60" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{ scope.row.text }}</span>
              </template>
            </el-table-column>
            <el-table-column label="结果" min-width="120" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{ scope.row.describe }}</span>
              </template>
            </el-table-column>
          </el-table>
          <!-- 导入结果table end -->
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'add-user-group',
  data () {
    return {
      tableData: [],
      exportBoxShow: false, // 结果显示
      Type: '', // 1为导入 2为导出
      loading: {
        btn1: false, // 导入 加载
        btn2: false // 导出 加载
      }
    }
  },
  methods: {
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，请先删除文件再上传`)
    },
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
      } else {
        this.Type = type
        this.$refs.upload.submit()
      }
    },
    // 清空已上传的文件列表
    importClear () {
      this.$refs.upload.clearFiles() // 清空已上传的文件列表
    },
    // 导入用户组
    importFile (param) {
      let fd = new FormData()
      fd.append('file', param.file)
      switch (this.Type) {
        case '1':
          this.batchImportPermission(fd, param) // 授权信息批量导入
          break
        case '2':
          this.batchExportPermission(fd, param) // 授权信息批量导出
          break
      }
    },
    // 授权信息批量导入
    batchImportPermission (data, param) {
      this.loading.btn1 = true
      this.axios_M2.post(`/permission/batchImportPermission`, data).then((res) => {
        this.loading.btn1 = false
        console.log(res)
        if (res.data.code === 'success') {
          this.exportResult(res) // 导入结果
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
        this.loading.btn1 = false
        this.$message({
          type: 'warning',
          message: '未成功授权信息批量导入, 请按照模版导出！'
        })
      })
    },
    // 授权信息批量导出
    batchExportPermission (data, param) {
      this.loading.btn2 = true
      this.axios_M2.post(`/permission/batchExportPermission`, data, { responseType: 'blob' }).then((res) => {
        console.log(res)
        this.download(res)
        this.loading.btn2 = false
      }).catch((err) => {
        console.log(err)
        this.loading.btn2 = false
        this.$message({
          type: 'warning',
          message: '未成功授权信息批量导出, 请按照模版导出！'
        })
      })
    },
    // 导入结果
    exportResult (res) {
      this.exportBoxShow = true
      let arrObj = res.data.data
      let tableData = []
      for (let prop in arrObj) {
        if (arrObj[prop].length > 0) {
          switch (prop) {
            case 'addGroupPermissions':
              for (let msg of arrObj[prop]) {
                tableData.push({
                  'text': '增加用户组授权',
                  'describe': msg
                })
              }
              break
            case 'applicationPermissionResult':
              for (let msg of arrObj[prop]) {
                tableData.push({
                  'text': '应用授权',
                  'describe': msg
                })
              }
              break
            case 'groupPermissionResult':
              for (let msg of arrObj[prop]) {
                tableData.push({
                  'text': '用户组授权',
                  'describe': msg
                })
              }
              break
            case 'menuPermissionResult':
              for (let msg of arrObj[prop]) {
                tableData.push({
                  'text': '菜单授权',
                  'describe': msg
                })
              }
              break
            case 'processBasePermissionResult':
              for (let msg of arrObj[prop]) {
                tableData.push({
                  'text': '审批策略授权',
                  'describe': msg
                })
              }
              break
            case 'processPermissionResult':
              for (let msg of arrObj[prop]) {
                tableData.push({
                  'text': '流程授权',
                  'describe': msg
                })
              }
              break
          }
        }
      }
      this.tableData = tableData
    },
    // 导入结果清空
    exportTableClear () {
      this.exportBoxShow = false
      this.tableData = []
    },
    // 下载文件
    download (res) {
      this.importClear()
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
      padding: 8px;
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
      padding: 20px;
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
      max-width: 800px;
      padding: 20px;
      margin: 0 auto;
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
