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


var teamlead = ""
var ptoPlay = 0

function updateLeader(teamleader){
	$('#t-leader').remove()
	var img = document.createElement('img'); 
	img.src = "/static/assets/star.png";
	img.style.width = '40px'
	img.style.height = '40px'
	img.id = 't-leader'
	document.getElementById(teamleader).appendChild(img)
	if(teamleader == getName()){
		$( "div.success" ).text("You are the team leader, Choose a team!")
		$( "div.success" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
	}
	teamlead = teamleader
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
			ptoPlay = msg.ptoPlay


			if(msg[getName()] == 'rebel'){
				console.log('rebel')
				$('#role-card').attr("src", "/static/assets/blue.png")
			}else{
				console.log('spy')
				$('#role-card').attr("src", "/static/assets/red.png")
				updateRoles(msg.roles)
			}
		}

		if(msg.status == 'updateGun' && getName() != teamlead){
			console.log("made it")

			if(msg.action == 'add'){  //toggle ON
				console.log("add")

					var img = document.createElement('img'); 
					img.src = "/static/assets/gun.png";
					img.style.width = '100px'
					img.style.height = '60px'
					img.className = "gun"
					
					$('#'+ msg.name).append(img)
				}else if(msg.action == 'remove'){ //toggle OFF
					console.log("remove")
					$('#'+ msg.name).find('.gun').remove()
				}
	
		}



    }

  })

  function updateRoles(roles){
	  
	  for(let key of Object.keys(roles)){
		  console.log(key)
		  if (roles[key] == 'spy'){
			$('#'+key).css('background-color','red')
		  }else{
			$('#'+key).css('background-color','aqua')
		  }

		}
  }


  $(document).on("click", "li", function(){

	if(teamlead == getName()){

		var action = ""

		if($(this).find('.gun').length == 0){  //toggle ON
			
			if($('.gun').length < ptoPlay){ //only add if there is room
				var img = document.createElement('img'); 
				img.src = "/static/assets/gun.png";
				img.style.width = '100px'
				img.style.height = '60px'
				img.className = "gun"
				$(this).append(img)
				action = "add"
			}
			}else if($(this).find('.gun').length == 1){ //toggle OFF
				console.log("remove")
				$(this).find('.gun').remove()
				action = "remove"
			}

		
		toSend = {
			roomid:getroomID(),
			status:'updateGun',
			name:$(this).attr('id'),
			action:action
		}
		socket.emit('my event', toSend)
	}
})

