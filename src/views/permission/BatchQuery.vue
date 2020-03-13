<template>
  <el-container class="user-group">
    <el-aside width="25%" class="page-left">
      <div class="header">用户组</div>
      <!-- 用户组Tree -->
      <group-tree
        :checkbox="checkbox"
        @getCheck="getCheck"
      />
    </el-aside>
    <el-main>
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
          <el-row class="downloadBox" type="flex" justify="center">
            <el-tag size="small">用户角色清单导出模版下载</el-tag>
          </el-row>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import GroupTree from '../user/components/GroupTree'
export default {
  name: 'add-user',
  components: {
    GroupTree
  },
  data () {
    return {
      checkbox: true, // tree 多选
      currentGroupID: '', // 当前选择的用户组ID
      loading: {
        btn1: false, // 导出用户信息 加载
        btn2: false // 导出用户组下用户 加载
      },
      Type: '' // 类型 1为 用户角色清单 2为用户组角色清单
    }
  },
  methods: {
    // Tree回调
    getCheck (checkStr) {
      this.currentGroupID = checkStr // 当前选择用户组ID
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，请先删除文件再上传`)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 清空已上传的文件列表
    exportClear () {
      this.$refs.Export.clearFiles() // 清空已上传的文件列表
    },
    // 导出请求
    exportFile (param) {
      let fd = new FormData()
      fd.append('file', param.file)
      switch (this.Type) {
        case '1':
          this.batchExportUserRole(fd, param) // 用户角色清单
          break
        case '2':
          if (this.currentGroupID === '') {
            this.$message({
              type: 'warning',
              message: '请选择用户组，可多选！'
            })
          } else {
            this.batchExportUserGroupRole(fd, param) // 用户组角色清单
          }
          break
      }
    },
    // 导出按钮
    submitExport (type) {
      if (this.$refs.Export.uploadFiles.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要导出的文件！'
        })
      } else {
        this.Type = type
        this.$refs.Export.submit()
      }
    },
    // 用户角色清单
    batchExportUserRole (data) {
      this.loading.btn1 = true
      this.axios_M2.post(`/role/batchExportUserRole`, data, { responseType: 'blob' }).then((res) => {
        this.download(res)
        this.loading.btn1 = false
      }).catch((err) => {
        console.log(err)
        this.loading.btn1 = false
        this.$message({
          type: 'warning',
          message: '未成功导出用户信息, 请按照模版导出！'
        })
      })
    },
    // 用户组角色清单
    batchExportUserGroupRole (data) {
      this.loading.btn2 = true
      this.axios_M2.post(`/role/batchExportUserGroupRole/${this.currentGroupID}`, data, { responseType: 'blob' }).then((res) => {
        this.download(res)
        this.loading.btn2 = false
      }).catch((err) => {
        console.log(err)
        this.loading.btn2 = false
        this.$message({
          type: 'warning',
          message: '未成功导出用户组下用户信息！'
        })
      })
    },
    // 下载文件
    download (res) {
      console.log(res)
      this.exportClear()
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
