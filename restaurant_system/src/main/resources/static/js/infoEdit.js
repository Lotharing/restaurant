var fragmentA = '<tr class="item"><th class="columnA"><input type="checkbox" name="checked" class="checkbox" onchange="choose(this)"></th><th class="columnB">';
var fragmentB = '</th><th class="columnC"><img class="img" style="width:50px; height:50px;" src="';
var fragmentC = '"><button type="button" style="display:none" class="layui-btn file" id="uploadImg">上传图片</button></th><th class="columnD"><input disabled type="text" class="nameText text" value="';
var fragmentD = '"></th><th class="columnE"><input type="number" disabled class="priceText text" value="';
var fragmentE = '"></th><th class="columnF"><select disabled class="typeSelect select">';
var fragmentF = '</select></th><th class="columnG"><select disabled class="windowSelect select">';
var fragmentG = '</select></th><th class="columnH"><button class="editOrSaveBtn" onclick="editOrSave(this)">修改</button><button class="delOrCancelBtn" onclick="delOrCancel(this';
var fragmentH = ')">删除</button></th>';
var uploadTextA = '<script>layui.use(\'upload\', function(){var upload = layui.upload; var uploadInst = upload.render({elem: \'#uploadImg\' ,url: \'http://localhost:8080/uploadImg\',done: function(res){},error: function(){}, data:{foodNumber:';
var uploadTextB = '}});});</script>';
var foodInfo;
var timeStamp = 0;
var types = new Set();
var windows = new Set();

window.onload=function(){
	$.ajax({
		url: 'http://localhost:8080/getAllInfo',
		type: 'get',
		dataType: 'json',
		success: function(res) {
			foodInfo = res;
            $.each(res, function(){
            	// res.forEach(function(element){
            	// 	types.add(element.foodType);
            	// 	windows.add(element.restaurantWindowNumber);
            	// });
            	$('.items').append(fragmentA+this.foodNumber+fragmentB
            		+this.foodImgUrl+fragmentC+this.foodName+fragmentD
            		+this.foodPrice+fragmentE+fragmentF+fragmentG+fragmentH);
			});
			
        },
	});
	$.ajax({
		url: 'http://localhost:8080/getFoodType',
		type: 'get',
		dataType: 'json',
		success: function(res) {
			types = res;
			var count = 0;
			$.each(foodInfo, function() {
				var that = this;
				types.forEach(function(element){
					if (that.foodType == element.name) {
            			$('.typeSelect').eq(count).append('<option selected value ="'+ element.name +'">'+ element.name +'</option>');
            		}else{
            			$('.typeSelect').eq(count).append('<option value ="'+ element.name +'">'+ element.name +'</option>');	
            		}
				});
				count++;
			});
		}
	});
	$.ajax({
		url: 'http://localhost:8080/getWindowInfo',
		type: 'get',
		dataType: 'json',
		success: function(res) {
			windows = res;
			var count = 0;
			$.each(foodInfo, function() {
				var that = this;
				windows.forEach(function(element){
					if (that.restaurantWindowNumber == element.restaurantWindowNumber) {
            			$('.windowSelect').eq(count).append('<option selected value ="'+ element.restaurantWindowNumber +'">'+ element.restaurantWindowNumber +'</option>');
            		}else{
            			$('.windowSelect').eq(count).append('<option value ="'+ element.restaurantWindowNumber +'">'+ element.restaurantWindowNumber +'</option>');	
            		}
				});
				count++;
			});
		}
	});
}

function create(){
	//显示当前可用按钮并隐藏当前不可用按钮
	$('.saveBtn').css({'display': 'inline-block'});
	$('.cancelAddBtn').css({'display': 'inline-block'});
	$('.addBtn').css({'display': 'none'});
	$('.batchDelBtn').css({'display': 'none'});
	$('.removeBtn').css({'display': 'none'});
	$('.cancelDelBtn').css({'display': 'none'});
	//给新建的行中的select加入信息和上传图片功能
	$('.items').prepend('<script>layui.use(\'upload\', function(){var upload = layui.upload; var uploadInst = upload.render({elem: \'#uploadImg\' ,url: \'http://localhost:8080/uploadNewImg\',done: function(res){timeStamp = res;},error: function(){}});});</script>');
	$('.items').prepend('<tr id="addInfo"><th></th><th><button type="button" class="layui-btn" id="uploadImg">上传图片</button></th><th><input type="text" class="newNameText text" value=""></th><th><input type="number" class="newPriceText text" value=""></th><th><select class="newTypeSelect select"></select></th><th><select class="newWindowSelect select"></select></th><th></th></tr>');
	types.forEach(function(element){
        $('.newTypeSelect').append('<option value ="'+ element.name +'">'+ element.name +'</option>');
    });
    windows.forEach(function(element){
        $('.newWindowSelect').append('<option value ="'+ element.restaurantWindowNumber +'">'+ element.restaurantWindowNumber +'</option>');
    });
    //其他元素不可编辑
    $('.editOrSaveBtn').attr({'disabled':true});
	$('.delOrCancelBtn').attr({'disabled':true});
	$('tr').eq(1).css('background', '#f3f3f2');
}

function cancelCreate(){
	$('#addInfo').remove();
	//显示当前可用按钮并隐藏当前不可用按钮
	$('.saveBtn').css({'display': 'none'});
	$('.cancelBtn').css({'display': 'none'});
	$('.addBtn').css({'display': 'inline-block'});
	$('.batchDelBtn').css({'display': 'inline-block'});
	$('.removeBtn').css({'display': 'none'});
	$('.cancelAddBtn').css({'display': 'none'});
	//不可编辑的其他元素还原
    $('.editOrSaveBtn').attr({'disabled':false});
	$('.delOrCancelBtn').attr({'disabled':false});
	$.ajax({
		url: 'http://localhost:8080/emptyCache',
		success:function(){
			window.location.reload();
		}
	})
}

function add(){
	var foodName = $('.newNameText').val();
	var foodPrice = $('.newPriceText').val();
	var foodType = $('.newTypeSelect').val();
	var restaurantWindowNumber = $('.newWindowSelect').val();
	if (timeStamp == 0 || foodName == '' || foodPrice == '') {
		alert('有未填写内容');
	}else{
		$.ajax({
			url: 'http://localhost:8080/addFoodInfo?restaurantWindowNumber='+restaurantWindowNumber
				+'&foodName='+foodName
				+'&foodPrice='+foodPrice
				+'&foodImgUrl='+timeStamp
				+'&foodType='+foodType,
			type: 'post',
			success: function(res) {
            	$('#addInfo').remove();
            	//不可编辑的其他元素还原
    			$('.editOrSaveBtn').attr({'disabled':false});
				$('.delOrCancelBtn').attr({'disabled':false});
				$('tr').css('background','#fff');
				$('.saveBtn').css({'display': 'none'});
				$('.cancelAddBtn').css({'display': 'none'});
				$('.addBtn').css({'display': 'inline-block'});
				$('.batchDelBtn').css({'display': 'inline-block'});
				$('.removeBtn').css({'display': 'none'});
				$('.cancelDelBtn').css({'display': 'none'});
				alert('添加成功');
				window.location.reload();
				//若上传未成功部分...
        	},
		});
	}
}

function batchDel(){
	$('.saveBtn').css({'display': 'none'});
	$('.cancelBtn').css({'display': 'none'});
	$('.addBtn').css({'display': 'none'});
	$('.batchDelBtn').css({'display': 'none'});
	$('.removeBtn').css({'display': 'inline-block'});
	$('.cancelDelBtn').css({'display': 'inline-block'});
	$('.theadA').css({'display': 'table-cell'});
	$('.columnA').css({'display': 'table-cell'});
	//其他元素不可编辑
    $('.editOrSaveBtn').attr({'disabled':true});
	$('.delOrCancelBtn').attr({'disabled':true});
}

function chooseAll(){
	if ($('.allCheck').is(':checked')) { //全选
		$('.checkbox').prop('checked', true);
	}else{ //取消
		$('.checkbox').prop('checked', false);
	}
}

function choose(res){
	var index = $('tr .checkbox').index(res);
	if (!$('.checkbox').eq(index).is(':checked')) {
		$('.allCheck').prop('checked', false);
	}
}

function del(){
	if ($('.allCheck').is(':checked')) { //删除所有
		$.ajax({
			url: 'http://localhost:8080/emptyFoodInfo',
			type: 'get',
			success: function(res) {
            	$('item').remove();
            	alert('删除成功');
            	window.location.reload();
        	},
		});
	}else{
		var array = new Array();
		var l = $('.checkbox').length;
		for (var i = 0; i < l; i++) {
			if ($('.checkbox').eq(i).is(':checked')) {
				array.push($('.columnB').eq(i).text());
			}
		}
		//上传删除信息到服务器
		$.ajax({
			url: 'http://localhost:8080/delFoodInfos',
			contentType: "application/json; charset=utf-8",
			type: 'post',
			dataType: "json",
			data: JSON.stringify({"delInfos":array}),
			success: function(res) {
            	alert('删除成功');
            	window.location.reload();
        	},
		});
	}
}

function cancelDel(){
	$('.saveBtn').css({'display': 'none'});
	$('.cancelBtn').css({'display': 'none'});
	$('.addBtn').css({'display': 'inline-block'});
	$('.batchDelBtn').css({'display': 'inline-block'});
	$('.removeBtn').css({'display': 'none'});
	$('.cancelDelBtn').css({'display': 'none'});
	$('.theadA').css({'display': 'none'});
	$('.columnA').css({'display': 'none'});
	$('.allCheck').prop('checked', false);
	$('.checkbox').prop('checked', false);
	//不可编辑的其他元素还原
    $('.editOrSaveBtn').attr({'disabled':false});
	$('.delOrCancelBtn').attr({'disabled':false});
}

function delOrCancel(res){
	var index = $('tr .delOrCancelBtn').index(res);
	if ($('.delOrCancelBtn').eq(index).text() == "删除") {
		$.ajax({
			url: 'http://localhost:8080/delFoodInfo?foodNumber='+foodInfo[index].foodNumber,
			type: 'post',
			success: function(res) {
            	$('tr').eq(index+1).remove();
            	alert('删除成功');
            	window.location.reload();
        	},
		});
	}else{
		//
		$('.nameText').eq(index).val(foodInfo[index].foodName);
		$('.priceText').eq(index).val(foodInfo[index].foodPrice);
		//
		$('.nameText').eq(index).attr({'disabled':true});
		$('.priceText').eq(index).attr({'disabled':true});
		$('.typeSelect').eq(index).attr({'disabled':true});
		$('.windowSelect').eq(index).attr({'disabled':true});
		$('.typeSelect').eq(index).attr({'disabled':true});
		$('.windowSelect').eq(index).attr({'disabled':true});
		$('.file').eq(index).css({'display': 'none'});
		$('.editOrSaveBtn').eq(index).text('修改');
		$('.delOrCancelBtn').eq(index).text('删除');
		$('tr').eq(index+1).css('background', '#1c1c1c');
		$('.img').eq(index).css('display', 'inline');
		//不可编辑的其他元素还原
		$('.editOrSaveBtn').attr({'disabled':false});
		$('.delOrCancelBtn').attr({'disabled':false});
		$('.btn').attr({'disabled':false});
	}
	
}

function editOrSave(res){
	var index = $('tr .editOrSaveBtn').index(res);
	if ($('.editOrSaveBtn').eq(index).text() == "修改") {
		//
		$('.file').eq(index).css({'display': 'inline'});
		$('.nameText').eq(index).attr({'disabled':false});
		$('.priceText').eq(index).attr({'disabled':false});
		$('.typeSelect').eq(index).attr({'disabled':false});
		$('.windowSelect').eq(index).attr({'disabled':false});
		$('.editOrSaveBtn').eq(index).text('保存');
		$('.delOrCancelBtn').eq(index).text('取消');
		$('.items').append(uploadTextA + $('.columnB').eq(index).text() + uploadTextB);
		$('.img').eq(index).css('display', 'none');
		//其他元素不可编辑
		$('tr').eq(index+1).css('background', '#f3f3f2');
		$('.editOrSaveBtn').attr({'disabled':true});
		$('.delOrCancelBtn').attr({'disabled':true});
		$('.editOrSaveBtn').eq(index).attr({'disabled':false});
		$('.delOrCancelBtn').eq(index).attr({'disabled':false});
		$('.btn').attr({'disabled':true});
	}else{
		update(index);
	}
}

function update(index){
	var foodNumber = foodInfo[index].foodNumber;
	var foodUrl;
	if ($('.file').eq(index).val() == '') {
		foodUrl = foodInfo[index].foodImgUrl.substring(22);
	}else{
		foodUrl = $('.file').eq(index).val();
	}
	var foodName = $('.nameText').eq(index).val();
	var foodPrice = $('.priceText').eq(index).val();
	var foodType = $('.typeSelect').eq(index).val();
	var restaurantWindowNumber = $('.windowSelect').eq(index).val();
	if (foodName == '' || foodNumber == '') {
		alert('有未填写内容');
	}else{
		$.ajax({
			url: 'http://localhost:8080/updateFoodInfo?foodNumber='+foodNumber
				+'&restaurantWindowNumber='+restaurantWindowNumber
				+'&foodName='+foodName
				+'&foodPrice='+foodPrice
				+'&foodImgUrl='+foodUrl
				+'&foodType='+foodType,
			type: 'post',
			success: function(res) {
        	    //不可编辑的其他元素还原
				$('tr').eq(index+1).css('background', '#f3f3f2');
				$('.editOrSaveBtn').attr({'disabled':false});
				$('.delOrCancelBtn').attr({'disabled':false});
				$('.btn').attr({'disabled':false});
				//
				$('.file').eq(index).css({'display': 'none'});
				$('.nameText').eq(index).attr({'disabled':true});
				$('.priceText').eq(index).attr({'disabled':true});
				$('.typeSelect').eq(index).attr({'disabled':true});
				$('.windowSelect').eq(index).attr({'disabled':true});
				$('.editOrSaveBtn').eq(index).text('修改');
				$('.delOrCancelBtn').eq(index).text('删除');
				$('.img').eq(index).css('display', 'inline');
				alert("保存成功");
				window.location.reload();
        	},
		});
	}
}




