import '../icon/style.css';
import Vue from 'vue';
import App from '../view/app.vue';
//cookie
(function() {
	var Cookie = {
		setCookie(key, value, expire_days = 7) {
			var date = new Date();
			date.setDate(date.getDate() + expire_days);
			document.cookie = key + "=" + encodeURIComponent(value) + ";expires=" + date.toGMTString() + ";path=/";
		},
		getCookie(key) {
			let reg = RegExp('(?:^| )' + key + '=([^;]+)(?:;|$)'), //直接开头或有空格，中间不含分号，分号结束或是结尾
				arr = document.cookie.match(reg);
			if(arr) {
				return decodeURIComponent(arr[1]);
			}
			return null;
		},
		delCookie(key) {
			var date = new Date();
			date.setDate(date.getDate() - 1);
			document.cookie = key + "=" + encodeURIComponent(this.getCookie(key)) + ";expires=" + date.toGMTString() + ";path=/";
		}
	}
	window.Cookie = Cookie;
})();
var app = new Vue({
	el: "#app",
	render: v => v(App),
});