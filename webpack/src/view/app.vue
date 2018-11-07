<template>
	<div>
		<easy-login 
			:word=true 
			:icon=true 
			:error-info="errors" 
			:btn-text="btnText" 
			:code-flag="codeFlag" 
			:img-path="imgPath" 
			@check-code="check" 
			@submit="toSubmit" 
			@get-img="getImg">
		</easy-login>
	</div>
</template>

<script>
	import easyLogin from './easyUtil.loginUi.1.0.vue';

	export default {
		components: {
			easyLogin
		},
		data(){
			return{
				errors: {
					user: "用户名绝对不能为空",
					pwd: "密码不能绝对为空",
					code: "验证码绝对不能为空"
				},
				codeFlag: !1,
				btnText: "登录",
				imgPath: ""
			}
		},
		mounted() {
			this.$nextTick(function() {});
		},
		methods: {
			check(t) {
				var e = this;
				setTimeout(function() {
					e.codeFlag = ("1234" === t);
				}, 100);
			},
			toSubmit(t) {
				"1234" == t.pwd ? alert("ok") : alert("no!");
			},
			getImg() {
				this.imgPath = "../../src/img/loading.png";
			}
		}
	}
</script>

<style>

</style>