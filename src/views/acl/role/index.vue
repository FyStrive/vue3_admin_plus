<template>
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="职位搜索:">
        <el-input
          placeholder="请输入搜索职位关键字"
          v-model="keyword"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0">
    <el-button type="primary" @click="addRole">添加职位</el-button>
    <el-table border :data="allRole">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column
        label="职位名称"
        align="center"
        prop="roleName"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" align="center" width="300px">
        <template #="{ row }">
          <el-button type="primary" size="small" icon="User">
            分配角色
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateRole(row)"
          >
            编辑
          </el-button>
          <el-popconfirm :title="`你确定删除${row.roleName}吗?`" width="260px">
            <template #reference>
              <el-button type="primary" size="small" icon="Delete">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 @current-change="getHasUser"-->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[5, 7, 9, 11]"
      :background="true"
      layout="prev, pager, next, jumper,->,total, sizes"
      :total="total"
      @current-change="currentChange"
      @size-change="sizeChange"
    />
  </el-card>

  <!-- 新增职位与更新的弹框 -->
  <el-dialog v-model="dialogVisite" title="添加职位">
    <el-form>
      <el-form-item label="职位名称:">
        <el-input placeholder="请输入添加的职位名称"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="dialogVisite = false">取消</el-button>
      <el-button type="primary">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/module/setting.ts'
import { reqAllRoleList } from '@/api/acl/role/index'
import type { RoleResponseDdata, Records } from '@/api/acl/role/type'
import { ref, onMounted } from 'vue'
import { RoleData } from '@/api/acl/user/type'
//当前页
let currentPage = ref<number>(1)
//一页的数据个数
let pageSize = ref<number>(5)
let total = ref<number>(0)
// let roleName = ref<string>('')
let allRole = ref<Records>([])
//搜索输入框关键字
let keyword = ref<string>('')
// 控制弹框的显示
let dialogVisite = ref<boolean>(false)
onMounted(() => {
  getHasRole()
})

// 获取当前表单数据
const getHasRole = async (pager = 1) => {
  currentPage.value = pager
  let result: RoleResponseDdata = await reqAllRoleList(
    currentPage.value,
    pageSize.value,
    keyword.value,
  )
  if (result.code === 200) {
    total.value = result.data.total
    allRole.value = result.data.records
  }
}
// 当前页数变化
const currentChange = () => {
  getHasRole(currentPage.value)
}
// 一页可展示的数据个数发生变化
const sizeChange = () => {
  getHasRole()
}
// 搜索
const search = () => {
  getHasRole()
  keyword.value = ''
}
// 重置 即刷新
const reset = () => {
  let useSettingStore = useLayoutSettingStore()
  useSettingStore.refresh = !useSettingStore.refresh
}

// 添加职位
const addRole = () => {
  dialogVisite.value = true
}
const updateRole = (row: RoleData) => {
  dialogVisite.value = true
}
</script>
<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
