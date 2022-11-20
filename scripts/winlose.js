function animationShowGamOverText(text) {
    const gameBoard = document.querySelector("#game-board");
    animationRemoveGameOverText();
    
    const popupGameOverContainer = document.createElement("div");
    popupGameOverContainer.className = "popupGameOverContainer";
    gameBoard.appendChild(popupGameOverContainer);
    
    
    const popupGameOver = document.createElement("div");
    popupGameOver.className = "popupGameOver";
    popupGameOverContainer.appendChild(popupGameOver);
    
    
    const popupGameOverTextContainer = document.createElement("div");
    popupGameOverTextContainer.className = "popupGameOverTextContainer";
    popupGameOver.appendChild(popupGameOverTextContainer);
    
    const popupGameOverText = document.createElement("div");
    popupGameOverText.className = "popupGameOverText";
    popupGameOverText.innerHTML = text;
    popupGameOverTextContainer.appendChild(popupGameOverText);
    
    const popupBarContainer = document.createElement("div");
    popupBarContainer.className = "popupBarContainer";
    popupGameOver.appendChild(popupBarContainer);
    
    
    // Add play again button
    const popupExtras = document.createElement("div");
    popupExtras.className = "popupExtras";
    popupExtras.innerHTML = '<div class="popupExtrasContent"><button onclick="startGameBtnClick()">Play Again</button><button onclick="viewBoard()">View Board</button></div>';
    popupGameOverContainer.appendChild(popupExtras);
}

function animationRemoveGameOverText() {
    // if any game over popup is showing, remove it
    document.querySelectorAll(".popupGameOverContainer").forEach(e => e.remove());
}

function viewBoard() {
    const gameBoard = document.querySelector("#game-board");
    let popup = document.getElementsByClassName("popupGameOverContainer")[0];
    gameBoard.removeChild(popup);
}