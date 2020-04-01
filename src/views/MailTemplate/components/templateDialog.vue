<template>
  <div>
    <el-tabs>
      <el-tab-pane label="模版主项">
        <template-main></template-main>
      </el-tab-pane>
      <el-tab-pane label="模版正文">
        <template-text></template-text>
      </el-tab-pane>
<!--      <el-tab-pane label="输入参数设置">-->
<!--        <input-parameters></input-parameters>-->
<!--      </el-tab-pane>-->
<!--      <el-tab-pane label="参数换算设置">参数换算设置</el-tab-pane>-->
    </el-tabs>
  </div>
</template>

<script>
import TemplateMain from './templateMain'
import TemplateText from './templateText'
// import InputParameters from './inputParameters'

export default {
  components: {
    TemplateMain,
    TemplateText
    // InputParameters
  }
}
</script>

<style>

</style>
