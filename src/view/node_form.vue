<template>
  <el-dialog :close-on-click-modal="false" :visible.sync="visible">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="审批人设置" name="first">
        <el-form :model="node" ref="dataForm" label-width="120px">
          <el-form-item label="审批操作类型" v-if="node.type=='check'">
            <el-radio-group v-model="node.typeapproval">
              <el-radio :label="'会签'">会签审批</el-radio>
              <el-radio :label="'或签'">或签审批</el-radio>
              <el-radio :label="'依次'">依次审批</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="子操作开关" v-if="node.type=='check'">
            <el-checkbox v-model="node.ifCountsign">加签</el-checkbox>
          </el-form-item>
          <el-form-item label="审批人" v-if="node.type=='check'">
            <el-select multiple v-model="node.approver" placeholder="请选择审批人">
              <el-option label="张三" value="张三"></el-option>
              <el-option label="李四" value="李四"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="抄送人" v-if="node.type=='check'">
            <el-select multiple v-model="node.ccpeople" placeholder="请选择抄送人">
              <el-option label="张三" value="张三"></el-option>
              <el-option label="李四" value="李四"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="审批节点设置" name="second">
        <el-form :model="node" ref="dataForm" label-width="120px">
          <el-form-item label="审批节点名称">
            <el-input v-model="node.name"></el-input>
          </el-form-item>
          <el-form-item label="节点备注" v-if="node.type=='check'">
            <el-input v-model="node.remark"></el-input>
          </el-form-item>
          <el-form-item label="默认策略" v-if="node.type=='check'">
            <el-checkbox v-model="node.defaultPolicy">当审批人为空时继续往下个节点提交</el-checkbox>
          </el-form-item>
          <el-form-item label="操作开关" v-if="node.type=='check'">
            <el-checkbox-group v-model="switchOperation">
              <el-checkbox label="复选框 A"></el-checkbox>
              <el-checkbox label="复选框 B"></el-checkbox>
              <el-checkbox label="复选框 C"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="节点字段权限" v-if="node.type=='check'">
            <el-link type="info">点击设置</el-link>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" icon="el-icon-close">取消</el-button>
      <el-button type="primary" icon="el-icon-check" @click="visible = false">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      node: {},
      switchOperation: [],
      activeName: "first"
    };
  },
  methods: {
    /**
     * 表单修改，这里可以根据传入的ID进行业务信息获取
     * @param data
     * @param id
     */
    init(data, id) {
      this.visible = true;
      data.nodeList.filter(node => {
        if (node.id === id) {
          this.node = node;
        }
      });
    },
    handleClick(tab, event) {
      console.log(tab, event);
    }
  },
  mounted() {
    // this.$set(this.node, "switchOperation", []);
  }
};
</script>
