<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login_form"
          :model="loginForm"
          :rules="rules"
          ref="loginFormRef"
        >
          <h1>Hello</h1>
          <h2>欢迎来到AdminSystem</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              show-password
              :prefix-icon="Lock"
              v-model="loginForm.password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              type="primary"
              size="default"
              class="login_button"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
import { getTime } from '@/utils/time.ts'
// 引入用户相关的小仓库
import useUserStore from '@/store/module/user'
let useStore = useUserStore()
// 获取路由器
let $router = useRouter()

// 获取表单组件实例 通过ref
let loginFormRef = ref()
//控制登录按钮loading效果
let loading = ref(false)
let nowTime = getTime()
const loginForm = reactive({ username: 'admin', password: '111111' })
// username字段自定义检验规则
const validateUsername = (rule: any, value: any, callback: any) => {
  if (value.length >= 5 && value.length < 10) {
    callback()
  } else {
    callback(new Error('账户长度应在5-10位之间'))
  }
}
//rule 为检验规则对象
//value 为表单元素文本内容
// callback:符合条件callback放行  不符合注入错误提示信息
const validatePassword = (rule: any, value: any, callback: any) => {
  // console.log(rule,value,callback);
  if (value.length >= 6 && value.length < 10) {
    callback()
  } else {
    callback(new Error('密码应在6-10位之间'))
  }
}
// 定义表单检验规则
const rules = {
  username: [
    { required: true, message: '账户名不能为空', trigger: 'blur' },
    { validator: validateUsername, trigger: 'change' },
  ],
  password: [
    { validator: validatePassword, trigger: 'change' },
    { required: true, message: '账户名不能为空', trigger: 'blur' },
  ],
}
const login = async () => {
  await loginFormRef.value.validate()
  loading.value = true
  try {
    await useStore.userLogin(loginForm)
    $router.push('/')
    ElNotification({
      type: 'success',
      message: '登录成功',
      title: `Hi~${nowTime}好`,
    })
    loading.value = false
  } catch (error) {
    console.log(error)
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
    loading.value = false
  }
}
</script>
<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
  // position: relative;
  .login_form {
    position: relative;
    left: 10vh;
    top: 30vh;
    width: 60%;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 45px;
    h1 {
      color: white;
      font-size: 40px;
    }
    h2 {
      font-size: 20px;
      color: white;
      margin: 20px 0;
    }
    .login_button {
      width: 90%;
      margin: 10px auto;
    }
  }
}
</style>
