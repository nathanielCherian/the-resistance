var list = $("#list");

var updateLayout = function(listItems){
	for(var i = 0; i < listItems.length; i ++){
		var offsetAngle = 360 / listItems.length;
		var rotateAngle = offsetAngle * i;
		$(listItems[i]).css("transform", "rotate(" + rotateAngle + "deg) translate(0, 300px) rotate(-" + rotateAngle + "deg)")
	};
};

$(document).on("click", "#add-item", function(){
	var listItem = $("<li class='list-item'>Things go here<button class='remove-item'>Remove</button></li>");
	list.append(listItem);
	var listItems = $(".list-item");
	updateLayout(listItems);

});

$(document).on("click", ".remove-item", function(){
	$(this).parent().remove();
	var listItems = $(".list-item");
	updateLayout(listItems);
});

