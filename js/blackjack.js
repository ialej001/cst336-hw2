// VARIABLES
var startingMoney = 500;
var drawPile = [];
var dealerHand = [];
var playerHand = [];
var stackSize = 51;
var playerBet = 20;

// LISTENERS
window.onload = startGame();


// FUNCTIONS
function createDeck() {
    var suits = ["C", "D", "H", "S"];
    var index = 0;
    for (var suit of suits) {
        for (var k=1; k < 14; k++) {
            if (k==1) {
                drawPile[index] = "A" + suit;
            } else if (k==10) {
                drawPile[index] = "T" + suit;
            } else if (k==11) {
                drawPile[index] = "J" + suit;
            } else if (k==12) {
                drawPile[index] = "Q" + suit;
            } else if (k==13) {
                drawPile[index] = "K" + suit;
            } else {
                drawPile[index] = k + suit;
            }
            
            index++;
        }
    }
}

function shuffleDeck() {
    var randomInt;
    var temp;
    for (var i=0; i < drawPile.length; i++) {
        randomInt = Math.floor(Math.random() * drawPile.length);
        temp = drawPile[i];
        drawPile[i] = drawPile[randomInt];
        drawPile[randomInt] = temp;
    }
}

function showDeck() {
    for (var i=0; i < drawPile.length; i++) {
        console.log(drawPile[i])
    }
}

function startGame() {
    createDeck();
    shuffleDeck();
    deal();
}

function deal() {
    dealerHand[0] = drawPile[stackSize];
    stackSize--;
    playerHand[0] = drawPile[stackSize];
    stackSize--;
    dealerHand[1] = drawPile[stackSize];
    stackSize--;
    playerHand[1] = drawPile[stackSize];
    stackSize--; 
    
    $('#dealerShown').attr("src", "img/" + dealerHand[0] + ".gif");
    $('#playerHand').append('<img src="img/' + playerHand[0] + '.gif">');
    $('#playerHand').append('<img src="img/' + playerHand[1] + '.gif">');
    $("#money").html("$" + startingMoney);
}

function draw(player) {
    player.push(drawPile[stackSize])
    stackSize--;
}

function checkScore(hand) {
    var score = 0;
    for (var card of hand) {
        if (card[0] == "A" && playerHand.length <= 3) {
            score += 11;
        } else if (card[0] == "A") {
            score += 1;
        } else if (card[0] == "J") {
            score += 10;
        } else if (card[0] == "Q") {
            score += 10;
        } else if (card[0] == "K") {
            score += 10;
        } else if (card[0] == "T") {
            score += 10;
        } else {
            score += Number(card[0]);
        }
    }
    return score;
}

function dealerPlay() {
    // checks for player blackjack, then dealer blackjack.
    // if none occurs, dealer plays until score reaches 17 or higher
    // player with higher score wins round.
    var playerScore = 0;
    var dealerScore = 0;
    
    // reveal second dealer card
    $('#dealerReveal').attr("src", "img/" + dealerHand[1] + ".gif");
    
    if (blackjack(playerHand)) {
        $('#player').html("<h4>You<br>Win!</h4>");
        startingMoney += Number(playerBet);
    } else if (blackjack(dealerHand)) {
        $('#player').html("<h4>Dealer<br>Wins!</h4>");
        startingMoney -= Number(playerBet);
    }
    
    // tally player score
    playerScore = checkScore(playerHand);
    
    console.log(playerScore);
    
    // dealer plays
    while (dealerScore <= 21) {
        draw(dealerHand);
        $('#dealer').append('<img src="img/' + dealerHand[(dealerHand.length -1)] + '.gif">');
        dealerScore = checkScore(dealerHand);    
    }
    
    console.log(dealerScore);
    
    if (playerScore > 21) {
        $('#player').html("<h4>Bust!</h4>");
        startingMoney -= Number(playerBet);
    } else {
        dealerScore = checkScore(dealerHand);
        if (dealerScore > 21) {
            $('#player').html("<h4>You<br>Win!</h4>");
            startingMoney += Number(playerBet);
        } else if (dealerScore > playerScore) {
            $('#player').html("<h4>Dealer<br>Wins!</h4>");
            startingMoney -= Number(playerBet);
        } else if (dealerScore == playerScore) {
            $('#player').html("<h4>TIE!</h4>");
        } else {
            $('#player').html("<h4>You<br>Win!</h4>");
            startingMoney += Number(playerBet);
        }
    }
    
    $('#money').html("$" + startingMoney);
}

function blackjack(hand) {
    // blackjack is when either player has two cards totaling to 21.
    var firstCard = hand[0];
    var secondCard = hand[1];
    
    if (firstCard[0] == "A") {
        console.log(firstCard[0])
        if (secondCard[0] == "J") {
            return true;
        } else if (secondCard[0] == "Q") {
            return true;
        } else if (secondCard[0] == "K") {
            return true;
        } else {
            return false;
        }
    } else if (secondCard[0] == "A") {
        if (firstCard[0] == "J") {
            return true;
        } else if (firstCard[0] == "Q") {
            return true;
        } else if (firstCard[0] == "K") {
            return true;
        } else {
            return false;
        }
    }
}


// HANDLERS
$('#drawBtn').on("click", function() {
    draw(playerHand);
    $('#playerHand').append('<img src="img/' + playerHand[(playerHand.length - 1)] + '.gif">');
});

$('#endRound').on("click", function() {
    dealerPlay();
});

$('#betBtn').on("click", function() {
    playerBet = $('#betAmount').val();
    $('#currentBet').html("$" + playerBet);
    
    // lose condition if player runs out of money
    if (startingMoney < 0) {
        $('#player').html("<h4>You've lost<br>all your money!<br><br>Good bye, loser!</h4>");
    }
    
    // restart the round
    $('#dealer').empty();
    $('#dealer').append('<img id="dealerShown" src="img/BK.gif">');
    $('#dealer').append('<img id="dealerReveal" src="img/BK.gif">');
    $('#player').empty();
    $('#playerHand').empty();
    $('#playerHand').append("<h3>Your Hand</h3>")
    playerHand = [];
    dealerHand = [];
    if (stackSize > 20) {
        deal();
    } else {
        $('#player').html("<h4>New Deck!</h4>");
        drawPile = [];
        stackSize = 51;
        createDeck();
        shuffleDeck();
        deal();
    }
});