var list = $("#players");
var height =  screen.height/3
//if(height > 300){height = 300}

var updateLayout = function(listItems){
	for(var i = 0; i < listItems.length; i ++){
		var offsetAngle = 360 / listItems.length;
        var rotateAngle = offsetAngle * i;
		$(listItems[i]).css("transform", "rotate(" + rotateAngle + "deg) translate(0, " + height + "px) rotate(-" + rotateAngle + "deg)")
    };
    //console.log($('ul#players li').length)
};


function addPlayers(plist){
    
    while (($('ul#players li').length-1) < plist.length-1){

        var listItem = $("<li class='list-item' id='" + plist[($('ul#players li').length)] + "'>" + plist[($('ul#players li').length)] + "</li>");
        list.append(listItem);
        var listItems = $(".list-item");
        updateLayout(listItems);
    }

}

function removePlayer(name){
    $("#" + name).remove();
    var listItems = $(".list-item");
	updateLayout(listItems);
}

$(document).on("click", "#add-item", function(){
	var listItem = $("<li class='list-item'>Things go here<button class='remove-item'>Remove</button></li>");
	list.append(listItem);
	var listItems = $(".list-item");
	updateLayout(listItems);
});


$(window).resize(function() {
    height = $(this).height()/3
    console.log(height)
    var listItems = $(".list-item");
    updateLayout(listItems)
  });