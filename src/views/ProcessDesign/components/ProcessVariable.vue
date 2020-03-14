<template>
  <div class="process">
    <!-- 控制栏 start -->
    <div class="bar">
      <el-row>
        <el-col :span="24">
          <el-button class="filter-item" type="primary" size="mini" icon="el-icon-magic-stick">解析</el-button>
          <el-button class="filter-item" type="success" size="mini" icon="el-icon-folder-checked">保存</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 控制栏 end -->
    <!-- 流程变量 start -->
    <el-row>
      <el-col :span="24">
        <div class="Text"><span class="danger">*</span>查询语句<span class="danger">（提示：请使用@ApplicationID作为唯一参数！）</span></div>
      </el-col>
      <el-col :span="24">
        <el-input
          type="textarea"
          :rows="12"
          v-model="textarea">
        </el-input>
      </el-col>
    </el-row>
    <!-- 流程变量 end -->
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'process-variable',
  data () {
    return {
      textarea: ''
    }
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    getInfo () {
      // axios.get('/mock/ProcessConfiguration.json')
      //   .then(this.getHomeInfoSucc)
    },
    getHomeInfoSucc (res) {
      this.tableData = res.data.items
    }
  }
}
</script>

<style lang="scss" scoped>
.process {
  // padding: 8px;
  .bar:not(:first-child) {
    margin-top: 5px;
  }
  .Text {
    margin: 10px 0;
    .danger {
      color: red;
    }
  }
}
</style>
