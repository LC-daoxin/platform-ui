<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <dialog-form></dialog-form>
    </el-dialog>
    <currency-table-page headerLayout="left">
      <template slot="header">
        <el-button size="mini" type="primary" @click="showDialog('新增')">添加</el-button>
        <el-button size="mini">刷新</el-button>
      </template>
      <template slot="main">
        <main-table :tableData="tableData" @edit="showDialog"></main-table>
      </template>
      <template slot="footer">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 20, 30, 50]"
          :page-size="20"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageTotal">
        </el-pagination>
      </template>
    </currency-table-page>
  </div>
</template>

<script>
import CurrencyTablePage from '@/components/currency-table-page'
import MainTable from './components/MainTable'
import DialogForm from './components/DialogForm'

export default {
  data () {
    return {
      currentPage: 1,
      pageTotal: 100,
      dialogTitle: '新增',
      dialogVisible: false,
      tableData: [
        {
          name: '客户端1',
          id: '5d22eb6e8b0c7ba066014398',
          type: ['password'],
          range: 'All',
          url: 'https://eerp.com',
          certification: true
        },
        {
          name: '客户端2',
          id: '5d22eb6e8b0c7ba066014398',
          type: ['password'],
          range: 'All',
          url: 'https://eerp.com',
          certification: false
        },
        {
          name: '客户端3',
          id: '5d22eb6e8b0c7ba066014398',
          type: ['password'],
          range: 'All',
          url: 'https://eerp.com',
          certification: false
        }
      ]
    }
  },
  methods: {
    handleSizeChange () {},
    handleCurrentChange () {},
    showDialog (title) {
      this.dialogTitle = title
      this.dialogVisible = true
    }
  },
  components: {
    CurrencyTablePage,
    MainTable,
    DialogForm
  }
}
</script>
