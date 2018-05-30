<template>
    <div id="app">
    
        <div class="loginPanel">
            <div class="logo">中宝协</div>
            <div class="loginWrap">
                <h2>登陆</h2>
                <input type="text" class="input" value="" placeholder="用户名">
                <p></p>
                <input type="password" class="input" value="" placeholder="密码">
                <p></p>
                <button class="loginBtn" v-on:click="login">登录</button>
                <div>
                    <a>忘记密码？</a>
                </div>
            </div>
        </div>
        <div class="copyright">
            <p>© 2018 FuHai All rights reserved.</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Login',
    methods: {
        login: function(){
            location.href = "/"
        }
    }
}
</script>

<style>
body {
    background: #fafafa;

}
.loginPanel {
    position: absolute;
    right: 0;
    left: 0;
    margin: auto;
    top: 20%;
    bottom: 20%;
}
.logo {
    width: 200px;
    margin: 0 auto;
    text-align: center;
    font-size: 20px;
}
.loginWrap {
    overflow: hidden;
    width: 400px;
    margin: 40px auto;
    text-align: center;
    border-radius: 2px;
    box-shadow: rgba(0, 0, 0, 0.298039) 0px 0px 6px 0px;
    border: 0px none black;
    -webkit-tap-highlight-color: transparent;
    background-color: white;
    padding: 0 0 40px 0;
}
.loginWrap h2 {
    font-size: 24px;
    color: #1a1a1a;
    width: 100%;
    line-height: 84px;
    height: 64px;
    margin-bottom: 20px;
}
.loginWrap>div {
    width: 300px;
    text-align: left;
    margin: 0 auto;
    margin-top: 10px;
}
.loginWrap>p {
    height: 20px;
    line-height: 20px;
}
.input {
    box-sizing: border-box;
    font-size: 14px;
    padding: 0 4px;
    display: inline-block;
    margin: 0 auto;
    width: 300px;
    height: 36px;
    line-height: 36px;
    cursor: pointer;
    border-radius: 2px;
    border: 1px solid #e5e5e5;
    -webkit-tap-highlight-color: transparent;
    background-color: white;
}
.input:focus {
    border: 1px solid #4eb1f4;
    box-shadow: rgba(25, 161, 219, 0.247059) 0px 0px 5px 0px;
}
.loginBtn {
    font-size: 16px;
    box-sizing: border-box;
    display: inline-block;
    margin: 0 auto;
    width: 300px;
    height: 36px;
    cursor: pointer;
    border-radius: 2px;
    color: #fff;
    border: 1px solid #4eb1f4;
    -webkit-tap-highlight-color: transparent;
    background-color: #4eb1f4;
}
.loginBtn:hover {
    background: #1aa1e4;
}
.copyright {
    position: absolute;
    bottom: 20px;
    width: 100%;
    text-align: center;
    color: #999;
}
</style>
