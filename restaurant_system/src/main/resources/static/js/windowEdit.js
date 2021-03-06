var windowInfo;
var types;
var colors = ['#69b076', '#ffd900', '#b94047', '#1e50a2'];
window.onload=function(){
	$('.left').append('<div class="window"><button class="addWindow noneBtn" mdui-dialog="{target: \'#addDialog\'}"><i class="layui-icon" style="width: 30%; height: 30%; color: #333">&#xe654;</i></button></div>');
	//获取foodType
	$.ajax({
		url: 'http://localhost:8080/getFoodType',
		type: 'get',
		dataType: 'json',
		success:function(res){
			types = res;
			$.each(res,function(element) {
				$('.foodType').prepend('<button class="type littleBtn" onclick="delType(this)">'+ res[element].name +'</button>');
			});
			$.each(res,function(index) {
				$('.type').eq(index).css('background', colors[index%4]);
			});
		}
	})
	//获取windowInfo
	$.ajax({
		url: 'http://localhost:8080/getWindowInfo',
		type: 'get',
		dataType: 'json',
		success:function(res){
			windowInfo = res;
			$.each(res,function(element) {
				$('.windowInfo').append('<div class="mdui-card window"><div class="mdui-card-media" style="height: 60%;"><img class="head" style="height: 100%;" /><div class="mdui-card-menu" style="top: 2px; right: 2px;"><button class="mdui-btn mdui-btn-icon mdui-text-color-white delWindow" onclick="delWindow(this)"><i class="mdui-icon material-icons">&#xe872;</i></button></div></div><div onclick="edit(this)" mdui-dialog="{target: \'#editDialog\'}" class="mdui-card-primary edit" style="height:40%;padding: 8px 0px 0px 8px;"><div class="mdui-card-primary-title">'+res[element].windowName+'</div><div class="mdui-card-primary-subtitle">'+res[element].windowIntroduction+'</div></div></div>')
			});
		}
	})
	$.ajax({
		url: 'http://localhost:8080/firstImgs',
		type: 'get',
		dataType: 'json',
		success:function(res){
			$.each(res,function(element) {
				$('.head').eq(element).attr('src', res[element].url);
			});
		}
	})
}

function addType(){
	var name=prompt("请输入类型","")
	if (name == null) {
		return;
	}
	if(name != "" && name != null){
		$.ajax({
			url: 'http://localhost:8080/addFoodType?name='+name,
			success:function(){
				$('.foodType').prepend('<button class="type littleBtn">'+ name +'</button>');
				alert('添加成功');
				window.location.reload();
			}
		})
	}else{
		alert("输入内容不合法")
	}
}

function delType(res){
	var len = types.length;
	var index = len - $('.foodType .type').index(res) - 1;
	var choose = confirm("确认删除");
	if (choose) {
		$.ajax({
			url: 'http://localhost:8080/delFoodType?id='+types[index].id,
			success:function(){
				$('.type').eq(index).remove();
				window.location.reload();
			}
		});
	}
}

function delWindow(res){
	var index = $('.windowInfo .delWindow').index(res);
	$.ajax({
		url: 'http://localhost:8080/delWindowInfo?id='+windowInfo[index].id,
		success:function(){
			$('.window').eq(index).remove()
			alert("删除成功")
			//刷新页面
			window.location.reload();
		}
	})
}

// function editName(res){
// 	var index = $('.windowInfo .editName').index(res);
// 	var name = prompt("请输入餐厅名称", "");
// 	if (name != "" && name != null) {
// 		$.ajax({
// 			url: 'http://localhost:8080/uploadWindowInfo?id='+windowInfo[index].id+'&windowName='+name+'&windowIntroduction='+windowInfo[index].windowIntroduction,
// 			success:function(){
// 				alert("修改成功")
// 				//刷新页面
// 				window.location.reload();
// 			}
// 		})
// 	}
// }

// function editIntrodction(res){
// 	var index = $('.windowInfo .editIntrodction').index(res);
// 	var introduction = prompt("请输入餐厅介绍", "");
// 	if (introduction != "" && introduction != null) {
// 		$.ajax({
// 			url: 'http://localhost:8080/uploadWindowInfo?id='+windowInfo[index].id+'&windowName='+windowInfo[index].windowName+'&windowIntroduction='+introduction,
// 			success:function(){
// 				alert("修改成功")
// 				//刷新页面
// 				window.location.reload();
// 			}
// 		})
// 	}
// }

function addWindow(){
	var nameText = $('.textName').val();
	var introductionText = $('.textIntroduction').val();
	if (nameText != null && introductionText != null && nameText != "" && introductionText != ""){
		$.ajax({
			url: 'http://localhost:8080/addWindowInfo?windowName='+nameText+'&windowIntroduction='+introductionText,
			success:function(){
				alert("修改成功")
				//刷新页面
				window.location.reload();
			}
		})
	}else{
		alert("输入内容不合法")
	}

}

var index = 0;

function edit(res){
	index = $('.windowInfo .edit').index(res);
}

function save(){
	var nameText = $('.nameText').val();
	var introductionText = $('.introductionText').val();
	if (nameText != null && introductionText != null && nameText != "" && introductionText != "") {
		$.ajax({
			url: 'http://localhost:8080/uploadWindowInfo?id='+windowInfo[index].id+'&windowName='+nameText+'&windowIntroduction='+introductionText,
			success:function(){
				alert("修改成功")
				//刷新页面
				window.location.reload();
			}
		})
	}
}
