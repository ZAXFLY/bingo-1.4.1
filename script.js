document.addEventListener('DOMContentLoaded', function() {
    // [TODOS LOS ELEMENTOS DEL DOM Y VARIABLES SE MANTIENEN IGUAL...]
    
    // Elementos del DOM
    const welcomeScreen = document.querySelector('.welcome-screen');
    const instructionsScreen = document.querySelector('.instructions-screen');
    const modeScreen = document.querySelector('.mode-screen');
    const gameScreen = document.querySelector('.game-screen');
    const statsScreen = document.querySelector('.stats-screen');
    const customModeScreen = document.querySelector('.custom-mode-screen');
    const modeOptionsContainer = document.getElementById('modeOptionsContainer');
    const startBtn = document.getElementById('startBtn');
    const beginBtn = document.getElementById('beginBtn');
    const startGameBtn = document.getElementById('startGameBtn');
    const customModeBtn = document.getElementById('customModeBtn');
    const saveCustomModeBtn = document.getElementById('saveCustomModeBtn');
    const cancelCustomModeBtn = document.getElementById('cancelCustomModeBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const bingoBtn = document.getElementById('bingoBtn');
    const finishBtn = document.getElementById('finishBtn');
    const statsBtn = document.getElementById('statsBtn');
    const resetBtn = document.getElementById('resetBtn');
    const backToGameBtn = document.getElementById('backToGameBtn');
    const backToMenuBtn = document.getElementById('backToMenuBtn');
    const deleteDataBtn = document.getElementById('deleteDataBtn');
    const currentBallElement = document.getElementById('currentBall');
    const ballLetterElement = document.getElementById('ballLetter');
    const ballNumberElement = document.getElementById('ballNumber');
    const prevBallElement = document.getElementById('previousBall');
    const prevBallLetterElement = document.getElementById('prevBallLetter');
    const prevBallNumberElement = document.getElementById('prevBallNumber');
    const totalBallsElement = document.getElementById('totalBalls');
    const timerElement = document.getElementById('timer');
    const remainingElement = document.getElementById('remaining');
    const gameModeElement = document.getElementById('gameMode');
    const gameMessageElement = document.getElementById('gameMessage');
    const modeExample = document.getElementById('modeExample');
    const exampleBingoCard = document.getElementById('exampleBingoCard');
    const customBingoCard = document.getElementById('customBingoCard');
    const customModesList = document.getElementById('customModesList');
    
    // Tablas
    const historyBingoCard = document.getElementById('historyBingoCard');
    const fullBingoCard = document.getElementById('fullBingoCard');
    
    // Modales
    const bingoModal = document.getElementById('bingoModal');
    const winnerModal = document.getElementById('winnerModal');
    const celebrationScreen = document.getElementById('celebrationScreen');
    const overlay = document.getElementById('overlay');
    const correctBtn = document.getElementById('correctBtn');
    const incorrectBtn = document.getElementById('incorrectBtn');
    const saveWinnerBtn = document.getElementById('saveWinnerBtn');
    const cancelWinnerBtn = document.getElementById('cancelWinnerBtn');
    const winnerNameInput = document.getElementById('winnerName');
    const verificationResult = document.getElementById('verificationResult');
    const winnersCelebration = document.getElementById('winnersCelebration');
    const finalMessage = document.getElementById('finalMessage');
    
    // Estadísticas
    const generalStats = document.getElementById('generalStats');
    const winnersList = document.getElementById('winnersList');
    const modeStats = document.getElementById('modeStats');
    const gameHistory = document.getElementById('gameHistory');
    
    // Descripción del modo
    const modeDescription = document.getElementById('modeDescription');
    const modeDescriptionText = document.getElementById('modeDescriptionText');
    
    // Variables del juego
    let availableBalls = [];
    let calledBalls = [];
    let currentBall = null;
    let previousBall = null;
    let gameInterval = null;
    let isPaused = false;
    let selectedMode = null;
    let selectedCells = [];
    let historyBingoCells = [];
    let fullBingoCells = [];
    let recentBallCell = null;
    
    // Modos personalizados
    let customModes = JSON.parse(localStorage.getItem('customModes')) || [];
    let editingModeId = null;
    
    // Estadísticas y ganadores
    let gameStats = JSON.parse(localStorage.getItem('bingoStats')) || {
        totalGames: 0,
        totalBallsCalled: 0,
        totalWinners: 0,
        winners: [],
        modeUsage: {},
        gameHistory: []
    };
    
    // Tiempo persistente
    let totalElapsedTime = parseInt(localStorage.getItem('totalElapsedTime')) || 0;
    let timerInterval = null;
    
    // Estado del juego persistente
    let gameState = JSON.parse(localStorage.getItem('bingoGameState')) || null;
    
    // Mensajes motivadores
    const motivationalMessages = [
        "¡La suerte está de tu lado!",
        "¡Cada número te acerca más!",
        "¡No te rindas!",
        "¡La emoción está en su punto máximo!",
        "¡Siente la adrenalina!",
        "¡El próximo número puede cambiarlo todo!",
        "¡Mantén la concentración!",
        "¡La fortuna favorece a los valientes!",
        "¡Este podría ser tu momento!"
    ];
    let messageChangeInterval = null;
    
    // Modos predefinidos - 10 modos diferentes (sin blackout y diagonals)
    const predefinedModes = [
        {
            id: 'full',
            name: 'Cartón Lleno',
            description: 'Gana al completar todo tu cartón',
            pattern: 'full',
            winDescription: 'Se gana cuando se complete todo el cartón.'
        },
        {
            id: 'x',
            name: 'Equis (X)',
            description: 'Gana al completar una diagonal en forma de X',
            pattern: 'x',
            winDescription: 'Se gana al completar las dos diagonales del cartón formando una X.'
        },
        {
            id: 'horizontal',
            name: 'Línea Horizontal',
            description: 'Gana al completar cualquier línea horizontal',
            pattern: 'horizontal',
            winDescription: 'Se gana al completar cualquier línea horizontal del cartón.'
        },
        {
            id: 'vertical',
            name: 'Línea Vertical',
            description: 'Gana al completar cualquier línea vertical',
            pattern: 'vertical',
            winDescription: 'Se gana al completar cualquier línea vertical del cartón.'
        },
        {
            id: 'two-lines',
            name: 'Dos Líneas',
            description: 'Gana al completar dos líneas (horizontales o verticales)',
            pattern: 'two-lines',
            winDescription: 'Se gana al completar dos líneas, ya sean horizontales o verticales.'
        },
        {
            id: 'four-corners',
            name: 'Cuatro Esquinas',
            description: 'Gana al completar las cuatro esquinas del cartón',
            pattern: 'four-corners',
            winDescription: 'Se gana al completar las cuatro esquinas del cartón.'
        },
        {
            id: 'small-frame',
            name: 'Marco Pequeño',
            description: 'Gana al completar el marco exterior del cartón',
            pattern: 'small-frame',
            winDescription: 'Se gana al completar el marco exterior del cartón.'
        },
        {
            id: 'letter-t',
            name: 'Letra T',
            description: 'Gana al completar la primera fila y la columna central',
            pattern: 'letter-t',
            winDescription: 'Se gana al completar la primera fila y la columna central formando una T.'
        },
        {
            id: 'letter-l',
            name: 'Letra L',
            description: 'Gana al completar la primera columna y la última fila',
            pattern: 'letter-l',
            winDescription: 'Se gana al completar la primera columna y la última fila formando una L.'
        },
        {
            id: 'plus',
            name: 'Cruz (+)',
            description: 'Gana al completar la fila y columna central',
            pattern: 'plus',
            winDescription: 'Se gana al completar la fila y columna central formando una cruz.'
        }
    ];
    
    // Inicializar
    initializeApp();
    
    // Event listeners
    startBtn.addEventListener('click', showInstructions);
    beginBtn.addEventListener('click', showModeSelection);
    startGameBtn.addEventListener('click', startGame);
    customModeBtn.addEventListener('click', showCustomModeScreen);
    saveCustomModeBtn.addEventListener('click', saveCustomMode);
    cancelCustomModeBtn.addEventListener('click', showModeSelection);
    pauseBtn.addEventListener('click', togglePause);
    bingoBtn.addEventListener('click', showBingoModal);
    finishBtn.addEventListener('click', showCelebration);
    statsBtn.addEventListener('click', showStatistics);
    resetBtn.addEventListener('click', showModeSelection);
    backToGameBtn.addEventListener('click', showGame);
    backToMenuBtn.addEventListener('click', showModeSelection);
    deleteDataBtn.addEventListener('click', deleteAllData);
    correctBtn.addEventListener('click', bingoCorrect);
    incorrectBtn.addEventListener('click', bingoIncorrect);
    saveWinnerBtn.addEventListener('click', saveWinner);
    cancelWinnerBtn.addEventListener('click', cancelWinner);
    
    function initializeApp() {
        // Cargar estado del juego
        gameState = JSON.parse(localStorage.getItem('bingoGameState'));
        
        // Crear tablas de bingo PRIMERO
        createBingoCard(historyBingoCard, historyBingoCells, false);
        createBingoCard(fullBingoCard, fullBingoCells, true);
        
        // Verificar si hay un juego en curso guardado y si tiene datos válidos
        if (gameState && gameState.gameActive && gameState.calledBalls && gameState.calledBalls.length > 0) {
            console.log('Restaurando juego guardado:', gameState);
            // Restaurar el juego desde el estado guardado
            restoreGame();
        } else {
            // Mostrar pantalla de bienvenida solo si no hay juego activo
            welcomeScreen.style.display = 'block';
            setTimeout(() => {
                welcomeScreen.classList.add('active');
            }, 100);
            
            // Limpiar estado inválido
            if (gameState && (!gameState.calledBalls || gameState.calledBalls.length === 0)) {
                clearGameState();
            }
        }
        
        startPersistentTimer();
        renderModeOptions();
        renderCustomModes();
        createCustomBingoCard();
    }
    
    function renderModeOptions() {
        modeOptionsContainer.innerHTML = '';
        
        // Agregar modos predefinidos
        predefinedModes.forEach(mode => {
            const modeOption = document.createElement('div');
            modeOption.className = 'mode-option';
            modeOption.dataset.mode = mode.id;
            
            modeOption.innerHTML = `
                <h3>${mode.name}</h3>
                <p>${mode.description}</p>
            `;
            
            modeOption.addEventListener('click', function() {
                document.querySelectorAll('.mode-option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                selectedMode = this.getAttribute('data-mode');
                showModeExample(selectedMode);
                showModeDescription(selectedMode);
            });
            
            modeOptionsContainer.appendChild(modeOption);
        });
        
        // Agregar modos personalizados
        customModes.forEach(mode => {
            const modeOption = document.createElement('div');
            modeOption.className = 'mode-option';
            modeOption.dataset.mode = mode.id;
            
            modeOption.innerHTML = `
                <h3>${mode.name}</h3>
                <p>${mode.description}</p>
            `;
            
            modeOption.addEventListener('click', function() {
                document.querySelectorAll('.mode-option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                selectedMode = this.getAttribute('data-mode');
                showModeExample(selectedMode);
                showModeDescription(selectedMode);
            });
            
            modeOptionsContainer.appendChild(modeOption);
        });
    }
    
    function showModeDescription(modeId) {
        // Buscar en modos predefinidos
        const predefinedMode = predefinedModes.find(m => m.id === modeId);
        if (predefinedMode) {
            modeDescription.style.display = 'block';
            modeDescriptionText.textContent = predefinedMode.winDescription;
            return;
        }
        
        // Buscar en modos personalizados
        const customMode = customModes.find(m => m.id === modeId);
        if (customMode) {
            modeDescription.style.display = 'block';
            modeDescriptionText.textContent = customMode.description;
            return;
        }
        
        // Si no se encuentra, ocultar la descripción
        modeDescription.style.display = 'none';
    }
    
    function restoreGame() {
        if (!gameState) return;
        
        console.log('Restaurando juego con balotas:', gameState.calledBalls);
        
        // Restaurar estado del juego
        availableBalls = gameState.availableBalls || [];
        calledBalls = gameState.calledBalls || [];
        currentBall = gameState.currentBall;
        previousBall = gameState.previousBall;
        selectedMode = gameState.selectedMode;
        isPaused = gameState.isPaused;

        // Mostrar pantalla de juego directamente
        gameScreen.style.display = 'block';
        welcomeScreen.style.display = 'none';
        instructionsScreen.style.display = 'none';
        modeScreen.style.display = 'none';

        // Inicializar elementos de UI
        initializeGameUI();

        // Actualizar UI con datos guardados
        totalBallsElement.textContent = calledBalls.length;
        remainingElement.textContent = availableBalls.length;
        gameModeElement.textContent = getModeName(selectedMode);

        if (previousBall) {
            const prevBallLetter = getBallLetter(previousBall);
            prevBallLetterElement.textContent = prevBallLetter;
            prevBallNumberElement.textContent = previousBall;
        }

        if (currentBall) {
            const ballLetter = getBallLetter(currentBall);
            ballLetterElement.textContent = ballLetter;
            ballNumberElement.textContent = currentBall;
        }

        // Marcar TODAS las balotas en el historial (no solo la última)
        console.log('Marcando balotas en historial:', calledBalls);
        calledBalls.forEach(number => {
            markBallInHistory(number, false); // false = no animar
        });

        // Reanudar el juego si no estaba pausado
        if (!isPaused) {
            startBallCalling();
            startMotivationalMessages();
            pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar';
        } else {
            pauseBtn.innerHTML = '<i class="fas fa-play"></i> Reanudar';
            gameMessageElement.textContent = 'Juego en pausa';
        }

        // Aplicar animación de entrada
        setTimeout(() => {
            gameScreen.classList.add('active');
        }, 100);
    }
    
    // Función para guardar el estado completo del juego
    function saveCompleteGameState() {
        const state = {
            gameActive: true,
            availableBalls: availableBalls,
            calledBalls: calledBalls,
            currentBall: currentBall,
            previousBall: previousBall,
            selectedMode: selectedMode,
            isPaused: isPaused
        };
        localStorage.setItem('bingoGameState', JSON.stringify(state));
        
        // También guardar las estadísticas por separado
        localStorage.setItem('bingoStats', JSON.stringify(gameStats));
        localStorage.setItem('totalElapsedTime', totalElapsedTime.toString());
        
        console.log('Estado guardado:', state);
    }
    
    function clearGameState() {
        localStorage.removeItem('bingoGameState');
        gameState = null;
    }
    
    function deleteAllData() {
        if (confirm("¿Estás seguro de que quieres eliminar TODOS los datos? Esta acción eliminará estadísticas, ganadores y tiempo, pero conservará tus modos personalizados.")) {
            // Limpiar todos los datos del localStorage excepto modos personalizados
            localStorage.removeItem('bingoStats');
            localStorage.removeItem('bingoGameState');
            localStorage.removeItem('totalElapsedTime');
            
            // Reiniciar variables (excepto customModes)
            gameStats = {
                totalGames: 0,
                totalBallsCalled: 0,
                totalWinners: 0,
                winners: [],
                modeUsage: {},
                gameHistory: []
            };
            
            // Reiniciar el cronómetro
            totalElapsedTime = 0;
            localStorage.setItem('totalElapsedTime', totalElapsedTime);
            timerElement.textContent = '00:00';
            
            // Actualizar estadísticas
            updateStatistics();
            
            // Mostrar mensaje de confirmación
            alert("Todos los datos han sido eliminados correctamente, excepto tus modos personalizados.");
            
            // Volver al menú principal
            showModeSelection();
        }
    }
    
    function showInstructions() {
        welcomeScreen.classList.remove('active');
        setTimeout(() => {
            welcomeScreen.style.display = 'none';
            instructionsScreen.style.display = 'block';
            setTimeout(() => {
                instructionsScreen.classList.add('active');
            }, 100);
            
            // Leer instrucciones en voz alta
            speakInstructions();
        }, 300);
    }
    
    function speakInstructions() {
        const instructionsText = `
            Instrucciones del Bingo. 
            Las balotas se cantarán automáticamente cada 8 segundos con una voz femenina clara.
            Cada balota tendrá una letra B, I, N, G, O y un número.
            Marca los números en tus cartones según vayan siendo cantados.
            Cuando completes una línea horizontal, vertical o diagonal, grita ¡Línea!
            Cuando completes todo tu cartón grita ¡Bingo!
            ¡Diviértete y mucha suerte!
        `;
        speakText(instructionsText);
    }
    
    function showModeSelection() {
        // Ocultar todas las pantallas con animación
        document.querySelectorAll('.welcome-screen, .instructions-screen, .game-screen, .stats-screen, .custom-mode-screen, .celebration-screen').forEach(screen => {
            screen.classList.remove('active');
            setTimeout(() => {
                screen.style.display = 'none';
            }, 300);
        });
        
        // Ocultar modales
        document.querySelectorAll('.bingo-modal, .winner-modal').forEach(modal => {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        });
        
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
        
        // Mostrar pantalla de selección de modo con animación
        setTimeout(() => {
            modeScreen.style.display = 'block';
            setTimeout(() => {
                modeScreen.classList.add('active');
            }, 100);
            
            selectedMode = null;
            document.querySelectorAll('.mode-option').forEach(opt => opt.classList.remove('selected'));
            modeExample.style.display = 'none';
            modeDescription.style.display = 'none';
            
            // Limpiar estado del juego cuando volvemos a la selección de modo
            clearGameState();
        }, 300);
    }
    
    function showCustomModeScreen() {
        modeScreen.classList.remove('active');
        setTimeout(() => {
            modeScreen.style.display = 'none';
            customModeScreen.style.display = 'block';
            setTimeout(() => {
                customModeScreen.classList.add('active');
            }, 100);
            
            // Limpiar formulario
            document.getElementById('customModeName').value = '';
            document.getElementById('customModeDescription').value = '';
            editingModeId = null;
            
            // Deseleccionar todas las celdas
            const cells = customBingoCard.querySelectorAll('.custom-cell');
            cells.forEach(cell => {
                cell.classList.remove('selected');
            });
        }, 300);
    }
    
    function showStatistics() {
        gameScreen.classList.remove('active');
        setTimeout(() => {
            gameScreen.style.display = 'none';
            statsScreen.style.display = 'block';
            setTimeout(() => {
                statsScreen.classList.add('active');
            }, 100);
            updateStatistics();
        }, 300);
    }
    
    function showGame() {
        statsScreen.classList.remove('active');
        setTimeout(() => {
            statsScreen.style.display = 'none';
            gameScreen.style.display = 'block';
            setTimeout(() => {
                gameScreen.classList.add('active');
            }, 100);
        }, 300);
    }
    
    function startGame() {
        if (!selectedMode) {
            alert("Por favor selecciona un modo de juego");
            return;
        }
        
        modeScreen.classList.remove('active');
        setTimeout(() => {
            modeScreen.style.display = 'none';
            gameScreen.style.display = 'block';
            setTimeout(() => {
                gameScreen.classList.add('active');
            }, 100);
            initializeGame();
            startBallCalling();
            
            speakText(`¡Que comience el juego! Modo: ${getModeName(selectedMode)}. Buena suerte.`);
            
            setTimeout(() => {
                startMotivationalMessages();
            }, 5000);
            
            // Guardar estado inicial del juego
            saveCompleteGameState();
        }, 300);
    }
    
    function startMotivationalMessages() {
        if (messageChangeInterval) clearInterval(messageChangeInterval);
        messageChangeInterval = setInterval(() => {
            if (!isPaused) {
                const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
                gameMessageElement.textContent = motivationalMessages[randomIndex];
            }
        }, 8000);
    }
    
    function initializeGame() {
        availableBalls = [];
        calledBalls = [];
        selectedCells = [];
        
        for (let i = 1; i <= 75; i++) {
            availableBalls.push(i);
        }
        
        shuffleArray(availableBalls);
        
        // Actualizar UI
        initializeGameUI();
        
        currentBall = null;
        previousBall = null;
        isPaused = false;
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar';
    }
    
    function initializeGameUI() {
        totalBallsElement.textContent = '0';
        remainingElement.textContent = '75';
        gameModeElement.textContent = getModeName(selectedMode);
        
        ballLetterElement.textContent = 'B';
        ballNumberElement.textContent = '00';
        prevBallLetterElement.textContent = 'B';
        prevBallNumberElement.textContent = '00';
        currentBallElement.classList.remove('active');
        
        // Limpiar historial de balotas
        historyBingoCells.forEach(cell => {
            cell.classList.remove('called', 'recent');
        });
    }
    
    function createBingoCard(container, cellsArray, isClickable) {
        // Limpiar el contenedor primero
        container.innerHTML = '<div class="full-bingo-header">Todas las Balotas del Bingo</div>';
        cellsArray.length = 0; // Limpiar el array
        
        const letters = ['B', 'I', 'N', 'G', 'O'];
        const ranges = [
            { start: 1, end: 15 },
            { start: 16, end: 30 },
            { start: 31, end: 45 },
            { start: 46, end: 60 },
            { start: 61, end: 75 }
        ];
        
        letters.forEach((letter, index) => {
            const range = ranges[index];
            const letterHeader = document.createElement('div');
            letterHeader.className = 'letter-header-modal';
            letterHeader.textContent = `${letter} (${range.start}-${range.end})`;
            container.appendChild(letterHeader);
            
            for (let i = range.start; i <= range.end; i++) {
                const cell = document.createElement('div');
                cell.className = 'full-bingo-cell';
                cell.textContent = i;
                cell.dataset.number = i;
                
                if (isClickable) {
                    cell.addEventListener('click', function() {
                        this.classList.toggle('selected');
                        const number = parseInt(this.textContent);
                        
                        if (this.classList.contains('selected')) {
                            selectedCells.push(number);
                        } else {
                            selectedCells = selectedCells.filter(n => n !== number);
                        }
                        
                        verifyBingo();
                    });
                }
                
                container.appendChild(cell);
                cellsArray.push(cell);
            }
        });
        
        console.log('Tabla creada con', cellsArray.length, 'celdas');
    }
    
    function showModeExample(mode) {
        modeExample.style.display = 'block';
        exampleBingoCard.innerHTML = '';
        
        // Crear un cartón de ejemplo 5x5
        const exampleNumbers = generateExampleCard();
        
        // Crear celdas del cartón
        for (let i = 0; i < 25; i++) {
            const cell = document.createElement('div');
            cell.className = 'example-cell';
            cell.textContent = exampleNumbers[i];
            
            // Marcar celdas según el modo
            if (mode === 'full') {
                // Todas las celdas marcadas
                cell.classList.add('selected');
            } else if (mode === 'x') {
                // Diagonal principal y secundaria
                if (i % 6 === 0 || (i > 0 && i < 24 && i % 4 === 0)) {
                    cell.classList.add('selected');
                }
            } else if (mode === 'horizontal') {
                // Primera fila
                if (i < 5) {
                    cell.classList.add('selected');
                }
            } else if (mode === 'vertical') {
                // Primera columna
                if (i % 5 === 0) {
                    cell.classList.add('selected');
                }
            } else if (mode === 'two-lines') {
                // Primera y segunda fila
                if (i < 10) {
                    cell.classList.add('selected');
                }
            } else if (mode === 'four-corners') {
                // Cuatro esquinas
                if (i === 0 || i === 4 || i === 20 || i === 24) {
                    cell.classList.add('selected');
                }
            } else if (mode === 'small-frame') {
                // Marco pequeño
                if (i < 5 || i > 19 || i % 5 === 0 || i % 5 === 4) {
                    cell.classList.add('selected');
                }
            } else if (mode === 'letter-t') {
                // Letra T (primera fila + columna central)
                if (i < 5 || i % 5 === 2) {
                    cell.classList.add('selected');
                }
            } else if (mode === 'letter-l') {
                // Letra L (primera columna + última fila)
                if (i % 5 === 0 || i > 19) {
                    cell.classList.add('selected');
                }
            } else if (mode === 'plus') {
                // Cruz (fila y columna central)
                if (i === 2 || i === 7 || i === 10 || i === 11 || i === 12 || i === 13 || i === 14 || i === 17 || i === 22) {
                    cell.classList.add('selected');
                }
            } else {
                // Modo personalizado
                const customMode = customModes.find(m => m.id === mode);
                if (customMode && customMode.pattern.includes(i)) {
                    cell.classList.add('selected');
                }
            }
            
            exampleBingoCard.appendChild(cell);
        }
    }
    
    function generateExampleCard() {
        // Generar números de ejemplo para un cartón 5x5
        const numbers = [];
        const ranges = [
            { start: 1, end: 15 },
            { start: 16, end: 30 },
            { start: 31, end: 45 },
            { start: 46, end: 60 },
            { start: 61, end: 75 }
        ];
        
        for (let i = 0; i < 5; i++) {
            const range = ranges[i];
            const colNumbers = [];
            
            for (let j = 0; j < 5; j++) {
                let num;
                do {
                    num = Math.floor(Math.random() * (range.end - range.start + 1)) + range.start;
                } while (colNumbers.includes(num));
                
                colNumbers.push(num);
            }
            
            // Ordenar números de la columna
            colNumbers.sort((a, b) => a - b);
            
            // Agregar a la matriz
            for (let j = 0; j < 5; j++) {
                numbers[j * 5 + i] = colNumbers[j];
            }
        }
        
        // Celda central libre
        numbers[12] = 'FREE';
        
        return numbers;
    }
    
    function createCustomBingoCard() {
        customBingoCard.innerHTML = '';
        
        // Crear un cartón de ejemplo 5x5
        const exampleNumbers = generateExampleCard();
        
        // Crear celdas del cartón
        for (let i = 0; i < 25; i++) {
            const cell = document.createElement('div');
            cell.className = 'custom-cell';
            cell.textContent = exampleNumbers[i];
            cell.dataset.index = i;
            
            cell.addEventListener('click', function() {
                this.classList.toggle('selected');
            });
            
            customBingoCard.appendChild(cell);
        }
    }
    
    function saveCustomMode() {
        const name = document.getElementById('customModeName').value.trim();
        const description = document.getElementById('customModeDescription').value.trim();
        
        if (!name || !description) {
            alert('Por favor completa todos los campos');
            return;
        }
        
        // Obtener celdas seleccionadas
        const selectedCells = [];
        const cells = customBingoCard.querySelectorAll('.custom-cell');
        cells.forEach((cell, index) => {
            if (cell.classList.contains('selected')) {
                selectedCells.push(index);
            }
        });
        
        if (selectedCells.length === 0) {
            alert('Por favor selecciona al menos una celda para el modo de juego');
            return;
        }
        
        if (editingModeId) {
            // Editar modo existente (puede ser predefinido o personalizado)
            const modeIndex = predefinedModes.findIndex(m => m.id === editingModeId);
            if (modeIndex !== -1) {
                // Es un modo predefinido - crear una copia personalizada
                const customMode = {
                    id: 'custom-' + editingModeId,
                    name: name,
                    description: description,
                    pattern: selectedCells
                };
                customModes.push(customMode);
            } else {
                // Es un modo personalizado existente
                const customModeIndex = customModes.findIndex(m => m.id === editingModeId);
                if (customModeIndex !== -1) {
                    customModes[customModeIndex].name = name;
                    customModes[customModeIndex].description = description;
                    customModes[customModeIndex].pattern = selectedCells;
                }
            }
        } else {
            // Guardar modo personalizado nuevo
            const customMode = {
                id: Date.now().toString(),
                name: name,
                description: description,
                pattern: selectedCells
            };
            
            customModes.push(customMode);
        }
        
        localStorage.setItem('customModes', JSON.stringify(customModes));
        
        // Limpiar formulario
        document.getElementById('customModeName').value = '';
        document.getElementById('customModeDescription').value = '';
        editingModeId = null;
        
        // Deseleccionar todas las celdas
        cells.forEach(cell => {
            cell.classList.remove('selected');
        });
        
        // Actualizar lista y opciones
        renderCustomModes();
        renderModeOptions();
        
        // Volver a la pantalla de selección de modo
        showModeSelection();
        
        alert('Modo personalizado guardado correctamente');
    }
    
    function renderCustomModes() {
        customModesList.innerHTML = '<h3 style="margin-bottom: 15px;">Tus Modos Personalizados</h3>';
        
        if (customModes.length === 0) {
            customModesList.innerHTML += '<p style="text-align: center; color: #7f8c8d;">No hay modos personalizados guardados</p>';
            return;
        }
        
        customModes.forEach(mode => {
            const modeItem = document.createElement('div');
            modeItem.className = 'custom-mode-item';
            
            modeItem.innerHTML = `
                <div class="custom-mode-info">
                    <h4>${mode.name}</h4>
                    <p>${mode.description}</p>
                </div>
                <div class="custom-mode-actions">
                    <button class="btn-primary btn-small use-custom-mode" data-id="${mode.id}">
                        <i class="fas fa-play"></i> Usar
                    </button>
                    <button class="btn-tertiary btn-small edit-custom-mode" data-id="${mode.id}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-secondary btn-small delete-custom-mode" data-id="${mode.id}">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            `;
            
            customModesList.appendChild(modeItem);
        });
        
        // Agregar event listeners a los botones
        document.querySelectorAll('.use-custom-mode').forEach(btn => {
            btn.addEventListener('click', function() {
                const modeId = this.getAttribute('data-id');
                useCustomMode(modeId);
            });
        });
        
        document.querySelectorAll('.edit-custom-mode').forEach(btn => {
            btn.addEventListener('click', function() {
                const modeId = this.getAttribute('data-id');
                editCustomMode(modeId);
            });
        });
        
        document.querySelectorAll('.delete-custom-mode').forEach(btn => {
            btn.addEventListener('click', function() {
                const modeId = this.getAttribute('data-id');
                deleteCustomMode(modeId);
            });
        });
    }
    
    function useCustomMode(modeId) {
        selectedMode = modeId;
        startGame();
    }
    
    function editCustomMode(modeId) {
        let mode;
        
        // Buscar en modos predefinidos
        mode = predefinedModes.find(m => m.id === modeId);
        
        // Si no se encuentra en predefinidos, buscar en personalizados
        if (!mode) {
            mode = customModes.find(m => m.id === modeId);
        }
        
        if (mode) {
            // Llenar formulario con datos del modo
            document.getElementById('customModeName').value = mode.name;
            document.getElementById('customModeDescription').value = mode.description;
            
            // Marcar celdas seleccionadas según el patrón del modo
            const cells = customBingoCard.querySelectorAll('.custom-cell');
            cells.forEach((cell, index) => {
                // Determinar si esta celda debe estar seleccionada según el patrón
                let shouldBeSelected = false;
                
                if (mode.pattern === 'full') {
                    shouldBeSelected = true;
                } else if (mode.pattern === 'x') {
                    shouldBeSelected = (index % 6 === 0 || (index > 0 && index < 24 && index % 4 === 0));
                } else if (mode.pattern === 'horizontal') {
                    shouldBeSelected = (index < 5);
                } else if (mode.pattern === 'vertical') {
                    shouldBeSelected = (index % 5 === 0);
                } else if (mode.pattern === 'two-lines') {
                    shouldBeSelected = (index < 10);
                } else if (mode.pattern === 'four-corners') {
                    shouldBeSelected = (index === 0 || index === 4 || index === 20 || index === 24);
                } else if (mode.pattern === 'small-frame') {
                    shouldBeSelected = (index < 5 || index > 19 || index % 5 === 0 || index % 5 === 4);
                } else if (mode.pattern === 'letter-t') {
                    shouldBeSelected = (index < 5 || index % 5 === 2);
                } else if (mode.pattern === 'letter-l') {
                    shouldBeSelected = (index % 5 === 0 || index > 19);
                } else if (mode.pattern === 'plus') {
                    shouldBeSelected = (index === 2 || index === 7 || index === 10 || index === 11 || index === 12 || index === 13 || index === 14 || index === 17 || index === 22);
                } else if (Array.isArray(mode.pattern)) {
                    // Es un modo personalizado con patrón de array
                    shouldBeSelected = mode.pattern.includes(index);
                }
                
                if (shouldBeSelected) {
                    cell.classList.add('selected');
                } else {
                    cell.classList.remove('selected');
                }
            });
            
            // Establecer modo de edición
            editingModeId = modeId;
            
            // Mostrar pantalla de edición
            modeScreen.style.display = 'none';
            customModeScreen.style.display = 'block';
        }
    }
    
    function deleteCustomMode(modeId) {
        if (confirm('¿Estás seguro de que quieres eliminar este modo personalizado?')) {
            customModes = customModes.filter(m => m.id !== modeId);
            localStorage.setItem('customModes', JSON.stringify(customModes));
            renderCustomModes();
            renderModeOptions();
        }
    }
    
    function startBallCalling() {
        clearInterval(gameInterval);
        gameInterval = setInterval(function() {
            if (isPaused) return;
            
            if (availableBalls.length === 0) {
                clearInterval(gameInterval);
                gameMessageElement.textContent = '¡Todas las balotas han sido cantadas!';
                speakText("¡Todas las balotas han sido cantadas! El juego ha terminado.");
                return;
            }
            
            getNextBall();
            
        }, 8000);
    }
    
    function getNextBall() {
        const ballIndex = Math.floor(Math.random() * availableBalls.length);
        const ballNumber = availableBalls[ballIndex];
        availableBalls.splice(ballIndex, 1);
        calledBalls.push(ballNumber);
        previousBall = currentBall;
        currentBall = ballNumber;
        const ballLetter = getBallLetter(ballNumber);
        
        if (previousBall) {
            const prevBallLetter = getBallLetter(previousBall);
            prevBallLetterElement.textContent = prevBallLetter;
            prevBallNumberElement.textContent = previousBall;
        }
        
        ballLetterElement.textContent = ballLetter;
        ballNumberElement.textContent = ballNumber;
        currentBallElement.classList.add('active');
        
        // Marcar la balota actual en el historial con animación
        markBallInHistory(ballNumber, true);
        
        totalBallsElement.textContent = calledBalls.length;
        remainingElement.textContent = availableBalls.length;
        
        speakBallTwice(ballNumber);
        
        // Guardar estado COMPLETO del juego
        saveCompleteGameState();
        
        setTimeout(() => {
            currentBallElement.classList.remove('active');
        }, 500);
    }
    
    // Función mejorada para marcar balotas en el historial
    function markBallInHistory(number, animate = true) {
        console.log('Intentando marcar balota:', number);
        
        // Remover la clase 'recent' de la balota anterior si estamos animando
        if (animate && recentBallCell) {
            recentBallCell.classList.remove('recent');
            recentBallCell.classList.add('called');
        }
        
        // Buscar y marcar la nueva balota
        let found = false;
        historyBingoCells.forEach(cell => {
            const cellNumber = parseInt(cell.textContent);
            if (cellNumber === number) {
                found = true;
                if (animate) {
                    cell.classList.add('recent');
                    recentBallCell = cell;
                    
                    setTimeout(() => {
                        if (cell.classList.contains('recent')) {
                            cell.classList.remove('recent');
                            cell.classList.add('called');
                        }
                    }, 3000);
                } else {
                    // Si no estamos animando, simplemente marcar como llamada
                    cell.classList.add('called');
                }
                console.log('Balota marcada:', number);
            }
        });
        
        if (!found) {
            console.log('Balota no encontrada en el historial:', number);
        }
    }
    
    function speakBallTwice(number) {
        const letter = getBallLetter(number);
        const text = `${letter} ${number}`;
        
        if ('speechSynthesis' in window) {
            speakBall(number);
            setTimeout(() => {
                speakBall(number);
            }, 2000);
        }
    }
    
    function togglePause() {
        isPaused = !isPaused;
        pauseBtn.innerHTML = isPaused ? '<i class="fas fa-play"></i> Reanudar' : '<i class="fas fa-pause"></i> Pausar';
        
        if (isPaused) {
            gameMessageElement.textContent = 'Juego en pausa';
            speakText("Juego pausado");
            clearInterval(messageChangeInterval);
        } else {
            gameMessageElement.textContent = '¡Juego reanudado!';
            speakText("Juego reanudado");
            startMotivationalMessages();
        }
        
        // Guardar estado del juego
        saveCompleteGameState();
    }
    
    function showBingoModal() {
        // Limpiar selecciones anteriores
        selectedCells = [];
        fullBingoCells.forEach(cell => {
            cell.classList.remove('selected', 'missing');
        });
        
        updateFullBingoCard();
        
        // Mostrar modal con animación
        overlay.style.display = 'block';
        bingoModal.style.display = 'block';
        setTimeout(() => {
            overlay.classList.add('active');
            bingoModal.classList.add('active');
        }, 100);
        
        isPaused = true;
        pauseBtn.innerHTML = '<i class="fas fa-play"></i> Reanudar';
        clearInterval(messageChangeInterval);
        
        // Guardar estado del juego
        saveCompleteGameState();
    }
    
    function updateFullBingoCard() {
        fullBingoCells.forEach(cell => {
            const number = parseInt(cell.textContent);
            if (calledBalls.includes(number)) {
                cell.classList.add('called');
            } else {
                cell.classList.remove('called');
            }
            cell.classList.remove('missing');
        });
    }
    
    function verifyBingo() {
        if (selectedCells.length === 0) {
            verificationResult.innerHTML = '';
            return;
        }
        
        const missingNumbers = selectedCells.filter(num => !calledBalls.includes(num));
        
        if (missingNumbers.length === 0) {
            verificationResult.innerHTML = '<div class="winner-message">¡Bingo correcto! Todas las balotas han salido.</div>';
        } else {
            verificationResult.innerHTML = `
                <div style="background: #ffeaa7; color: #d35400; padding: 10px; border-radius: 5px; margin: 10px 0;">
                    <strong>Balotas que no han salido:</strong> ${missingNumbers.join(', ')}
                </div>
            `;
            
            fullBingoCells.forEach(cell => {
                const number = parseInt(cell.textContent);
                if (missingNumbers.includes(number)) {
                    cell.classList.add('missing');
                }
            });
        }
    }
    
    function bingoCorrect() {
        // Ocultar modal de bingo con animación
        bingoModal.classList.remove('active');
        overlay.classList.remove('active');
        setTimeout(() => {
            bingoModal.style.display = 'none';
            
            // Mostrar modal de ganador con animación
            winnerModal.style.display = 'block';
            setTimeout(() => {
                winnerModal.classList.add('active');
                winnerNameInput.value = '';
                winnerNameInput.focus();
            }, 100);
        }, 300);
    }
    
    function saveWinner() {
        const winnerName = winnerNameInput.value.trim();
        
        if (!winnerName) {
            alert('Por favor ingresa el nombre del ganador');
            return;
        }
        
        // Registrar ganador
        const winner = {
            name: winnerName,
            date: new Date().toLocaleString(),
            mode: getModeName(selectedMode),
            ballsCalled: calledBalls.length,
            gameDuration: formatTime(totalElapsedTime)
        };
        
        // Actualizar estadísticas
        gameStats.totalGames++;
        gameStats.totalBallsCalled += calledBalls.length;
        gameStats.totalWinners++;
        gameStats.winners.unshift(winner);
        
        // Actualizar uso de modos
        if (!gameStats.modeUsage[selectedMode]) {
            gameStats.modeUsage[selectedMode] = 0;
        }
        gameStats.modeUsage[selectedMode]++;
        
        // Registrar historial de juego
        gameStats.gameHistory.unshift({
            date: new Date().toLocaleString(),
            mode: getModeName(selectedMode),
            winner: winnerName,
            ballsCalled: calledBalls.length,
            duration: formatTime(totalElapsedTime)
        });
        
        // Limitar el historial a las últimas 10 partidas
        if (gameStats.gameHistory.length > 10) {
            gameStats.gameHistory = gameStats.gameHistory.slice(0, 10);
        }
        
        // Guardar estadísticas
        localStorage.setItem('bingoStats', JSON.stringify(gameStats));
        
        // Cerrar modal
        winnerModal.classList.remove('active');
        overlay.classList.remove('active');
        setTimeout(() => {
            winnerModal.style.display = 'none';
            overlay.style.display = 'none';
            
            gameMessageElement.innerHTML = `<span class="winner-message">¡Felicidades ${winnerName}! Bingo correcto.</span>`;
            speakText(`¡Felicidades ${winnerName}! Tenemos un ganador.`);
            
            clearInterval(gameInterval);
            isPaused = true;
            pauseBtn.innerHTML = '<i class="fas fa-play"></i> Reanudar';
            
            // Limpiar estado del juego
            clearGameState();
        }, 300);
    }
    
    function cancelWinner() {
        winnerModal.classList.remove('active');
        overlay.classList.remove('active');
        setTimeout(() => {
            winnerModal.style.display = 'none';
            overlay.style.display = 'none';
            
            isPaused = false;
            pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar';
            startBallCalling();
            startMotivationalMessages();
            
            // Guardar estado del juego
            saveCompleteGameState();
        }, 300);
    }
    
    function bingoIncorrect() {
        bingoModal.classList.remove('active');
        overlay.classList.remove('active');
        setTimeout(() => {
            bingoModal.style.display = 'none';
            overlay.style.display = 'none';
            
            gameMessageElement.textContent = "Bingo incorrecto. ¡Sigan jugando!";
            speakText("Bingo incorrecto. ¡Ánimo!");
            
            selectedCells = [];
            fullBingoCells.forEach(cell => {
                cell.classList.remove('selected', 'missing');
            });
            
            isPaused = false;
            pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar';
            startBallCalling();
            startMotivationalMessages();
            
            // Guardar estado del juego
            saveCompleteGameState();
        }, 300);
    }
    
    function showCelebration() {
        if (confirm("¿Estás seguro de que quieres finalizar el bingo? Se mostrará una pantalla de celebración con todos los ganadores.")) {
            // Pausar el juego
            clearInterval(gameInterval);
            isPaused = true;
            
            // Mostrar pantalla de celebración con animación
            gameScreen.classList.remove('active');
            setTimeout(() => {
                gameScreen.style.display = 'none';
                celebrationScreen.style.display = 'block';
                overlay.style.display = 'block';
                setTimeout(() => {
                    celebrationScreen.classList.add('active');
                    overlay.classList.add('active');
                    
                    // Crear confeti
                    createConfetti();
                    
                    // Mostrar ganadores
                    displayWinnersCelebration();
                    
                    // Reproducir mensajes de voz
                    playCelebrationMessages();
                }, 100);
            }, 300);
        }
    }
    
    function createConfetti() {
        const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#d35400'];
        
        for (let i = 0; i < 150; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
            document.body.appendChild(confetti);
            
            // Eliminar confeti después de la animación
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
        
        // Agregar estilos para la animación de caída
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fall {
                0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
                100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    function displayWinnersCelebration() {
        winnersCelebration.innerHTML = '';
        
        if (gameStats.winners.length === 0) {
            winnersCelebration.innerHTML = `
                <div class="celebration-message">
                    ¡Gracias a todos por participar!
                </div>
                <div class="celebration-message">
                    En esta ocasión no hubo ganadores, pero en la próxima puedes ser tú.
                </div>
            `;
        } else {
            // Mostrar los últimos 5 ganadores
            const recentWinners = gameStats.winners.slice(0, 5);
            
            recentWinners.forEach(winner => {
                const winnerItem = document.createElement('div');
                winnerItem.className = 'winner-celebration-item';
                winnerItem.innerHTML = `
                    <strong>${winner.name}</strong> - ${winner.mode} (${winner.date})
                `;
                winnersCelebration.appendChild(winnerItem);
            });
        }
        
        finalMessage.innerHTML = `
            <div class="celebration-message">
                ¡Gracias a todos por participar!
            </div>
            <div class="celebration-message">
                Para la próxima puedes ser tú el ganador
            </div>
        `;
    }
    
    function playCelebrationMessages() {
        if (gameStats.winners.length === 0) {
            speakText("¡Gracias a todos por participar! En esta ocasión no hubo ganadores, pero en la próxima puedes ser tú.");
        } else {
            // Anunciar ganadores
            const recentWinners = gameStats.winners.slice(0, 3);
            let winnersText = "¡Felicidades a los ganadores! ";
            
            recentWinners.forEach((winner, index) => {
                winnersText += `${winner.name}. `;
            });
            
            winnersText += "¡Gracias a todos por participar! Para la próxima puedes ser tú el ganador.";
            
            speakText(winnersText);
        }
    }
    
    function updateStatistics() {
        // Actualizar estadísticas generales
        generalStats.innerHTML = `
            <li><span>Total de Partidas:</span> <span>${gameStats.totalGames}</span></li>
            <li><span>Total de Ganadores:</span> <span>${gameStats.totalWinners}</span></li>
            <li><span>Balotas Cantadas:</span> <span>${gameStats.totalBallsCalled}</span></li>
            <li><span>Tiempo Total de Juego:</span> <span>${formatTime(totalElapsedTime)}</span></li>
        `;
        
        // Actualizar lista de ganadores
        winnersList.innerHTML = '';
        if (gameStats.winners.length === 0) {
            winnersList.innerHTML = '<p style="text-align: center; color: #7f8c8d;">No hay ganadores registrados</p>';
        } else {
            gameStats.winners.slice(0, 10).forEach(winner => {
                const winnerItem = document.createElement('div');
                winnerItem.className = 'winner-item';
                winnerItem.innerHTML = `
                    <div class="winner-name">${winner.name}</div>
                    <div class="winner-mode">${winner.mode}</div>
                    <div class="winner-date">${winner.date}</div>
                `;
                winnersList.appendChild(winnerItem);
            });
        }
        
        // Actualizar estadísticas de modos
        modeStats.innerHTML = '';
        const modes = Object.keys(gameStats.modeUsage);
        if (modes.length === 0) {
            modeStats.innerHTML = '<li>No hay datos de modos</li>';
        } else {
            modes.forEach(mode => {
                const modeName = getModeName(mode);
                const usage = gameStats.modeUsage[mode];
                modeStats.innerHTML += `<li><span>${modeName}:</span> <span>${usage}</span></li>`;
            });
        }
        
        // Actualizar historial de partidas
        gameHistory.innerHTML = '';
        if (gameStats.gameHistory.length === 0) {
            gameHistory.innerHTML = '<li>No hay historial de partidas</li>';
        } else {
            gameStats.gameHistory.forEach(game => {
                gameHistory.innerHTML += `
                    <li>
                        <span>${game.date}</span>
                        <span>${game.mode} - ${game.winner}</span>
                    </li>
                `;
            });
        }
    }
    
    function getBallLetter(number) {
        if (number <= 15) return 'B';
        if (number <= 30) return 'I';
        if (number <= 45) return 'N';
        if (number <= 60) return 'G';
        return 'O';
    }
    
    function speakBall(number) {
        const letter = getBallLetter(number);
        const text = `${letter} ${number}`;
        
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance();
            speech.text = text;
            speech.volume = 1;
            speech.rate = 0.9;
            speech.pitch = 1.1;
            window.speechSynthesis.speak(speech);
        }
    }
    
    function speakText(text) {
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance();
            speech.text = text;
            speech.volume = 1;
            speech.rate = 0.9;
            speech.pitch = 1.1;
            window.speechSynthesis.speak(speech);
        }
    }
    
    function startPersistentTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(function() {
            totalElapsedTime++;
            localStorage.setItem('totalElapsedTime', totalElapsedTime);
            
            // Calcular horas, minutos y segundos
            const hours = Math.floor(totalElapsedTime / 3600);
            const minutes = Math.floor((totalElapsedTime % 3600) / 60);
            const seconds = totalElapsedTime % 60;
            
            // Formatear el tiempo
            if (hours > 0) {
                timerElement.textContent = 
                    (hours < 10 ? '0' + hours : hours) + ':' + 
                    (minutes < 10 ? '0' + minutes : minutes) + ':' + 
                    (seconds < 10 ? '0' + seconds : seconds);
            } else {
                timerElement.textContent = 
                    (minutes < 10 ? '0' + minutes : minutes) + ':' + 
                    (seconds < 10 ? '0' + seconds : seconds);
            }
            
        }, 1000);
    }
    
    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    }
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    function getModeName(mode) {
        // Buscar en modos predefinidos
        const predefinedMode = predefinedModes.find(m => m.id === mode);
        if (predefinedMode) return predefinedMode.name;
        
        // Buscar en modos personalizados
        const customMode = customModes.find(m => m.id === mode);
        if (customMode) return customMode.name;
        
        return 'Desconocido';
    }
    // FUNCIÓN CORREGIDA PARA MARCAR BALOTAS EN EL HISTORIAL
function markBallInHistory(number, animate = true) {
    console.log('Intentando marcar balota:', number);
    
    // Primero, limpiar cualquier animación anterior
    if (recentBallCell) {
        recentBallCell.classList.remove('recent');
        recentBallCell.classList.add('called');
        recentBallCell = null;
    }
    
    // Buscar y marcar la nueva balota
    let found = false;
    historyBingoCells.forEach(cell => {
        const cellNumber = parseInt(cell.textContent);
        if (cellNumber === number) {
            found = true;
            
            // Si ya está marcada como 'called', no hacer nada
            if (cell.classList.contains('called')) {
                console.log('Balota ya estaba marcada:', number);
                return;
            }
            
            if (animate) {
                cell.classList.add('recent');
                recentBallCell = cell;
                
                // Remover la animación después de 3 segundos
                setTimeout(() => {
                    if (cell.classList.contains('recent')) {
                        cell.classList.remove('recent');
                        cell.classList.add('called');
                        recentBallCell = null;
                    }
                }, 3000);
            } else {
                // Si no estamos animando, simplemente marcar como llamada
                cell.classList.add('called');
            }
            console.log('Balota marcada correctamente:', number);
        }
    });
    
    if (!found) {
        console.log('Balota no encontrada en el historial:', number);
    }
}

// FUNCIÓN MEJORADA PARA OBTENER LA PRÓXIMA BALOTA
function getNextBall() {
    const ballIndex = Math.floor(Math.random() * availableBalls.length);
    const ballNumber = availableBalls[ballIndex];
    availableBalls.splice(ballIndex, 1);
    calledBalls.push(ballNumber);
    previousBall = currentBall;
    currentBall = ballNumber;
    const ballLetter = getBallLetter(ballNumber);
    
    // Actualizar la balota anterior
    if (previousBall) {
        const prevBallLetter = getBallLetter(previousBall);
        prevBallLetterElement.textContent = prevBallLetter;
        prevBallNumberElement.textContent = previousBall;
    }
    
    // Actualizar la balota actual
    ballLetterElement.textContent = ballLetter;
    ballNumberElement.textContent = ballNumber;
    
    // Animación de la balota actual
    currentBallElement.classList.add('active');
    
    // IMPORTANTE: Marcar SOLO la balota actual en el historial
    markBallInHistory(ballNumber, true);
    
    // Actualizar contadores
    totalBallsElement.textContent = calledBalls.length;
    remainingElement.textContent = availableBalls.length;
    
    // Anunciar la balota
    speakBallTwice(ballNumber);
    
    // Guardar estado del juego
    saveCompleteGameState();
    
    // Remover animación después de 500ms
    setTimeout(() => {
        currentBallElement.classList.remove('active');
    }, 500);
}

// FUNCIÓN MEJORADA PARA INICIALIZAR LA UI DEL JUEGO
function initializeGameUI() {
    totalBallsElement.textContent = '0';
    remainingElement.textContent = '75';
    gameModeElement.textContent = getModeName(selectedMode);
    
    ballLetterElement.textContent = 'B';
    ballNumberElement.textContent = '00';
    prevBallLetterElement.textContent = 'B';
    prevBallNumberElement.textContent = '00';
    currentBallElement.classList.remove('active');
    
    // Limpiar completamente el historial de balotas
    historyBingoCells.forEach(cell => {
        cell.classList.remove('called', 'recent');
    });
    
    // Resetear la referencia a la balota reciente
    recentBallCell = null;
}

// FUNCIÓN MEJORADA PARA RESTAURAR EL JUEGO
function restoreGame() {
    if (!gameState) return;
    
    console.log('Restaurando juego con balotas:', gameState.calledBalls);
    
    // Restaurar estado del juego
    availableBalls = gameState.availableBalls || [];
    calledBalls = gameState.calledBalls || [];
    currentBall = gameState.currentBall;
    previousBall = gameState.previousBall;
    selectedMode = gameState.selectedMode;
    isPaused = gameState.isPaused;

    // Resetear la referencia a la balota reciente
    recentBallCell = null;

    // Mostrar pantalla de juego directamente
    gameScreen.style.display = 'block';
    welcomeScreen.style.display = 'none';
    instructionsScreen.style.display = 'none';
    modeScreen.style.display = 'none';

    // Inicializar elementos de UI
    initializeGameUI();

    // Actualizar UI con datos guardados
    totalBallsElement.textContent = calledBalls.length;
    remainingElement.textContent = availableBalls.length;
    gameModeElement.textContent = getModeName(selectedMode);

    if (previousBall) {
        const prevBallLetter = getBallLetter(previousBall);
        prevBallLetterElement.textContent = prevBallLetter;
        prevBallNumberElement.textContent = previousBall;
    }

    if (currentBall) {
        const ballLetter = getBallLetter(currentBall);
        ballLetterElement.textContent = ballLetter;
        ballNumberElement.textContent = currentBall;
    }

    // Marcar TODAS las balotas en el historial (sin animación)
    console.log('Marcando balotas en historial:', calledBalls);
    calledBalls.forEach(number => {
        markBallInHistory(number, false); // false = no animar
    });

    // Reanudar el juego si no estaba pausado
    if (!isPaused) {
        startBallCalling();
        startMotivationalMessages();
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar';
    } else {
        pauseBtn.innerHTML = '<i class="fas fa-play"></i> Reanudar';
        gameMessageElement.textContent = 'Juego en pausa';
    }

    // Aplicar animación de entrada
    setTimeout(() => {
        gameScreen.classList.add('active');
    }, 100);
}
});