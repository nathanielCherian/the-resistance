var list = $("#players");
var height =  $(window).height()/3
//if(height > 300){height = 300}

$('h2').hide()

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


function copyCode(){

    var textarea = document.createElement('textarea')
    textarea.value = $('h1').text()
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)

    $('h2').fadeIn( 500 ).delay( 1500 ).fadeOut( 400 );
}

$(window).resize(function() {
    height = $(this).height()/3
    console.log(height)
    var listItems = $(".list-item");
    updateLayout(listItems)
  });