<template>
  <el-dialog
    title="流程选择"
    :visible.sync="dialogAddProcessVisible"
    @open="getInfo"
    :before-close='handleDialog'
    width="750px"
  >
    <!-- 控制栏 start -->
    <div class="filter-container">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-select @change="handleProcess" v-model="value" placeholder="请选择" size="mini">
            <el-option
              v-for="item in options"
              :key="item.CID"
              :label="item.Name"
              :value="item.CID">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
    <!-- 控制栏 end -->
    <!-- 用户table start -->
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
      <el-table-column label="流程类型" min-width="110" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.ProcessType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流程" min-width="110" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.ProcessGroupName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" min-width="120" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.SystemIDDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属公司" min-width="90" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.CompanyCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流程状态" min-width="70" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.StatusDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否可用" min-width="70" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.IsEnableDesc }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 用户table end -->
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="addSure()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import axios from 'axios'
export default {
  name: 'add-admin',
  props: {
    dialogAddProcessVisible: {
      default: false
    }
  },
  data () {
    return {
      options: [],
      value: '',
      searchValue: '', // 搜索
      tableData: [],
      multipleSelection: '', // 多选内容
      loading: false
    }
  },
  methods: {
    // 关闭对话框
    handleDialog () {
      this.$emit('showDialog')
    },
    // 获取用户列表
    getInfo (procSetId = 0) {
      this.loading = true
      this.queryProcessAll()
      axios.get('/api/Process7.json')
        .then(this.getInfoSucc)
      console.log(`/reportmanage/processList/${procSetId}`)
      // this.axios_M2.get(`/reportmanage/processList/${procSetId}`)
      //   .then(this.getInfoSucc)
    },
    getInfoSucc (res) {
      console.log(res)
      let data = res.data
      if (data.code === 'success') {
        this.tableData = data.data // ldap用户table
        this.loading = false
      }
    },
    // 流程类别选择
    handleProcess (val) {
      this.getInfo(val)
    },
    // 获取流程分类列表
    queryProcessAll () {
      axios.get('/api/Process8.json')
        .then((res) => {
          console.log(res)
          if (res.data.code === 'success') {
            this.options = res.data.data
            this.options.unshift({
              Name: '全部',
              CID: ''
            })
          }
        })
      // this.axios_M2.get('/reportmanage/processCategory')
      //   .then((res) => {
      //     console.log(res)
      //     if (res.data.code === 'success') {
      //       this.options = res.data.data
      //       this.options.unshift({
      //         name: '全部',
      //         value: ''
      //       })
      //     }
      //   })
    },
    // 多选
    handleSelectionChange (val) {
      let Str = ''
      val.forEach((el) => {
        Str += el.ProcessID + ','
      })
      Str = Str.substring(0, Str.length - 1)
      this.multipleSelection = Str
    },
    // 确定
    addSure () {
      if (this.multipleSelection === '') {
        this.$message({
          type: 'warning',
          message: '请选择流程！'
        })
      } else {
        this.$parent.addProcess(this.multipleSelection)
        this.handleDialog()
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
}
</style>
