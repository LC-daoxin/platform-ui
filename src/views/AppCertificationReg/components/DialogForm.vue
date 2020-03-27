<template>
  <el-form :model="form" :rules="rules" label-width="90px" size="mini">
    <el-form-item label="应用名称">
      <el-input size="mini"></el-input>
    </el-form-item>
    <el-form-item label="应用密钥">
      <el-input size="mini"></el-input>
    </el-form-item>
    <el-form-item label="授权类型">
      <el-select v-model="form.type" size="mini">
        <el-option
          v-for="(item, index) of authorizationType"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="权限范围">
      <el-select v-model="form.range" size="mini">
        <el-option
          v-for="(item, index) of scopeOfAuthority"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="重定向地址">
      <el-input size="mini"></el-input>
    </el-form-item>
    <el-form-item label="自动认证">
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      form: {
        type: '',
        range: ''
      },
      rules: {},
      authorizationType: [
        {
          lable: 'password',
          value: 'password'
        },
        {
          lable: 'authorization_code',
          value: 'authorization_code'
        },
        {
          lable: 'refresh_token',
          value: 'refresh_token'
        },
        {
          lable: 'client_credentials',
          value: 'client_credentials'
        },
        {
          lable: 'implicit',
          value: 'implicit'
        }
      ],
      scopeOfAuthority: [
        {
          label: 'All',
          value: 'All'
        },
        {
          label: 'Read',
          value: 'Read'
        },
        {
          label: 'Write',
          value: 'Write'
        },
        {
          label: 'Server',
          value: 'Server'
        }
      ]
    }
  }
}
</script>

<style scoped>
  .el-input {
    width: 173px;
  }
</style>
