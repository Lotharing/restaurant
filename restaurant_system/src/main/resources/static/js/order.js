var blockA = '<tr class="item"><th class="columnA">';
var blockB = '</th><th class="columnB">';
var blockC = '</th><th class="columnC">';
var blockD = '</th><th class="columnD">';
var blockE = '</th><th class="columnE">';
var blockF = '</th><th class="columnF">';
var blockG = '</th><th class="columnG">';
var blockH = '</th></tr>';

window.onload=function(){
	$.ajax({
		url: 'http://localhost:8080/getAllOrder',
		type: 'get',
		dataType: 'json',
		success: function(res) {
			$.each(res, function() {
				$('.items').append(blockA+this.openid+blockB+this.name+blockC+this.foodNumber+blockD+this.foodName+blockE+this.price+blockF+this.date+blockG+this.windowNum+blockH);
			});
		}
	})
	
}