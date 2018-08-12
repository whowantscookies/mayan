$(function() {
	var errmes=''; //Input error message
	
	$("#docalc").click(function() {
		num = $("#number").val();
		
		validateEntry(num);
		if (errmes!='') {
			alert (errmes);
			return false;	
		}

		mayannum(num);
	});

	function validateEntry(num) {
	
		if (num != parseInt(num)) {
			errmes = 'You have entered ' + num + '\nPlease enter an integer (no decimal points)'
		} else if (num < 0) {
			errmes = 'You have entered ' + num + '\nPlease enter a positive number'
		} else if (num > 999999) {
			errmes = 'You have entered ' + num + '\nPlease enter a number less than 1,000,000'
		} else {
			errmes = '';  
		}
		
		return errmes;
	}

	function mayannum(num) {

		result = new Array();
		wnum = num;
		//Each successive iteration is a factor of 20 higher, which creates a 'stacking' effect on the result
		counter = 0;
		base20counter = 1; //First pass is always x1, up to 20
		rowCount = 0; //Tally each pass's value for adding
		lit = "";
		
		while (wnum > 0) { 
			work = wnum % 20; //Each base-20 value for that given iteration (x1, x20, x400, etc)
			wnum = parseInt(wnum / 20);
			dots_per = work % 5; //Dots per iteration
			lines_per = parseInt(work / 5); //Lines per iteration

			if (dots_per==0 && lines_per==0) {
				lit = '<img src="img/shell.gif">';
			} else {
				lit = '';
				bl = 3 - lines_per;

				if (dots_per == 0) {
					bl++;
				}
				for (i = 1; i <= bl; i++) {
					lit += '<img src="img/sp.gif"><br>';
				}
				for (i = 1; i <= dots_per; i++) { //Dot = 1
					lit+= '<img src="img/dot.gif">';
				}
				if (dots_per > 0) {
					lit += '<br>';
				}
				for (i = 1; i <= lines_per; i++) { //Line = 5
					lit += '<img src="img/line.gif"><br>';
				}
			} //end if
			
			if (counter > 0) {
				base20counter *= 20;
			} else {
				base20counter = 1;	
			}
			
			rowCount = work * base20counter;
			
			result[counter] = '<div class="stack-level" style="width:250px; border:1px solid #000;"><div style="float:left; width:100px;">' + lit + '</div><div style="float:right; width:150px; text-align:right;">' + work + ' * (' + base20counter + ') = ' + rowCount + '</div><br clear="all"></div>';
			
			//result += '<div class="stack-level"><img src="img/sp.gif"><br><img src="img/sp.gif">' + lit + '</div>';
			
			counter++;
		} //end while
		if ( num==0 ) { //If a user enters zero
			result[counter] = '<div class="stack-level"><img src="img/shell.gif"></div>';
		}

		result.reverse(); //Reverse array so it is right-side up
		result = result.join(" "); //Create list for output
		
		$("#outp").html(result);
	
	}

	$("input.count").click(function() {
		$("div.answer").empty(); //Remove previous selections
		RANGE_MAX = $(this).attr('value');
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

		var the_answer = getRandomArbitary(start_base, Math.pow(10, RANGE_MAX));
		$("#answer").text(the_answer);

		/*for(d=0; d<RANGE_MAX; d++) {
			$("div#baselevel-" + d).css('display','block');
		}*/
	});
	
	$("a#reset-answers").click(function() {
		$("div.answer").empty();
	});

});

function getRandomArbitary(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}