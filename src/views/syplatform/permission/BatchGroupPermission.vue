<template>
  <el-container class="user-group">
    <el-main>
      <div class="fileBox">
        <div class="header">用户组批量授权</div>
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
            <el-button size="mini" type="primary" @click="submitUpload()">用户组批量授权</el-button>
          </el-row>
          <el-row class="downloadBox" type="flex" justify="center">
            <el-tag size="small">用户组批量授权模版下载</el-tag>
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
            max-height="300px"
          >
            <el-table-column
              type="index"
              width="40"
              align="center"
            >
            </el-table-column>
            <el-table-column label="用户组名称" min-width="100" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{ scope.row.userAD }}</span>
              </template>
            </el-table-column>
            <el-table-column label="结果" min-width="100" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{ scope.row.describe }}</span>
              </template>
            </el-table-column>
            <el-table-column label="是否成功" min-width="70" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{ scope.row.state ? '是' : '否' }}</span>
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
      exportBoxShow: false // 结果显示
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
    submitUpload () {
      if (this.$refs.upload.uploadFiles.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要导入的文件！'
        })
      } else {
        this.$refs.upload.submit()
      }
    },
    // 清空已上传的文件列表
    importClear () {
      this.$refs.upload.clearFiles() // 清空已上传的文件列表
    },
    // 用户组批量授权
    importFile (param) {
      let fd = new FormData()
      fd.append('file', param.file)
      this.axios_M2.post(`/role/batchImportGroupAuth`, fd).then((res) => {
        console.log(res)
        if (res.data.code === 'success') {
          this.exportResult(res, '用户组授权成功', '用户组授权失败') // 导入结果
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
          message: '未成功导入用户组, 请按照模版导入！'
        })
      })
    },
    // 导入结果
    exportResult (res, msg1, msg2) {
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
                  'state': true,
                  'describe': msg1
                })
              }
              break
            case 'fail':
              for (let user of arrObj[prop]) {
                tableData.push({
                  'userAD': user,
                  'state': false,
                  'describe': msg2
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
