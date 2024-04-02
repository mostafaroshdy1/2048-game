class DomActutator {
    constructor() {
        this.tileContainer = document.querySelector(".tile-container");
        this.scoreContainer = document.querySelector(".score-container");
        this.bestContainer = document.querySelector(".best-container");
        this.messageContainer = document.querySelector(".game-message");

        this.score = 0;
    }

    actuate(grid, metadata) {
        window.requestAnimationFrame(() => {
            this.clearContainer(this.tileContainer);

            grid.cells.forEach(column => {
                column.forEach(cell => {
                    if (cell) {
                        this.addTile(cell);
                    }
                });
            });

            this.updateScore(metadata.score);
            this.updateBestScore(metadata.bestScore);

            if (metadata.over) this.message(false); // You lose
            if (metadata.won) this.message(true); // You win!
        });
    }

    restart() {
        this.clearMessage();
    }

    clearContainer(container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }

    addTile(tile) {
        let element = document.createElement("div");
        let position = tile.previousPosition || { x: tile.x, y: tile.y };
        let positionClass = this.positionClass(position);

        let classes = ["tile", "tile-" + tile.value, positionClass];
        this.applyClasses(element, classes);

        element.textContent = tile.value;

        if (tile.previousPosition) {
            window.requestAnimationFrame(() => {
                classes[2] = this.positionClass({ x: tile.x, y: tile.y });
                this.applyClasses(element, classes); // Update the position
            });
        } else if (tile.mergedFrom) {
            classes.push("tile-merged");
            this.applyClasses(element, classes);

            tile.mergedFrom.forEach(merged => {
                this.addTile(merged);
            });
        } else {
            classes.push("tile-new");
            this.applyClasses(element, classes);
        }

        this.tileContainer.appendChild(element);
    }

    applyClasses(element, classes) {
        element.setAttribute("class", classes.join(" "));
    }

    normalizePosition(position) {
        return { x: position.x + 1, y: position.y + 1 };
    }

    positionClass(position) {
        position = this.normalizePosition(position);
        return "tile-position-" + position.x + "-" + position.y;
    }

    updateScore(score) {
        this.clearContainer(this.scoreContainer);

        let difference = score - this.score;
        this.score = score;

        this.scoreContainer.textContent = this.score;

        if (difference > 0) {
            let addition = document.createElement("div");
            addition.classList.add("score-addition");
            addition.textContent = "+" + difference;

            this.scoreContainer.appendChild(addition);
        }
    }

    updateBestScore(bestScore) {
        this.bestContainer.textContent = bestScore;
    }

    message(won) {
        let type = won ? "game-won" : "game-over";
        let message = won ? "You win!" : "Game over!";

        this.messageContainer.classList.add(type);
        this.messageContainer.getElementsByTagName("p")[0].textContent = message;
    }

    clearMessage() {
        this.messageContainer.classList.remove("game-won", "game-over");
    }
}
