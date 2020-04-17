<template>
  <el-form :model="form" :rules="rules" label-width="95px" ref="form" size="mini">
    <el-form-item label="应用名称" prop="appName">
      <el-input size="mini" v-model="form.appName"></el-input>
    </el-form-item>
    <el-form-item label="应用密钥" prop="clientSecret">
      <el-input size="mini" v-model="form.clientSecret"></el-input>
    </el-form-item>
    <el-form-item label="授权类型" prop="authorizedGrantTypes">
      <el-select v-model="form.authorizedGrantTypes" size="mini" multiple>
        <el-option
          v-for="(item, index) of authorizationType"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="权限范围" prop="scope">
      <el-select v-model="form.scope" size="mini" multiple>
        <el-option
          v-for="(item, index) of scopeOfAuthority"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="重定向地址" prop="webServerRedirectUri">
      <el-input size="mini" v-model="form.webServerRedirectUri"></el-input>
    </el-form-item>
    <el-form-item label="自动认证">
      <el-switch
        v-model="form.autoapprove"
        active-color="#13ce66"
        inactive-color="#ff4949">
      </el-switch>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      form: {
        appName: '',
        clientSecret: '',
        authorizedGrantTypes: [],
        scope: [],
        webServerRedirectUri: '',
        autoapprove: false
      },
      rules: {
        appName: [
          { required: true, message: '请输入应用名称', trigger: 'blur' }
        ],
        clientSecret: [
          { required: true, message: '应用密钥', trigger: 'blur' }
        ],
        authorizedGrantTypes: [
          { required: true, message: '请选择授权类型', trigger: 'blur' }
        ],
        scope: [
          { required: true, message: '请选择权限范围', trigger: 'blur' }
        ],
        webServerRedirectUri: [
          { required: true, message: '请选输入重定向地址', trigger: 'blur' }
        ]
      },
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
    width: 200px;
  }
  .el-select {
    width: 200px;
  }
</style>
