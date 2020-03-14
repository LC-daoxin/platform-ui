<template>
  <div class="config-info">
    <h4>扩展节点基本信息</h4>
    <section>
      <span class="title">扩展节点基本信息：</span>
      <el-input size="mini" style="width:150px;margin-right:10px"></el-input>
      <el-button type="primary" size="mini">保存扩展节点</el-button>
    </section>
    <h4>扩展节点规则</h4>
    <h5>前置条件</h5>
    <el-table class="table" :data="precondition" size="mini" border>
      <el-table-column
        prop="connectRelation"
        label="关联关系"
        align="center"
        width="110"
      >
        <template>
          <el-select size="mini">
            <el-option value=""></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="左括号"
        align="center"
        width="110"
      >
        <template>
          <el-select size="mini">
            <el-option value=""></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="条件表达式"
        align="center"
        width="230"
      >
        <template>
          <div class="cell-co">
            <el-select size="mini" v-model="condition" style="margin-right:10px;width:100px">
              <el-option value=""></el-option>
            </el-select>
            <el-select size="mini" v-model="conditionTitle" style="width:100px">
              <el-option value=""></el-option>
            </el-select>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="比较公式"
        align="center"
        width="110"
      >
        <template>
          <el-select size="mini">
            <el-option value=""></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="结果表达式"
        align="center"
        width="200"
      >
        <template>
          <div class="cell-co">
            <el-select size="mini" v-model="result" style="margin-right:10px">
              <el-option value=""></el-option>
            </el-select>
            <el-input size="mini"></el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="右括号"
        align="center"
        width="110"
      >
        <template>
          <el-select size="mini">
            <el-option value=""></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="80"
      >
        <template>
          <el-button type="primary" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <p>表达式</p>
    <el-input
      type="textarea"
      :rows="2"
      placeholder="请输入内容"
      size="mini">
    </el-input>
    <h5>后置条件</h5>
    <el-table class="table" :data="precondition" size="mini" border>
      <el-table-column
        prop="connectRelation"
        label="关联关系"
        align="center"
        width="110"
      >
        <template>
          <el-select size="mini">
            <el-option value=""></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="左括号"
        align="center"
        width="110"
      >
        <template>
          <el-select size="mini">
            <el-option value=""></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="条件表达式"
        align="center"
        width="230"
      >
        <template>
          <div class="cell-co">
            <el-select size="mini" v-model="condition" style="margin-right:10px;width:100px">
              <el-option value=""></el-option>
            </el-select>
            <el-select size="mini" v-model="conditionTitle" style="width:100px">
              <el-option value=""></el-option>
            </el-select>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="比较公式"
        align="center"
        width="110"
      >
        <template>
          <el-select size="mini">
            <el-option value=""></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="结果表达式"
        align="center"
        width="200"
      >
        <template>
          <div class="cell-co">
            <el-select size="mini" v-model="result" style="margin-right:10px">
              <el-option value=""></el-option>
            </el-select>
            <el-input size="mini"></el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="右括号"
        align="center"
        width="110"
      >
        <template>
          <el-select size="mini">
            <el-option value=""></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="80"
      >
        <template>
          <el-button type="primary" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <p>表达式</p>
    <el-input
      type="textarea"
      :rows="2"
      placeholder="请输入内容"
      size="mini">
    </el-input>
    <h5>扩展节点审批人</h5>
    <header>
      <el-select size="mini" v-model="approverType" style="margin-right:10px">
        <el-option value=""></el-option>
      </el-select>
      <el-button size="mini" type="primary">添加审批人</el-button>
    </header>
    <el-table size="mini" border></el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      condition: 'Express',
      conditionTitle: '申请人AD',
      result: 'Consta',
      approverType: 'User',
      precondition: [
        {}
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
  .config-info {
    padding: 0 10px;

    section {
      padding: 0 10px;

      .title {
        font-size: 12px;
      }
    }

    p {
      font-size: 12px;
      font-weight: bold;
    }

    header {
      margin-bottom: 10px;
    }

    .cell-co {
      display: flex;
    }
  }

  // .table {
  //   margin-top: 5px;
  //   ::v-deep .el-table-column--selection .cell {
  //     padding-right: 10px;
  //   }
  //   ::v-deep .el-button--mini {
  //     padding: 4px 8px;
  //   }
  //   ::v-deep .cell {
  //     padding: 0 4px !important;
  //   }
  //   ::v-deep .el-input__inner {
  //     padding-left: 4px;
  //   }
  // }
</style>