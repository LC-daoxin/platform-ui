<template>
  <el-dialog
    title="服务方法参数"
    :visible.sync="dialogScvMethodParamVisible"
    @open="getInfo"
    :before-close='handleDialog'
    width="850px"
    append-to-body
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
      <el-table-column label="业务编码" min-width="95" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.bizSvcMethodParamCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="参数名称" min-width="95" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.paramName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="参数Datebase类型" min-width="90" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.paramDbType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="参数别名" min-width="80" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.paramAlias }}</span>
        </template>
      </el-table-column>
      <el-table-column label="输入输出类型" min-width="80" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.IOType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述信息" min-width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="115" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="editScvMethod(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteScvMethod(scope.row.bizSvcMethodParamId)">删除</el-button>
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
      :visible.sync="dialogAddScvMethodParamVisible"
      :before-close='closeDialogApp'
      width="600px"
      class="Add"
      append-to-body
    >
      <div class="dialogBody">
        <el-form ref="AddScvMethodParamForm" :rules="rules" :model="temp" label-width="70px">
          <el-form-item label="业务编码:" :label-width="formLabelWidth" prop="bizSvcMethodParamCode">
            <el-col :span="22">
              <el-input size="mini" v-model="temp.bizSvcMethodParamCode" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="参数名称:" :label-width="formLabelWidth" prop="paramName">
            <el-col :span="22">
              <el-input size="mini" v-model="temp.paramName" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="参数Datebase类型:" :label-width="formLabelWidth" prop="paramDbType">
            <el-col :span="22">
              <el-input size="mini" v-model="temp.paramDbType" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="参数别名:" :label-width="formLabelWidth" prop="paramAlias">
            <el-col :span="22">
              <el-input size="mini" v-model="temp.paramAlias" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="输入输出类型:" :label-width="formLabelWidth" prop="methodSql">
            <el-col :span="22">
              <el-select v-model="value" size="mini" placeholder="请选择">
                <el-option
                  v-for="item in IOTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="描述信息:" :label-width="formLabelWidth" prop="desc">
            <el-col :span="22">
              <el-input size="mini" v-model="temp.desc" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeDialogApp">取 消</el-button>
        <el-button size="mini" type="primary" @click="addScvMethodParam()" v-if="titleText === '新增服务方法参数'">确 定</el-button>
        <el-button size="mini" type="primary" @click="saveUpdate()" v-if="titleText === '编辑服务方法参数'">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 创建-弹窗 -->
  </el-dialog>
</template>

<script>
export default {
  name: 'scv-method-param',
  props: {
    bizSvcMethodId: String,
    dialogScvMethodParamVisible: {
      default: false
    }
  },
  data () {
    return {
      IOTypeOptions: [{
        value: 'IN',
        label: 'IN'
      }, {
        value: 'OUT',
        label: 'OUT'
      }],
      value: 'IN',
      searchValue: '', // 搜索
      tableData: [],
      currentPage: 1, // 当前页码
      pageSize: 20, // 页条数
      totalCount: null, // 总条数
      multipleSelection: [], // 多选内容
      dialogAddScvMethodParamVisible: false,
      loading: false,
      formLabelWidth: '145px',
      temp: {
        bizSvcMethodParamCode: '',
        paramName: '',
        paramDbType: '',
        paramAlias: '',
        IOType: '',
        bizSvcMethodId: '',
        desc: ''
      },
      rules: {
        bizSvcMethodParamCode: [
          { required: true, message: '请输入业务编码', trigger: 'blur' }
        ],
        paramName: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ],
        paramDbType: [
          { required: true, message: '请输入参数Datebase类型', trigger: 'blur' }
        ],
        paramAlias: [
          { required: true, message: '请输入参数别名', trigger: 'blur' }
        ],
        IOType: [
          { required: true, message: '请输入输入输出类型', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请输入描述信息', trigger: 'blur' }
        ]
      },
      titleText: '',
      bizSvcMethodParamId: ''
    }
  },
  methods: {
    // 关闭对话框
    handleDialog () {
      this.$emit('showDialog', 'ScvMethodParam')
    },
    // 获取服务方法参数列表
    getInfo (pageSize = 20, pageNum = 0) {
      this.loading = true
      console.log(`/svc/param/${this.bizSvcMethodId}/${pageSize}/${pageNum}`)
      this.axios_M3.get(`/svc/param/${this.bizSvcMethodId}/${pageSize}/${pageNum}`)
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
        console.log(`/svc/param/${this.bizSvcMethodId}/${this.searchValue}/${this.pageSize}/${start}`)
        this.axios_M3.get(`/svc/param/${this.bizSvcMethodId}/${this.searchValue}/${this.pageSize}/${start}`)
          .then(this.getInfoSucc)
      }
    },
    // 刷新
    refresh () {
      this.searchValue = '' // 清空搜索
      this.getInfo()
    },
    // 新增 服务方法参数
    openAdd () {
      this.dialogAddScvMethodParamVisible = true
      this.titleText = '新增服务方法参数'
    },
    // 新增业务服务参数
    addScvMethodParam () {
      this.$refs['AddScvMethodParamForm'].validate((valid) => {
        if (valid) {
          let data = {
            bizSvcMethodId: this.bizSvcMethodId,
            bizSvcMethodParamCode: this.temp.bizSvcMethodParamCode,
            paramName: this.temp.paramName,
            paramDbType: this.temp.paramDbType,
            paramAlias: this.temp.paramAlias,
            IOType: this.value,
            desc: this.temp.desc
          }
          console.log(data)
          this.axios_M3.post(`/svc/param`, data).then((res) => {
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
    // 打开编辑服务方法
    editScvMethod (row) {
      console.log(row)
      this.titleText = '编辑服务方法参数'
      this.temp.bizSvcMethodParamCode = row.bizSvcMethodParamCode
      this.temp.paramName = row.paramName
      this.temp.paramDbType = row.paramDbType
      this.temp.paramAlias = row.paramAlias
      this.temp.IOType = row.IOType
      this.temp.desc = row.desc
      this.dialogAddScvMethodParamVisible = true
      this.bizSvcMethodParamId = row.bizSvcMethodParamId
      console.log(this.temp)
    },
    // 保存编辑
    saveUpdate () {
      this.$refs['AddScvMethodParamForm'].validate((valid) => {
        if (valid) {
          let data = {
            bizSvcMethodParamId: this.bizSvcMethodParamId,
            bizSvcMethodParamCode: this.temp.bizSvcMethodParamCode,
            paramName: this.temp.paramName,
            paramDbType: this.temp.paramDbType,
            paramAlias: this.temp.paramAlias,
            IOType: this.value,
            desc: this.temp.desc
          }
          console.log(data)
          this.axios_M3.put(`/svc/param/`, data).then((res) => {
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
    // 删除服务方法参数请求
    deleteScvMethod (id) {
      this.$confirm(`确定要删除选择的服务方法参数?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios_M3.delete(`/svc/param/${id}`)
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
    // 关闭新增服务方法参数对话框
    closeDialogApp () {
      this.clearTemp()
      this.$refs['AddScvMethodParamForm'].resetFields()
      this.dialogAddScvMethodParamVisible = false
    },
    // 清空temp
    clearTemp () {
      this.temp = {
        bizSvcMethodParamCode: '',
        paramName: '',
        paramDbType: '',
        paramAlias: '',
        IOType: '',
        bizSvcMethodId: '',
        desc: ''
      }
      this.bizSvcMethodParamId = ''
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
    min-height: 300px;
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
