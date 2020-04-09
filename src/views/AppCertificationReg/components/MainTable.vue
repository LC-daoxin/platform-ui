<template>
  <el-table :data="tableData" :height="tableHeight" size="mini" border>
    <el-table-column label="应用名称" prop="name" align="center"></el-table-column>
    <el-table-column label="应用ID" prop="id" align="center" width="190"></el-table-column>
    <el-table-column label="授权类型" prop="type" align="center">
      <template slot-scope="scope">
        <el-tag v-for="(item, index) of scope.row.type" :key="index" size="mini">{{ item }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="授权范围" prop="range" align="center">
      <template slot-scope="scope">
        <el-tag type="success" size="mini">{{ scope.row.range }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="重定向地址" prop="url" align="center">
      <template slot-scope="scope">
        <el-button type="text" size="mini">{{ scope.row.url }}</el-button>
      </template>
    </el-table-column>
    <el-table-column label="自动认证" prop="certification" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.certification ? '是' : '否' }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center">
      <template>
        <el-button type="primary" size="mini" @click="handleEdit">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    tableData: Array
  },
  data () {
    return {
      tableHeight: window.innerHeight - 205
    }
  },
  methods: {
    handleEdit () {
      this.$emit('edit', '编辑')
    }
  }
}
</script>
