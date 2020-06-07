var list = $("#list");
$('#fin-team').hide();
$('#yay-vote').hide();
$('#nay-vote').hide();
$('.mission-card').hide();
$('#vote-counter').hide();
$('.overlay-desc').hide();

var height =  $(window).height()/3

var updateLayout = function(listItems){
	for(var i = 0; i < listItems.length; i ++){
		var offsetAngle = 360 / listItems.length;
        var rotateAngle = offsetAngle * i;
		$(listItems[i]).css("transform", "rotate(" + rotateAngle + "deg) translate(0, " + height + "px) rotate(-" + rotateAngle + "deg)")
    };
    //console.log($('ul#players li').length)
};

plist = getplist();
console.log(plist)

for(i=0; i<plist.length; i++){
    var listItem = $("<li class='list-item' id='" + plist[i] + "'>" + "<p style= 'margin-top: -25px;'>" +  plist[i] + "</p></li>");
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
	$('#vote-counter').hide();

	$('.gun').remove();
	$('.team-vote').remove();

	$('li').css("pointer-events", "auto")
	$('#t-leader').remove()

	$('#teamvotes button').css("pointer-events", "auto")
	$('#missionvotes button').css("pointer-events", "auto")


	
	var img = document.createElement('img'); 
	img.src = "/static/assets/star.png";
	img.style.width = '50px'
	img.style.height = '50px'
	img.id = 't-leader'
	document.getElementById(teamleader).appendChild(img)
	if(teamleader == getName()){
		$( "div.success" ).text("You are the team leader, Choose a team!")
		$( "div.success" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );

		$('#vleft').text(ptoPlay - $('.gun').length)
		$('#vote-counter').fadeIn(100);
	}
	teamlead = teamleader


}

var socket = io.connect(window.location.origin);

socket.on( 'connect', function() {
	if(performance.navigation.type != 1){
		socket.emit( 'my event', {
			roomid : getroomID(),
			status : 'connectToPlay',
			name : getName()
		}) 
	} else{
		socket.emit('my event', {
			roomid : getroomID(),
			status : 'reloaded',
			name : getName()
		})
	}
	
})

var messaage  = {}
socket.on( 'my response', function( msg ) {
    if (msg.roomid == getroomID()){
        console.log( msg )

		if(msg.status == 'playData1'){ //initializing everything only happns on connect
			ptoPlay = msg.ptoPlay
			updateLeader(msg.team_leader)


			if(msg[getName()] == 'rebel'){
				role = 'rebel'
				$('#role-card').attr("src", "/static/assets/blue.png")
				document.body.style.backgroundImage = "linear-gradient(rgba(224, 224, 224, 0),rgba(0, 47, 255, 0.2) ), url('static/assets/opac2.png')";
			}else{
				role = 'spy'
				$('#role-card').attr("src", "/static/assets/red.png")
				updateRoles(msg.roles) //change all spies to red
				document.body.style.backgroundImage = "linear-gradient(rgba(224, 224, 224, 0),	rgb(255, 0, 0, 0.2) ), url('static/assets/opac2.png')";
			}

			for(i = 0; i < msg.gameData.length; i++){ //setting up the mission bubbles
				//console.log($($('#mss').find('li')[i]).text())
				$($('#mss').find('li')[i]).text(msg.gameData[i]);
			}

			//msg.twoFails = true
			if(msg.twoFails == true){
				$($('#mss').find('li')[3]).append('<p style="font-size: 15px;">*2 fails</p>');
			}

		}

		if(msg.status == 'catchUp'){
			ptoPlay = msg.ptoPlay
			updateLeader(msg.team_leader)

			if(msg[getName()] == 'rebel'){
				role = 'rebel'
				$('#role-card').attr("src", "/static/assets/blue.png")
				document.body.style.backgroundImage = "linear-gradient(rgba(224, 224, 224, 0),rgba(0, 47, 255, 0.2) ), url('static/assets/opac2.png')";
			}else{
				role = 'spy'
				$('#role-card').attr("src", "/static/assets/red.png")
				updateRoles(msg.roles) //change all spies to red
				document.body.style.backgroundImage = "linear-gradient(rgba(224, 224, 224, 0),	rgb(255, 0, 0, 0.2) ), url('static/assets/opac2.png')";
			}

			for(i = 0; i < msg.gameData.length; i++){ //setting up the mission bubbles
				$($('#mss').find('li')[i]).text(msg.gameData[i]);
			}
			if(msg.twoFails == true){
				$($('#mss').find('li')[3]).append('<p style="font-size: 15px;">*2 fails</p>');
			}

			for(var i = 0; i < msg.pastMissions.length; i++){
				if(msg.pastMissions[i] == true){
					$($('#mss').find('li')[i]).css("background", "radial-gradient(100px 100px, rgb(0, 53, 199), #000)");
			
				}else{
					$($('#mss').find('li')[i]).css("background", "radial-gradient(100px 100px, rgb(207, 0, 0), #000)");
				}
			}

			if(msg.team_leader == getName()){ //if team leader reloaded page destroy all guns everywhere
				socket.emit('my event', {roomid:getroomID(),status:'dORa',code:'destroy'}) //dORa = delete or add
			}else{
				socket.emit('my event', {roomid:getroomID(),status:'dORa',code:'add', name:getName(), pto:msg.pto}) //dORa = delete or add
			}

			if(msg.resumeVote == 'missionvote'){
				$('#teamvotes').fadeIn(1000);
				$('#teamvotes button').css("pointer-events", "auto")

			}else if(msg.resumeVote == 'playvote'){
				$('.mission-card').show();
				$('#missionvotes button').css("pointer-events", "auto")
				if(role == 'spy'){
					$('#missionvotes').fadeIn(1000)
					//$("#fail").fadeIn( 300 )
					//$("#pass").fadeIn( 300 )
				}else if(role == 'rebel'){
					$('#fail').css("background-color","gray")
					$('#fail').css("opacity",".2")
					$('#fail').css("pointer-events", "none")
					//$("#fail").fadeIn( 300 )
					//$("#pass").fadeIn( 300 )
					$('#missionvotes').fadeIn(1000)
				}
			}

		}

		if(msg.status == 'dORa'){
			if(msg.code == 'destroy'){
				$('.gun').remove()

			}else if(teamlead == getName()){ //code is add and player is leader
				var ponM = []
				$('.gun').each(function() {
					ponM.push($(this).parent().attr('id'))
				  });

				  socket.emit('my event',{status:'RdORa',roomid:getroomID(),pwithGun:ponM, pto:msg.pto})

			}
		}

		if(msg.status == 'RdORa' && getName() != teamlead && getName() == msg.pto){ //basically just updating guns
			for(var i = 0; i < msg.pwithGun.length; i++){
				
				var img = document.createElement('img'); 
				img.src = "/static/assets/gun.png";
				img.style.width = '100px'
				img.style.height = '60px'
				img.className = "gun"
				
				$('#'+ msg.pwithGun[i]).append(img)
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
			$('#teamvotes').fadeIn(1000);
			//$('#yay-vote').show()
			//$('#nay-vote').show()
			//$( "div.success" ).text("Vote on this team!")
			//$( "div.success" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
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
				$('.mission-card').show();
				if(role == 'spy'){
					$('#missionvotes').fadeIn(1000)
					//$("#fail").fadeIn( 300 )
					//$("#pass").fadeIn( 300 )
				}else if(role == 'rebel'){
					$('#fail').css("background-color","gray")
					$('#fail').css("opacity",".2")
					$('#fail').css("pointer-events", "none")
					//$("#fail").fadeIn( 300 )
					//$("#pass").fadeIn( 300 )
					$('#missionvotes').fadeIn(1000)
				}
			}
		}

		if(msg.status == 'missionOutcome'){
		
			$('.pcards').remove();
			//$("#revealmvotes").css('background-image', "" )
			//$("#revealmvotes").css('background-image', "linear-gradient(rgba(224, 224, 224, 0.63), rgba(255, 0, 0, 0.63))" )


			x = ""
			for(i = 0; i < msg.results.length; i++){
				if(msg.results[i] == 0){
					x = 'pass'
				}else{
					x = 'fail'
				}
				console.log(x)
				$("#revealmvotes").append("<img src='/static/assets/" + x + ".png' style='margin: 10px;' class='pcards'></img>")
			}

			$("#revealmvotes").fadeIn(1000)

			if(msg.outcome == true){
				$("#revealmvotes").css('background-image', "linear-gradient(rgba(224, 224, 224, 0.63), rgba(0, 47, 255, 0.5))" )
				//print("log")
			}else{
				$("#revealmvotes").css('background-image', "linear-gradient(rgba(224, 224, 224, 0.63), rgba(255, 0, 0, 0.63))" )
				//print("log")
			}

			messaage = msg
		}

		if(msg.status == 'gameOver'){
			$('#fin-team').hide();
			$('#yay-vote').hide();
			$('#nay-vote').hide();
			$('#vote-counter').hide();
			$('.gun').remove();
			$('.team-vote').remove();
			$('li').css("pointer-events", "auto")
			$('#t-leader').remove()  //clear the screen + stop any further play
			teamlead = ""
			updateRoles(msg.roles) //show everyone who the spies are
			if(msg.winner == 'rebel'){
				$( "div.success" ).text("Resistance wins the game!")
				$( "div.success" ).fadeIn( 300 );
				document.body.style.backgroundImage = "linear-gradient(rgba(224, 224, 224, 0),rgba(0, 47, 255, 0.5) ), url('static/assets/opac2.png')";
			}else{
				$( "div.success" ).text("Spies wins the game!")
				$( "div.success" ).fadeIn( 300 );
				document.body.style.backgroundImage = "linear-gradient(rgba(224, 224, 224, 0),	rgb(255, 0, 0, 0.5) ), url('static/assets/opac2.png')";

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

	$('#missionvotes button').css("pointer-events", "none")
	$('#missionvotes').fadeOut(1000)
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

	  console.log($('#list li').length)
	  if(teamlead == getName() && $('.team-vote').length == $('#list li').length){ //this means everyone has voted
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
			$('#'+key).css('background','radial-gradient(100px 100px, rgb(207, 0, 0), #000)')
		  }else{
			$('#'+key).css('background','radial-gradient(100px 100px, rgb(0, 53, 199), #000)')
		  }

		}
  }


  function yayvote(){  // emit yay
	$('#teamvotes').fadeOut(1000)
	$('#teamvotes button').css("pointer-events", "none")
	socket.emit('my event', {
		roomid:getroomID(),
		status:'pteamvote',
		vote:true,
		name:getName()
	})
  }

  function nayvote(){ //emit nay
	$('#teamvotes').fadeOut(1000)
	$('#teamvotes button').css("pointer-events", "none")
	socket.emit('my event', {
		roomid:getroomID(),
		status:'pteamvote',
		vote:false,
		name:getName()
	})
  }

  $(document).on("click", "#list li", function(){ //displays guns and chosen players

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
			$('#vote-counter').fadeOut(200);
			$('#fin-team').delay(500).fadeIn(200);
		}else{
			$('#fin-team').fadeOut(200);
			$('#vleft').text(ptoPlay - $('.gun').length)
			$('#vote-counter').delay(500).fadeIn(200);
		}

		
		/*
		if($('.gun').length < ptoPlay){ //set up the counter
			console.log($('.gun').length)
			$('#vleft').text(ptoPlay - $('.gun').length)
			$('#vote-counter').fadeIn(100);
		}else{
			$('#vote-counter').fadeOut(100);
		}*/
	}
})

function finTeam(){
	$('#fin-team').fadeOut(200)
	$('#list li').css("pointer-events", "none")

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


function closeRMV(){
	msg = messaage

	$("#revealmvotes").fadeOut(1000)

	
	if(msg.outcome == true){
		$( "div.success" ).text("Resistance wins the round!")
		$( "div.success" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
		$($('#mss').find('li')[msg.lastMission]).css("background", "radial-gradient(100px 100px, rgb(0, 53, 199), #000)");

	}else{
		$( "div.success" ).text("Spies wins the round!")
		$( "div.success" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
		$($('#mss').find('li')[msg.lastMission]).css("background", "radial-gradient(100px 100px, rgb(207, 0, 0), #000)");
	}
	ptoPlay = msg.ptoPlay
	updateLeader(msg.team_leader)
}


$(window).resize(function() {
    height = $(window).height()/3
    console.log(height)
    var listItems = $(".list-item");
    updateLayout(listItems)
  });