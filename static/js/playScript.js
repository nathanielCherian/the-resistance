var list = $("#list");

var updateLayout = function(listItems){
	for(var i = 0; i < listItems.length; i ++){
		var offsetAngle = 360 / listItems.length;
		var rotateAngle = offsetAngle * i;
		$(listItems[i]).css("transform", "rotate(" + rotateAngle + "deg) translate(0, 300px) rotate(-" + rotateAngle + "deg)")
	};
};

plist = getplist();
console.log(plist)

for(i=0; i<plist.length; i++){
    var listItem = $("<li class='list-item' id='" + plist[i] + "'>" + plist[i] + "<button class='remove-item'>Remove</button></li>");
	list.append(listItem);
	var listItems = $(".list-item");
    updateLayout(listItems);
    
}

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

console.log(getroomID())
console.log(getName())


var img = document.createElement('img'); 
img.src = "/static/assets/star.png";
img.style.width = '40px'
img.style.height = '40px'
document.getElementById('nathan').appendChild(img)


var socket = io.connect('http://192.168.1.12:5000/');

socket.on( 'connect', function() {
    socket.emit( 'my event', {
        roomid : getroomID(),
        status : 'connectToPlay',
        name : getName()
    }) 
})


socket.on( 'my response', function( msg ) {
    if (msg.roomid == getroomID()){
        console.log( msg )

    }

  })