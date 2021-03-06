var blockA = '<tr class="item"><th class="columnA">';
var blockB = '</th><th class="columnB">';
var blockC = '</th></tr>';

window.onload=function(){
	$.ajax({
		url: 'http://localhost:8080/getSuggest',
		type: 'get',
		dataType: 'json',
		success: function(res) {
			$.each(res, function() {
				$('.items').append(blockA+this.date+blockB+this.text+blockC);
			});
		}
	})
	
}