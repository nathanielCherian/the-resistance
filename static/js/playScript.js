var list = $("#list");
$('#fin-team').hide();
$('#yay-vote').hide();
$('#nay-vote').hide();
$('.mission-card').hide();


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
    var listItem = $("<li class='list-item' id='" + plist[i] + "'>" + plist[i] + "</li>");
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



console.log(getroomID())
console.log(getName())


var teamlead = ""
var ptoPlay = 0
var role = ""

function updateLeader(teamleader){

	$('#fin-team').hide();
	$('#yay-vote').hide();
	$('#nay-vote').hide();

	$('.gun').remove();
	$('.team-vote').remove();

	$('li').css("pointer-events", "auto")
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

		if(msg.status == 'playData1'){ //initializing everything only happns on connect
			updateLeader(msg.team_leader)
			ptoPlay = msg.ptoPlay


			if(msg[getName()] == 'rebel'){
				role = 'rebel'
				$('#role-card').attr("src", "/static/assets/blue.png")
			}else{
				role = 'spy'
				$('#role-card').attr("src", "/static/assets/red.png")
				updateRoles(msg.roles) //change all spies to red
			}
		}


		if(msg.status == 'updateGun' && getName() != teamlead){

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

		if(msg.status == 'voteTeam'){
			$('#yay-vote').show()
			$('#nay-vote').show()
			$( "div.success" ).text("Vote on this team!")
			$( "div.success" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
		}

		if(msg.status == 'pteamvote'){
			updateTeamVote(msg.name,msg.vote);
		}

		if(msg.status == 'doneVoting'){ //displayes voting outcome to players
			if(msg.result == true){
				$( "div.success" ).text("Vote passed!")
				$( "div.success" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
			}else if(msg.result == false){
				$( "div.success" ).text("Vote failed!")
				$( "div.success" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
			}else{
				$( "div.success" ).text("Vote ties!")
				$( "div.success" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
			}
		}

		if(msg.status == 'rotateLeader'){ //changes who is leader
			updateLeader(msg.team_leader)
		}

		if(msg.status == 'collectMVotes'){ //makes mission buttons visable
			if(msg.players.includes(getName()) == true){
				if(role == 'spy'){
					$("#fail").fadeIn( 300 )
					$("#pass").fadeIn( 300 )
				}else if(role == 'rebel'){
					$('#fail').css("background-color","gray")
					$('#fail').css("opacity",".2")
					$('#fail').css("pointer-events", "none")
					$("#fail").fadeIn( 300 )
					$("#pass").fadeIn( 300 )
				}
			}
		}

    }

  })

  $(document).on("click",".mission-card", function(){ //returns click to server and fades out

	var vote = 0

	if($(this).attr('id') == 'pass'){
		vote = 0
	}else{
		vote = 1
	}

	socket.emit('my event', {
		roomid:getroomID(),
		status:'sendMVote',
		name:getName(),
		vote:vote
	})
	
	$('.mission-card').fadeOut( 400 );
  })

  function updateTeamVote(name,vote){ //displaying yay/nay votes and emiting when complete
	var img = document.createElement('img'); 
	img.style.width = '60px'
	img.style.height = '60px'
	img.className = "team-vote"
	
	  if(vote == true){
		img.src = "/static/assets/yay.png";
	  }else if(vote == false){
		img.src = "/static/assets/nay.png";
	  }
	  $('#'+ name).append(img)

	  if(teamlead == getName() && $('.team-vote').length == $('li').length){ //this means everyone has voted
		socket.emit('my event',{
			roomid:getroomID(),
			status:'doneVoting',
			name:getName()
		})
	  }
  }



  function updateRoles(roles){ //changes color of all the spies so they can see each other
	  
	  for(let key of Object.keys(roles)){
		  console.log(key)
		  if (roles[key] == 'spy'){
			$('#'+key).css('background-color','red')
		  }else{
			$('#'+key).css('background-color','aqua')
		  }

		}
  }


  function yayvote(){  // emit yay
	$('#yay-vote').hide()
	$('#nay-vote').hide()
	socket.emit('my event', {
		roomid:getroomID(),
		status:'pteamvote',
		vote:true,
		name:getName()
	})
  }

  function nayvote(){ //emit nay
	$('#yay-vote').hide()
	$('#nay-vote').hide()
	socket.emit('my event', {
		roomid:getroomID(),
		status:'pteamvote',
		vote:false,
		name:getName()
	})
  }

  $(document).on("click", "li", function(){ //displays guns and chosen players

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
		if(action != ""){socket.emit('my event', toSend)}

		if($('.gun').length == ptoPlay){
			$('#fin-team').show();
		}else{
			$('#fin-team').hide();
		}
	}
})

function finTeam(){
	$('#fin-team').hide()
	$('li').css("pointer-events", "none")

	var ponM = []
	$('.gun').each(function() {
		ponM.push($(this).parent().attr('id'))
	  });

	  socket.emit('my event', {
		roomid:getroomID(),
		status:'teamFinished',
		name:getName(),
		plOnM:ponM
	})


}