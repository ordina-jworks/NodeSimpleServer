(function () {
    'use strict';

    angular.module('devoxx')
        .controller('GameCtrl', GameCtrl);

    GameCtrl.$inject = ['$scope', '$mdDialog', 'nodeSocketService', '$timeout', '$localForage', 'settingsService'];

    function GameCtrl($scope, $mdDialog, nodeSocketService, $timeout, $localForage, settingsService) {

        var settings = settingsService.getSettings(),
            NUMBER_OF_ROUNDS = settings.numberOfRounds,
            GAMES_TO_WIN = settings.gamesToWin.sort(function(a,b){return a>b}),
            SHOULD_CHEAT = settings.shouldCheat,
            LOOP = settings.loopAfterLastWonGame;

        $scope.roundCounter = NUMBER_OF_ROUNDS;
        $localForage.bind($scope, {
            key: 'gameCounter', // required
            defaultValue: 1 // a default value (needed if it is not already in the database)
        });
        $scope.gameCounter = 1;

        var state = {
            played: false,
            winner: false,
            intervalLaunch: null,
            intervalLoop: null,
            closeButNoCigar: false,
            slots: null
        };

        var mustRegister = false;

        $scope.showAdvanced = function () {
            if (mustRegister) {
                state.played = true;
                showRegisterDialog()
            } else {
                state.played = false;
            }
        };

        $scope.getRounds = function () {
            var arr = [];
            for (var i = 0; i < NUMBER_OF_ROUNDS; i++) {
                arr[i] = 'coin' + (i + 1);
            }
            return arr;
        };

        var clearCounter = 0;
        $scope.clearLocalStorage = function() {
            if(clearCounter === 2) {
                $localForage.clear('gameCounter');
                $scope.gameCounter = 1;
            }else{
                clearCounter++;
                $timeout(function () {
                    clearCounter = 0;
                },5000);
            }
        };

        $(document).ready(init);

        /*-------------------------------------------------------------------------------------------------
         * ------------------------------------------------------------------------------------------------
         *                                        Private functions
         * ------------------------------------------------------------------------------------------------
         ------------------------------------------------------------------------------------------------*/
        /**
         * Initializes the resize events
         * Initializes the slots
         * Initializes the socket
         * Initializes click event on play button
         */
        function init() {
            resize();
            $(window).resize(function () {
                resize();
            });

            setupSlots();

            nodeSocketService.registerCallback(handleButtonPresses);
            $("#playButton").click(play);
        }

        /**
         * Handles screen resize events.
         * This will scale our slot machine to fit the page correctly.
         */
        function resize() {
            var hectoScale = window.innerHeight * 0.095;
            hectoScale = hectoScale / 100;
            $("#scalingWrapper").css('transform', 'scale(' + hectoScale + ')');
        }

        /**
         * Sets up the slots to play the game.
         */
        function setupSlots() {
            var machine1 = $("#machine1").slotMachine({
                active: 1,
                delay: 300
            });
            var machine2 = $("#machine2").slotMachine({
                active: 1,
                delay: 300
            });
            var machine3 = $("#machine3").slotMachine({
                active: 1,
                delay: 300
            });
            state.slots = [machine1, machine2, machine3];
        }

        /**
         * Handles button presses that come from the websocket.
         * @param data The data object that contains the message that was received from the remote server via the socket.
         */
        function handleButtonPresses(data) {
            if (data.buttonPressed === true) {
                if (state.played === false) {
                    play();
                }
            }
        }

        /**
         * Play a new game.
         * Starts the slot animations.
         */
        function play() {
            if (!state.played) {
                state.played = true;

                playRollerSound();
                hideCoin();

                if (SHOULD_CHEAT) {
                    if(shouldWinThisGame()) {
                        if (isLastRound()) {
                            cheatToWin();
                        }
                    } else {
                        cheatToLose();
                    }
                }

                setTimeout(function () {
                    state.slots[0].shuffle(5);
                }, 100);

                setTimeout(function () {
                    state.slots[1].shuffle(5);
                }, 550);

                setTimeout(function () {
                    state.slots[2].shuffle(5, onSlotAnimationComplete);
                }, 1000);
            }
        }

        /**
         * Executed each time a slot finished animating.
         */
        function onSlotAnimationComplete() {
            if (hasJackpot()) {
                state.winner = true;
                state.closeButNoCigar = false;
                nodeSocketService.sendJSONMessage({winner: true});
                playSound('victory');
                setTimeout(function () {
                    startFireworks();
                    showEndGame();
                }, 1500);
            }
            else {
                state.played = false;
                $scope.roundCounter--;
                $scope.$apply();

                if ($scope.roundCounter === 0) {
                    state.played = true;
                    state.winner = false;
                    state.closeButNoCigar = wasItClose();
                    nodeSocketService.sendJSONMessage({winner: false});
                    $timeout(function () {
                        playSound('loser');
                        showEndGame()
                    }, 1500);
                }
            }
        }

        function cheatToLose() {
            var indexes = get3DifferentImgIndexes();
            state.slots.forEach(function (slot, i) {
                slot.setRandomize(function () {
                    return indexes[i];
                });
            });
        }

        function get3DifferentImgIndexes(){
            var indexes = [randomImgPosition(), randomImgPosition(), randomImgPosition()];
            if (indexes[0] === indexes[1] && indexes[1] === indexes[2]) {
                var index = randomImgPosition();
                indexes[index] = (indexes[index] + 1) % 3;
            }
            return indexes;
        }

        function randomImgPosition() {
            return Math.round(Math.random() * 2);
        }

        function cheatToWin() {
            var i = randomImgPosition();
            state.slots.forEach(function (slot) {
                slot.setRandomize(function () {
                    return i;
                });
            });
        }

        function undoCheat() {
            state.slots.forEach(function (slot) {
                slot.setRandomize(function () {
                    return randomImgPosition();
                });
            });
        }

        function hideCoin() {
            $('#coin' + $scope.roundCounter).hide();
        }

        function playRollerSound() {
            document.getElementById('roller').pause();
            document.getElementById('roller').currentTime = 0;
            document.getElementById('roller').play();
        }

        function playSound(name){
            document.getElementById(name).play();
        }

        function shouldWinThisGame() {
            if(GAMES_TO_WIN === null){
                return true;
            } else {
                return GAMES_TO_WIN.indexOf($scope.gameCounter) !== -1
            }
        }

        function isLastRound() {
            return $scope.roundCounter === 1;
        }

        function hasJackpot() {
            return (state.slots[0].active === state.slots[1].active &&
            state.slots[1].active === state.slots[2].active);
        }

        function wasItClose() {
            return (state.slots[0].active === state.slots[1].active ||
            state.slots[1].active === state.slots[2].active ||
            state.slots[0].active === state.slots[2].active);
        }

        function raiseGameCounter() {
            if (LOOP && isLastWinningGame()) {
                $scope.gameCounter = 1;
            } else {
                $scope.gameCounter++;
            }
        }

        function isLastWinningGame() {
            return GAMES_TO_WIN.indexOf($scope.gameCounter) === GAMES_TO_WIN.length -1;
        }
        /**
         * Shows the endgame sub page.
         */
        function showEndGame() {
            $mdDialog.show({
                templateUrl: 'endGame.html',
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                escapeToClose: false,
                controller: 'EndGameCtrl',
                locals: {
                    gameState: state
                }
            }).then(function () {
                $scope.roundCounter = NUMBER_OF_ROUNDS;
                raiseGameCounter();
                undoCheat();
                $scope.showAdvanced(this);
                stopFireworks();
            }, function () {
            });

            setTimeout(function () {
                $("#newGame").click();
            }, 5000);
        }

        /**
         * Shows the register sub page.
         */
        function showRegisterDialog() {
            $mdDialog.show({
                templateUrl: 'register.html',
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                escapeToClose: false,
                controller: 'RegisterCtrl'
            }).then(function (test) {
                $scope.name = test.name;
                state.played = false;
            }, function () {
                state.played = true;
            });
        }

        /**
         * Starts the fireworks effects.
         */
        function startFireworks() {
            document.getElementById('fireworks').play();
            document.body.appendChild(canvas);
            canvas.width = SCREEN_WIDTH;
            canvas.height = SCREEN_HEIGHT;
            state.intervalLaunch = setInterval(launch, 500);
            state.intervalLoop = setInterval(loop, 1000 / 60);
        }

        /**
         * Stops the fireworks effects.
         */
        function stopFireworks() {
            document.getElementById('fireworks').pause();
            clearInterval(state.intervalLaunch);
            clearInterval(state.intervalLoop);
            try {
                document.body.removeChild(canvas);
            } catch (e) {
            }
            particles = [];
            rockets = [];
        }
    }
})();