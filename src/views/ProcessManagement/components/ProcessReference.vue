<template>
  <div class="ProcessReference">
    <!-- 控制栏 start -->
    <div class="filter-container">
      <el-row>
        <el-col :span="24">
          <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="openProcessReference">添加</el-button>
          <el-button class="filter-item" type="danger" size="mini" icon="el-icon-minus" @click="deleteReference(multipleSelection)">删除</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 控制栏 end -->
    <!-- 入口规则table start -->
    <el-table
      size="mini"
      :data="tableData"
      border
      highlight-current-row
      class="table"
      min-height="300px"
      v-loading="loading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        align="center"
        width="40">
      </el-table-column>
      <el-table-column label="入口规则名称" min-width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div v-if="!scope.row.Edit">
            <span>{{ scope.row.referenceCode }}</span>
          </div>
          <el-input  v-else class="input" size="mini" v-model="scope.row.referenceCode"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="入口规则编码" min-width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div v-if="!scope.row.Edit">
            <span>{{ scope.row.referenceType }}</span>
          </div>
          <el-input  v-else class="input" size="mini" v-model="scope.row.referenceType"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="入口规则描述" min-width="120" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div v-if="!scope.row.Edit">
            <span>{{ scope.row.referenceTypeDesc }}</span>
          </div>
          <el-input  v-else class="input" size="mini" v-model="scope.row.referenceTypeDesc"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="" min-width="100" align="center">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.Edit" type="primary" size="mini" icon="el-icon-edit" @click="edit(scope.row)">编辑</el-button>
          <div v-else>
            <el-button type="success" size="mini" icon="el-icon-s-claim" @click="save(scope.row)">保存</el-button>
            <el-button size="mini" icon="el-icon-circle-close" @click="cancel(scope.row)">取消</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 入口规则table end -->
    <el-dialog
      title="新增入口规则"
      :visible.sync="addDialogVisible"
      width="500px"
      append-to-body
    >
      <el-form ref="addForm" :rules="addRules" size="mini" :model="addForm" label-width="120px">
        <el-form-item label="入口规则名称：" prop="referenceCode">
          <el-input v-model="addForm.referenceCode" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="入口规则编码：" prop="referenceType">
          <el-input v-model="addForm.referenceType" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="入口规则描述：" prop="referenceTypeDesc">
          <el-input v-model="addForm.referenceTypeDesc" size="mini"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addProcessReference" size="mini">提交</el-button>
        <el-button @click="handleDialog" size="mini">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'process-reference',
  props: {
    ProcessBaseData: Object
  },
  data () {
    return {
      searchValue: '', // 搜索内容
      tableData: [],
      multipleSelection: '', // 多选内容
      loading: false,
      addDialogVisible: false,
      addRules: {
        referenceCode: [
          { required: true, message: '请输入入口规则名称', trigger: 'blur' }
        ],
        referenceType: [
          { required: true, message: '请输入入口规则编码', trigger: 'blur' }
        ],
        referenceTypeDesc: [
          { required: true, message: '请输入入口规则描述', trigger: 'blur' }
        ]
      },
      addForm: {
        referenceCode: '',
        referenceType: '',
        referenceTypeDesc: ''
      },
      tempData: { // 临时数据
        referenceCode: '',
        referenceType: '',
        referenceTypeDesc: ''
      }
    }
  },
  mounted () {
    this.getInfo()
  },
  watch: {
    ProcessBaseData () {
      this.getInfo()
    }
  },
  methods: {
    // 根据策略组Id查询入口规则接口
    getInfo () {
      this.loading = true
      this.axios_M4.get(`/processreference/ByProcessBase/${this.ProcessBaseData.ProcessBaseID}`)
        .then((res) => {
          let data = res.data
          console.log(data)
          if (data.code === 'success') {
            let arr = data.data
            if (arr.length > 0) {
              arr.forEach((row) => {
                row.Edit = false
              })
            }
            this.tableData = arr
            this.loading = false
          }
        })
    },
    // 多选
    handleSelectionChange (val) {
      let Str = ''
      val.forEach((el) => {
        Str += el.processReferenceId + ','
      })
      Str = Str.substring(0, Str.length - 1)
      this.multipleSelection = Str
    },
    // open添加入口规则
    openProcessReference () {
      this.addDialogVisible = true
    },
    // 添加入口规则
    addProcessReference () {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          let data = {
            processBaseId: this.ProcessBaseData.ProcessBaseID,
            referenceCode: this.addForm.referenceCode,
            referenceType: this.addForm.referenceType,
            referenceTypeDesc: this.addForm.referenceTypeDesc,
          }
          console.log(data)
          this.axios_M4.post(`/processreference/`, data)
            .then((res) => {
              console.log(res)
              if (res.data.code === 'success') {
                this.$message({
                  type: 'success',
                  message: res.data.msg
                })
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.msg
                })
              }
              this.handleDialog()
            })
        }
      })
    },
    // 编辑
    edit (row) {
      row.Edit = true
      this.tempData = {
        referenceCode: row.referenceCode,
        referenceType: row.referenceType,
        referenceTypeDesc: row.referenceTypeDesc
      }
    },
    // 保存
    save (row) {
      let data = {
        processReferenceId: row.processReferenceId,
        referenceCode: row.referenceCode,
        referenceType: row.referenceType,
        referenceTypeDesc: row.referenceTypeDesc
      }
      this.axios_M4.put(`/processreference/`, data)
        .then(res => {
          console.log(res)
          if (res.data.code === 'success') {
            this.$message({
              type: 'success',
              message: res.data.msg
            })
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
          this.getInfo()
          row.Edit = false
        })
    },
    // 取消
    cancel (row) {
      row.referenceCode = this.tempData.referenceCode
      row.referenceType = this.tempData.referenceType
      row.referenceTypeDesc = this.tempData.referenceTypeDesc
      this.tempData = {
        referenceCode: '',
        referenceType: '',
        referenceTypeDesc: ''
      }
      row.Edit = false
    },
    // 删除
    deleteReference (ID) {
      if (ID === '') {
        this.$message({
          type: 'warning',
          message: '请选择要删除的入口规则，可多选'
        })
      } else {
        this.axios_M4.delete(`/processreference/${ID}`)
          .then((res) => {
            let data = res.data
            if (data.code === 'success') {
              this.$message({
                type: 'success',
                message: data.msg
              })
              this.getInfo()
            }
          })
      }
    },
    // 清空addForm
    clearAddForm () {
      this.addForm = {
        referenceCode: '',
        referenceType: '',
        referenceTypeDesc: ''
      }
    },
    // 关闭对话框
    handleDialog () {
      this.clearAddForm()
      this.$refs['addForm'].resetFields()
      this.addDialogVisible = false
      this.getInfo()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 10px 20px 5px;
}
.table {
  margin-top: 10px;
  ::v-deep .el-table-column--selection .cell{
    padding-right: 10px;
  }
  ::v-deep .el-button--mini {
    padding: 4px 8px;
  }
}
</style>
