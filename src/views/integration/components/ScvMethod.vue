<template>
  <el-dialog
    title="服务方法"
    :visible.sync="dialogScvMethodVisible"
    @open="getInfo"
    :before-close='handleDialog'
    width="900px"
  >
    <!-- 控制栏 start -->
    <div class="filter-container">
      <el-row :gutter="20">
        <el-col :span="14">
          <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="openAdd()">新增</el-button>
        </el-col>
        <el-col :span="7">
          <el-input placeholder="搜索..." v-model="searchValue" clearable size="mini"/>
        </el-col>
        <el-col :span="3">
          <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="search()">查询</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 控制栏 end -->
    <!-- table start -->
    <el-table
      v-loading="loading"
      size="mini"
      :data="tableData"
      border
      highlight-current-row
      class="table"
      height="420px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        align="center"
        width="35">
      </el-table-column>
      <el-table-column label="业务编码" min-width="110" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.bizSvcMethodCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="显示名称" min-width="90" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.displayName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="方法名称" min-width="90" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.methodName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="返回值类型" min-width="85" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.returnType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务服务方法对应的sql语句" min-width="175" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.methodSql }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述信息" min-width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="190" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="editScvMethod(scope.row)">编辑</el-button>
          <el-button size="mini" type="primary" @click="openMethodParam(scope.row)">查看参数</el-button>
          <el-button size="mini" type="danger" @click="deleteScvMethod(scope.row.bizSvcMethodId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- table end -->
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
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="handleDialog">确 定</el-button>
    </div>
    <!-- 创建/更新-弹窗 -->
    <el-dialog
      :title="titleText"
      :visible.sync="dialogAddScvMethodVisible"
      :before-close='closeDialogApp'
      width="600px"
      class="Add"
      append-to-body
    >
      <div class="dialogBody">
        <el-form ref="AddScvMethodForm" :rules="rules" :model="temp" label-width="70px">
          <el-form-item label="业务编码:" :label-width="formLabelWidth" prop="bizSvcMethodCode">
            <el-col :span="22">
              <el-input size="mini" v-model="temp.bizSvcMethodCode" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="显示名称:" :label-width="formLabelWidth" prop="displayName">
            <el-col :span="22">
              <el-input size="mini" v-model="temp.displayName" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="方法名称:" :label-width="formLabelWidth" prop="methodName">
            <el-col :span="22">
              <el-input size="mini" v-model="temp.methodName" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="返回值类型:" :label-width="formLabelWidth" prop="returnType">
            <el-col :span="22">
              <el-input size="mini" v-model="temp.returnType" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="业务服务方法对应的sql语句:" class="label" :label-width="formLabelWidth" prop="methodSql">
            <el-col :span="22">
              <el-input
                type="textarea"
                v-model="temp.methodSql"
                :rows="2">
              </el-input>
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
        <el-button size="mini" type="primary" @click="addScvMethod()" v-if="titleText === '新增服务方法'">确 定</el-button>
        <el-button size="mini" type="primary" @click="saveUpdate()" v-if="titleText === '编辑服务方法'">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 创建-弹窗 -->
    <!-- 查看方法参数-弹窗 -->
    <scv-method-param
      @showDialog="closeDialog"
      :bizSvcMethodId="bizSvcMethodId"
      :dialogScvMethodParamVisible="dialogScvMethodParamVisible"
    />
    <!-- 查看方法参数-弹窗 -->
  </el-dialog>
</template>

<script>
import ScvMethodParam from './ScvMethodParam'
export default {
  name: 'scv-method',
  components: {
    ScvMethodParam
  },
  props: {
    bizSvcId: String,
    dialogScvMethodVisible: {
      default: false
    }
  },
  data () {
    return {
      searchValue: '', // 搜索
      tableData: [],
      currentPage: 1, // 当前页码
      pageSize: 20, // 页条数
      totalCount: null, // 总条数
      multipleSelection: [], // 多选内容
      dialogAddScvMethodVisible: false,
      dialogScvMethodParamVisible: false,
      loading: false,
      formLabelWidth: '130px',
      temp: {
        bizSvcMethodCode: '',
        displayName: '',
        methodName: '',
        returnType: '',
        methodSql: '',
        desc: '',
        systemId: ''
      },
      rules: {
        bizSvcMethodCode: [
          { required: true, message: '请输入业务编码', trigger: 'blur' }
        ],
        displayName: [
          { required: true, message: '请输入显示名称', trigger: 'blur' }
        ],
        methodName: [
          { required: true, message: '请输入方法名称', trigger: 'blur' }
        ],
        returnType: [
          { required: true, message: '请输入返回值类型', trigger: 'blur' }
        ],
        methodSql: [
          { required: true, message: '请输入业务服务方法对应的sql语句', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请输入描述信息', trigger: 'blur' }
        ],
        systemId: [
          { required: true, message: '请输入关联系统id', trigger: 'blur' }
        ]
      },
      titleText: '',
      bizSvcMethodId: ''
    }
  },
  methods: {
    // 关闭对话框
    handleDialog () {
      this.$emit('showDialog', 'ScvMethod')
    },
    // 获取服务方法查询列表
    getInfo (pageSize = 20, pageNum = 0) {
      this.loading = true
      console.log(`/svc/method/${this.bizSvcId}/${pageSize}/${pageNum}`)
      this.axios_M3.get(`/svc/method/${this.bizSvcId}/${pageSize}/${pageNum}`)
        .then(this.getInfoSucc)
    },
    getInfoSucc (res) {
      console.log(res)
      let data = res.data
      if (data.code === 'success') {
        this.tableData = data.data // ldap用户table
        this.totalCount = data.total // 总条数
        this.pageSize = data.pagesize // 页条数
        this.currentPage = data.pageNum // 当前页码
        this.loading = false
      }
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
    // 多选
    handleSelectionChange (val) {
      console.log(val)
    },
    // 搜索
    search (start = 0) {
      if (this.searchValue === '') {
        this.getInfo(this.pageSize, start)
      } else {
        this.axios_M3.get(`/svc/method/${this.bizSvcId}/${this.searchValue}/${this.pageSize}/${start}`)
          .then(this.getInfoSucc)
      }
    },
    // 刷新
    refresh () {
      this.searchValue = '' // 清空搜索
      this.getInfo()
    },
    // 新增 服务方法
    openAdd () {
      this.dialogAddScvMethodVisible = true
      this.titleText = '新增服务方法'
    },
    // 新增业务服务
    addScvMethod () {
      this.$refs['AddScvMethodForm'].validate((valid) => {
        if (valid) {
          let data = {
            bizSvcId: this.bizSvcId,
            bizSvcMethodCode: this.temp.bizSvcMethodCode,
            displayName: this.temp.displayName,
            methodName: this.temp.methodName,
            returnType: this.temp.returnType,
            methodSql: this.temp.methodSql,
            desc: this.temp.desc,
            systemId: this.temp.systemId
          }
          console.log(data)
          this.axios_M3.post(`/svc/method`, data).then((res) => {
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
    // 打开方法参数
    openMethodParam (row) {
      console.log(row)
      this.bizSvcMethodId = row.bizSvcMethodId
      this.dialogScvMethodParamVisible = true
    },
    // 打开编辑服务方法
    editScvMethod (row) {
      console.log(row)
      this.titleText = '编辑服务方法'
      this.bizSvcMethodId = row.bizSvcMethodId
      this.temp.bizSvcMethodCode = row.bizSvcMethodCode
      this.temp.displayName = row.displayName
      this.temp.methodName = row.methodName
      this.temp.returnType = row.returnType
      this.temp.methodSql = row.methodSql
      this.temp.desc = row.desc
      this.temp.systemId = row.systemId
      this.dialogAddScvMethodVisible = true
      console.log(this.temp)
    },
    // 保存编辑
    saveUpdate () {
      this.$refs['AddScvMethodForm'].validate((valid) => {
        if (valid) {
          let data = {
            bizSvcMethodId: this.bizSvcMethodId,
            bizSvcMethodCode: this.temp.bizSvcMethodCode,
            displayName: this.temp.displayName,
            methodName: this.temp.methodName,
            returnType: this.temp.returnType,
            methodSql: this.temp.methodSql,
            desc: this.temp.desc,
            systemId: this.temp.systemId
          }
          console.log(data)
          this.axios_M3.put(`/svc/method/`, data).then((res) => {
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
    // 删除服务方法请求
    deleteScvMethod (bizSvcMethodId) {
      this.$confirm(`确定要删除选择的服务方法?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios_M3.delete(`/svc/method/${bizSvcMethodId}`)
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 关闭新增服务方法对话框
    closeDialogApp () {
      this.clearTemp()
      this.$refs['AddScvMethodForm'].resetFields()
      this.dialogAddScvMethodVisible = false
    },
    // 清空temp
    clearTemp () {
      this.temp = {
        bizSvcMethodCode: '',
        displayName: '',
        methodName: '',
        returnType: '',
        methodSql: '',
        desc: '',
        systemId: ''
      }
    },
    // 关闭对话框
    closeDialog (name) {
      switch (name) {
        case 'ScvMethodParam':
          this.dialogScvMethodParamVisible = false
          break
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
  ::v-deep .el-button--mini {
    padding: 5px 8px;
    vertical-align: top;
  }
}
.Add {
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
    .label {
      margin-bottom: 10px;
      ::v-deep .el-form-item__label {
        line-height: 24px;
      }
    }
  }
}
</style>
