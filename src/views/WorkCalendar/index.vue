<template>
  <div class="dashboard-editor-container">
    <header>
      <span>选择日历</span>
      <el-select size="mini" v-model="calendar">
        <el-option
          v-for="(item, index) of calendarSelect"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button size="mini" type="primary" @click="showDialog('添加日历')">添加日历</el-button>
      <el-button size="mini" type="primary" @click="showDialog('修改日历')">修改日历</el-button>
    </header>
    <main>
      <el-calendar v-model="calendarValue">
        <template
          slot="dateCell"
          slot-scope="{date, data}">
          <p :class="data.isSelected ? 'is-selected' : ''">
            {{ data.day.split('-').slice(2).join('-') }} {{ data.isSelected ? '✔️' : ''}}
          </p>
        </template>
      </el-calendar>
    </main>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="35%">
      <el-form ref="form" size="mini" :rules="rules" :model="form" label-width="100px">
        <el-form-item label="日历名称">
          <el-input size="mini"></el-input>
        </el-form-item>
        <el-form-item label="所在时区">
        </el-form-item>
        <el-form-item label="服务器时区">
        </el-form-item>
        <el-form-item label="起止时间">
        </el-form-item>
        <el-form-item label="每周工作日">
        </el-form-item>
        <el-form-item label="描述">
        </el-form-item>
        <el-form-item label="工作时间段">
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">提交</el-button>
        <el-button type="primary" @click="dialogVisible = false" size="mini">撤销</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      calendar: '',
      calendarValue: new Date(),
      calendarSelect: [
        {
          label: '工作日历1',
          value: '工作日历1'
        }, {
          label: '工作日历2',
          value: '工作日历2'
        }
      ],
      dialogTitle: '添加日历',
      dialogVisible: false,
      form: {},
      rules: []
    }
  },
  methods: {
    showDialog(title) {
      this.dialogTitle = title
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
  .dashboard-editor-container
    header {
      display: flex;
      align-items: center;
      margin-bottom: 12px;

      span {
        font-size: 12px;
      }

      .el-select {
        margin: 0 10px;
      }
    }
</style>