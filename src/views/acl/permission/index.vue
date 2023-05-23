<template>
  <el-table style="width:100%;margin-bottom: 20px;" row-key="id" border :data="permissionArr">
    <el-table-column label="名称" prop="name"></el-table-column>
    <el-table-column label="权限值" prop="code"></el-table-column>
    <el-table-column label="修改时间" prop="updateTime"></el-table-column>
    <el-table-column label="操作">
      <template #="{ row }">
        <el-button @click="addPermission(row)" type="primary" size="small" :disabled="row.level === 4 ? true : false">{{
          row.level
          === 3 ? '添加功能' : '添加菜单' }}</el-button>
        <el-button @click="updatePermission(row)" type="primary" size="small"
          :disabled="row.level === 1 ? true : false">编辑</el-button>
        <el-popconfirm :title="`你确定删除${row.name}吗?`" width="260px" @confirm="removeMenu(row)">
          <template #reference>
            <el-button type="primary" size="small" :disabled="row.level === 1 ? true : false">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>

  <!-- 添加菜单与编辑的对话框 -->
  <el-dialog v-model="dialogVisible" :title="menuPrama.id ? '编辑菜单' : '添加菜单'" width="30%">
    <el-form>
      <el-form-item label="名称">
        <el-input placeholder="请你输入菜单名称" v-model="menuPrama.name"></el-input>
      </el-form-item>
      <el-form-item label="权限">
        <el-input placeholder="请你输入权限名称" v-model="menuPrama.code"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
// 引入获取菜单请求API
import { reqAllPermission, reqAddOrUpdateMenu, reqRemoveMenu } from '@/api/acl/menu'
// 引入类型
import type { PermissionResponseData, PermissionList, MenuParams, Permission } from '@/api/acl/menu/type'
import { ElMessage } from 'element-plus';
let permissionArr = ref<PermissionList>([])
// 获取菜单数据的方法
const getHasPermission = async () => {
  let result: PermissionResponseData = await reqAllPermission()
  if (result.code === 200) {
    permissionArr.value = result.data
  }
}
// 携带参数
let menuPrama = reactive<MenuParams>({
  code: '',
  level: 0,
  name: '',
  pid: 0,
})
// 控制对话框隐藏与否
let dialogVisible = ref<boolean>(false)
onMounted(() => {
  getHasPermission()
})
const addPermission = (row: Permission) => {
  Object.assign(menuPrama, {
    code: '',
    level: 0,
    name: '',
    pid: 0,
    id: undefined
  })
  dialogVisible.value = true
  console.log(menuPrama);
  //是给这一级菜单增加子菜单所以加1
  menuPrama.level = row.level + 1
  // 给谁新增子菜单
  menuPrama.pid = (row.id as number)
}
const updatePermission = (row: Permission) => {
  dialogVisible.value = true
  Object.assign(menuPrama, row)
}
const removeMenu = async (row: Permission) => {
  console.log(row);
  let result = await reqRemoveMenu(row.id)
  if (result.code === 200) {
    ElMessage({ type: 'success', message: `删除${row.name}成功!` })
    getHasPermission()
  }
}
// 确定按钮毁掉 新增菜单|编辑菜单
const save = async () => {
  let result = await reqAddOrUpdateMenu(menuPrama)
  if (result.code === 200) {
    ElMessage({ type: 'success', message: menuPrama.id ? '更新菜单成功!' : '添加菜单成功!' })
    dialogVisible.value = false
    getHasPermission()
  }
}
</script>
<style scoped lang="scss"></style>
