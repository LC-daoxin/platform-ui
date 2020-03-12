<template>
  <el-dialog
    title="有效期"
    :visible.sync="dialogTimeVisible"
    :before-close='handleDialog'
    width="400px"
  >
    <el-form :model="form">
      <el-form-item label="有效期自:" :label-width="formLabelWidth">
        <el-col :span="22">
          <el-date-picker
            size="mini"
            v-model="form.ExpiryDateFrom"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期">
          </el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="有效期至:" :label-width="formLabelWidth">
        <el-col :span="22">
          <el-date-picker
            size="mini"
            v-model="form.ExpiryDateTo"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期">
          </el-date-picker>
        </el-col>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="handleDialog">取 消</el-button>
      <el-button v-if="this.timeBtnType === 1" size="mini" type="primary" @click="handleSure">确 定</el-button>
      <el-button v-else-if="this.timeBtnType === 2" size="mini" type="primary" @click="handleAddUser(Info)">确 定</el-button>
      <el-button v-else-if="this.timeBtnType === 3" size="mini" type="primary" @click="handleAddUsers(Info)">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'valid-time-dialog',
  props: {
    Info: Object,
    timeBtnType: Number,
    dialogTimeVisible: {
      default: false
    }
  },
  data () {
    return {
      form: {
        ExpiryDateFrom: '',
        ExpiryDateTo: ''
      },
      formLabelWidth: '100px'
    }
  },
  methods: {
    // 确定(添加有效期)
    handleSure () {
      this.axios.put('/user/updateUserEndTime', {
        ENDTIME: this.form.ExpiryDateTo,
        STARTTIME: this.form.ExpiryDateFrom,
        ID: this.Info.ID
      })
        .then((res) => {
          console.log(res)
          if (res.data.code === 'success') {
            this.$parent.search()
            this.$message({
              type: 'success',
              message: '成功更新'
            })
          }
        })
        .catch((err) => {
          console.log(err)
        })
      this.handleDialog()
    },
    // 确定 （添加用户）
    handleAddUser (row) {
      let rowData = {}
      rowData.ACCOUNT = row.sAMAccountName || ''
      rowData.DISNAME = row.displayName || ''
      rowData.EMAIL = row.mail || ''
      rowData.ENDTIME = this.form.ExpiryDateTo || ''
      rowData.MOBILE = row.MOBILE || ''
      rowData.NAME = row.name || ''
      rowData.STARTTIME = this.form.ExpiryDateFrom || ''
      rowData.TELPHONE = row.TELPHONE || ''
      this.axios.post('/user/addLdapUser', rowData)
        .then((res) => {
          if (res.data.code === 'success') {
            this.$message({
              type: 'success',
              message: '成功添加用户'
            })
          } else {
            this.$message({
              showClose: true,
              duration: 5000,
              type: 'error',
              message: res.data.msg
            })
          }
        })
        .catch((err) => {
          console.log(err)
        })
      this.refreshTable() // 刷新LDAP
      this.handleDialog()
    },
    // 确定 （批量添加用户）
    async handleAddUsers (Obj) {
      let arr = Object.values(Obj)
      for (let row of arr) {
        let rowData = {}
        rowData.ACCOUNT = row.sAMAccountName || ''
        rowData.DISNAME = row.displayName || ''
        rowData.EMAIL = row.mail || ''
        rowData.ENDTIME = this.form.ExpiryDateTo || ''
        rowData.MOBILE = row.MOBILE || ''
        rowData.NAME = row.name || ''
        rowData.STARTTIME = this.form.ExpiryDateFrom || ''
        rowData.TELPHONE = row.TELPHONE || ''
        await this.axios.post('/user/addLdapUser', rowData)
          .then((res) => {
            console.log(res.data.code)
          })
      }
      this.$message({
        type: 'success',
        message: '成功批量添加用户'
      })
      this.refreshTable() // 刷新LDAP
      this.handleDialog()
    },
    // 刷新LDAP 用户列表
    refreshTable () {
      this.$emit('refreshTable')
    },
    // 关闭对话框
    handleDialog () {
      this.$emit('showDialog', 'Time')
    }
  }
}
</script>

<style scoped>
</style>
