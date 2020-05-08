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


function updateLeader(teamleader){
	$('#t-leader').remove()
	var img = document.createElement('img'); 
	img.src = "/static/assets/star.png";
	img.style.width = '40px'
	img.style.height = '40px'
	img.id = 't-leader'
	document.getElementById(teamleader).appendChild(img)
}

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

		if(msg.status == 'playData1'){
			updateLeader(msg.team_leader)

			if(msg[getName()] == 'rebel'){
				console.log('rebel')
				$('#role-card').attr("src", "/static/assets/blue.png")
			}else{
				console.log('spy')
				$('#role-card').attr("src", "/static/assets/red.png")
			}
		}


    }

  })