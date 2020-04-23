////////////////////////////// ONE PLAYER Blackjack///////////////////////////////////

// Variables
let blackjackGame = {
    'you': {'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0},
    'dealer': {'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0},
    'cards': ['2','3','4','5','6','7','8','9','10','K','J','Q','A'],  //THIS is an array that you need to randomly pick from
    'cardsMap': {'2': 2,'3': 3,'4': 4,'5': 5,'6': 6,'7': 7,'8': 8,'9': 9,'10': 10,'K': 10,'J': 10,'Q':10,'A': [1, 11]}, //a value is mapped to each card
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,  //Whether the STAND mode has been activated or not
    'turnsOver': false, //The HIT and STAND cycles are complete all turns over and now you can hit deal
};

// Constaints
const YOU = blackjackGame['you']
const DEALER = blackjackGame['dealer']
// Constaints Souds
const hitSound = new Audio('static/sounds/swish.m4a');
const winSound = new Audio('static/sounds/cash.mp3');
const lossSound = new Audio('static/sounds/aww.mp3');

// add event listeners
document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);
document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);
document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);


// BUTTON FUNCTIONALITY

//Hit Button
function blackjackHit() {
	if (blackjackGame['isStand'] === false) {
		let card = randomCard();
		showCard(card, YOU);
		updateScore(card, YOU);
		showScore(YOU);
	}
}


function randomCard() {
	let randomIndex = Math.floor(Math.random() * 13);
	return blackjackGame['cards'][randomIndex];
	}


function showCard(card, activePlayer) {
	if (activePlayer['score'] <= 21) {
		let cardImage = document.createElement('img');
		cardImage.src = `static/images/${card}.png`;
		document.querySelector(activePlayer['div']).appendChild(cardImage);
		hitSound.play();
	}
}


//DEAL function
function blackjackDeal() {
	if (blackjackGame['turnsOver'] === true) {

		//once DEAL is hit, STAND becomes disabled
		blackjackGame['isStand'] = false;

		//You and Dealer both get a turn
		let yourImages = document.querySelector('#your-box').querySelectorAll('img');
		let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');

		//NOW iterate through the card images
		for (i=0; i < yourImages.length; i++) {
			yourImages[i].remove();

		}

		for (i=0; i < dealerImages.length; i++) {
			dealerImages[i].remove();

		}


		//sets score back to zero after each game
		YOU['score'] = 0;
		DEALER['score'] = 0;



		//BELOW is content and color for the player score

		//YOU
        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#your-blackjack-result').style.color = 'azure'; //If you Bust it will change the zero back to white

        //DEALER
        document.querySelector('#dealer-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').style.color = 'azure';

        //RESET GAME STATUS
        document.querySelector('#blackjack-result').textContent = "Let's Play";
        document.querySelector('#blackjack-result').style.color = 'azure';

        //Turns over deactivated
        blackjackGame['turnsOver'] = false; //Kills DEAL while HIT and STAND are active


	}
}


function updateScore(card, activePlayer) {
    if (card === 'A') {
        //for ACE CARD that can be 1 or 11 | If adding 11 keeps me below 21, add 11. Otherwise, add 1
        if (activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21) {
            activePlayer['score'] += blackjackGame['cardsMap'][card][1];
        } else {
            activePlayer['score'] += blackjackGame['cardsMap'][card][0];
        }

    } else {
        //If card isn't ACE in the first place, just increment it
    activePlayer['score'] += blackjackGame['cardsMap'][card];
    }
}


//SHOW SCORE FUNCTION
function showScore(activePlayer) {
    if (activePlayer['score'] > 21) { //Bust Logic if over 21 it will now say BUST! in red
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'FireBrick';
    } else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}




////////////THE BOT////////////////

//BOT TIME
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms)); 
}


//DEALER | BOT logic
async function dealerLogic() {
	blackjackGame['isStand'] = true; //STAND has now been activated after pressed

	//while Dealer score is 15 or below, the stand button is active
	while (DEALER['score'] < 16 && blackjackGame['isStand'] === true) { 
		let card = randomCard();
		showCard(card, DEALER);
		updateScore(card, DEALER);
		showScore(DEALER);
		await sleep(1000); //await BOT timing
	}

	blackjackGame['turnsOver'] = true;
	let winner = computeWinner();
	showResult(winner);
}


//Determine a WIN
//Update the wins, draws, and losses
function computeWinner(){
	let winner;

	if (YOU['score'] <= 21) {


		//condition: higher score than dealer or when dealer busts but you're 21 or under
        if (YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)) {
            blackjackGame['wins']++; //increment the WINS
            winner = YOU;

        } else if (YOU['score'] < DEALER['score']) {
            blackjackGame['losses']++; //increment the LOSSES
            winner = DEALER;

        } else if (YOU['score'] === DEALER['score'] ) {
            blackjackGame['draws']++; //increment the DRAWS
        }

     //condition: when user busts but dealer doesn't
	} else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
		blackjackGame['losses'] ++; //increment the LOSSES
		winner = DEALER;

	//condition: when you AND the dealer busts
	} else if (YOU['score'] > 21 && DEALER['score'] > 21) {
		blackjackGame['draws'] ++; //increment the DRAWS
	}

	return winner;
}



//Show Winner
function showResult(winner) {
    let message, messageColor;

    //Check if ALL turns are over before running the results
    if (blackjackGame['turnsOver'] === true) {
    

        if (winner === YOU) {
            document.querySelector('#wins').textContent = blackjackGame['wins'];
            message = 'You won!';
            messageColor = 'Chartreuse'
            winSound.play();

        } else if (winner === DEALER) {
            document.querySelector('#losses').textContent = blackjackGame['losses'];
            message = 'You lost!';
            messageColor = 'red';
            lossSound.play();

        } else {
            document.querySelector('#draws').textContent = blackjackGame['draws'];
            message = 'You drew!';
            messageColor = 'Orange'
        }


        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
    }
}




//RESET GAME STATUS
function newGame() {
        document.querySelector('#blackjack-result').textContent = "Let's Play";
        document.querySelector('#blackjack-result').style.color = 'azure';
  
}


