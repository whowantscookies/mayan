$(function(j) {
	
	var the_answer = 0;

	j("input.count").click(function() {
		j("div.answer").empty(); //Remove previous selections
		RANGE_MAX = j(this).attr('value');
		start_base = 0; //where range of given selection should being
		
		switch( RANGE_MAX ) {
			case 2:
				start_base = 10;
				break;
			case 3:
				start_base = 100;
				break;
			case 4:
				start_base = 1000;
				break;
			case 5:
				start_base = 10000;
				break;
			default:
				start_base = 10;
				break;
		}

		the_answer = getRandomArbitary(start_base, Math.pow(10, RANGE_MAX));
		j("#answer").html("Your number: <b>" + the_answer + "</b>");

		/*for(d=0; d<RANGE_MAX; d++) {
			j("div#baselevel-" + d).css('display','block');
		}*/
	});
	
	j("a#reset-answers").click(function() {
		j("div.answer").empty();
	});
	
	j( "#drag-blocks li" ).draggable({
	  appendTo: "body",
	  helper: "clone",
	  cursor: "move",
	  opacity: 0.5
	});

	j( ".droppable" ).droppable({
		activeClass: "ui-state-default",
		hoverClass: "ui-state-hover",
		accept: ":not(.ui-sortable-helper)",
		drop: function( event, ui ) {
			
			if ( ui.draggable.attr('value') == 1 ) {
				j( "<span></span>" ).html( ui.draggable.html() ).appendTo( this );
			} else {
				j( "<div></div>" ).html( ui.draggable.html() ).appendTo( this );
			}
			checkOverload( ui.draggable.attr('value') );
			j( this ).removeClass( "ui-state-default" );
			//alert(tally);
		}
	});
	
	function checkOverload( dragId ) {
		//Count total number of child elements in it.
		onesTotal = 0;
		onesLimit = 4;
		fivesTotal = 0;
		fivesLimit = 3;
		zeroTotal = 0;
		zeroLimit = 1;
		error = "";

		j("div.answer").each(function( idx ) {
			currentId = j(this).attr('id');
			onesTotal = j("#" + currentId).children().find("img.imgone").length;
			fivesTotal = j("#" + currentId).children().find("img.imgfive").length;
			zeroTotal = j("#" + currentId).children().find("img.imgzero").length;

			
			if (onesTotal > onesLimit) {
				error = "You exceeded the limit of ones for this box";
			} else if (fivesTotal > fivesLimit) {
				error = "You exceeded the limit of fives for this box";
			} else if (zeroTotal > zeroLimit) {
				error = "You exceeded the limit of zeros for this box";
			}

			//Clam can be only item in a given answer box
			if (zeroTotal > 0) {
				if (onesTotal || fivesTotal) {
					error = "Zero holder is only item allowed in a given box";	
				}
			}
			
			if (error.length) {
				j(this).addClass('red-outline').after("<p id=\"errormsg\">" + error + "</p>");
				j("p#errormsg").fadeOut(3500, function() {
					j("#" + currentId).removeClass('red-outline');
					j(this).remove();
				});
				j("#" + currentId + " img").filter(":last").remove();
				return false;
			}
			
			//alert("Box: " + currentId + ", One:" + onesTotal + " , Five:" + fivesTotal + " , Zero:" + zeroTotal);
		});
	}
	
	j("#tally").click(function() {
		var arAnswers = Array(1);
		count = 0; //
		j("div.answer").each(function( idx ) {
			currentId = j(this).attr('id');
			ones = 0;
			fives = 0;
			zero = 0;

			if ( j("#" + currentId).children().length > 0 ) {
				ones = j("#" + currentId).children().find("img.imgone").length * 1;
				fives = j("#" + currentId).children().find("img.imgfive").length * 5;
				zero = j("#" + currentId).children().find("img.imgzero").length * 0;
				arAnswers[count] = ones + fives + zero; //Tally box value

				count++;
			}
		});
		
		//Reverse array and tally value
		arAnswers.reverse();

		base20counter = 1; //First pass is always x1, then ^20 each iteration
		counter = 0;
		totalScore = 0;
		for( a=0; a<arAnswers.length; a++) {
			if (counter > 0) {
				base20counter *= 20;
			} else {
				base20counter = 1;	
			}
			
			totalScore += arAnswers[a] * base20counter;
			counter++;
		}
		
		j("div#user-answer").html("Your answer: <b>" + totalScore + "</b>");
		controlAnswer = the_answer;
		responseAnswer = totalScore;

		if (responseAnswer == controlAnswer ) {
			j("div#user-answer-message").addClass('text-success').removeClass('text-danger').html("Correct!");
		} else {
			j("div#user-answer-message").addClass('text-danger').removeClass('text-success').html("Incorrect! Your answer is " + responseAnswer + ".");
		}

		
		arAnswers.length = 0; //reset array for numbe changes
	});
});

function getRandomArbitary(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}