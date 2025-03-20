const CONTRACT_ADDRESS = "0xEA5C91604D7713C0344364D3c2aB0bA9B71c750D"; // Replace with your new deployed address
const provider = new ethers.providers.Web3Provider(window.ethereum);
let signer;
let contract;
let userAddress;

// Update ABI after redeploying the contract in Remix
const ABI = [{ "type": "event", "name": "NewRound", "inputs": [{ "name": "roundId", "type": "uint256", "components": null, "internalType": null, "indexed": false }, { "name": "prompt", "type": "string", "components": null, "internalType": null, "indexed": false }], "anonymous": false }, { "type": "event", "name": "NewDrawing", "inputs": [{ "name": "roundId", "type": "uint256", "components": null, "internalType": null, "indexed": false }, { "name": "artist", "type": "address", "components": null, "internalType": null, "indexed": false }, { "name": "imageURL", "type": "string", "components": null, "internalType": null, "indexed": false }], "anonymous": false }, { "type": "event", "name": "NewVote", "inputs": [{ "name": "roundId", "type": "uint256", "components": null, "internalType": null, "indexed": false }, { "name": "artist", "type": "address", "components": null, "internalType": null, "indexed": false }, { "name": "voter", "type": "address", "components": null, "internalType": null, "indexed": false }, { "name": "score", "type": "uint256", "components": null, "internalType": null, "indexed": false }], "anonymous": false }, { "type": "event", "name": "RoundEnded", "inputs": [{ "name": "roundId", "type": "uint256", "components": null, "internalType": null, "indexed": false }, { "name": "winner", "type": "address", "components": null, "internalType": null, "indexed": false }, { "name": "reward", "type": "uint256", "components": null, "internalType": null, "indexed": false }], "anonymous": false }, { "type": "function", "name": "addPrompt", "stateMutability": "nonpayable", "inputs": [{ "name": "_prompt", "type": "string", "components": null, "internalType": null }], "outputs": [] }, { "type": "constructor", "stateMutability": "nonpayable", "inputs": [] }, { "type": "function", "name": "submitDrawing", "stateMutability": "payable", "inputs": [{ "name": "imageURL", "type": "string", "components": null, "internalType": null }], "outputs": [] }, { "type": "function", "name": "voteOnDrawing", "stateMutability": "nonpayable", "inputs": [{ "name": "artist", "type": "address", "components": null, "internalType": null }, { "name": "score", "type": "uint8", "components": null, "internalType": null }], "outputs": [] }, { "type": "function", "name": "getDrawingsForRound", "stateMutability": "view", "inputs": [{ "name": "roundId", "type": "uint256", "components": null, "internalType": null }], "outputs": [{ "name": "", "type": "address[]", "components": null, "internalType": null }] }, { "type": "function", "name": "getDrawingDetails", "stateMutability": "view", "inputs": [{ "name": "roundId", "type": "uint256", "components": null, "internalType": null }, { "name": "artist", "type": "address", "components": null, "internalType": null }], "outputs": [{ "name": "", "type": "string", "components": null, "internalType": null }, { "name": "", "type": "string", "components": null, "internalType": null }, { "name": "", "type": "uint256", "components": null, "internalType": null }, { "name": "", "type": "uint256", "components": null, "internalType": null }] }, { "type": "function", "name": "getCurrentPrompt", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "string", "components": null, "internalType": null }] }, { "type": "function", "name": "getRoundInfo", "stateMutability": "view", "inputs": [{ "name": "roundId", "type": "uint256", "components": null, "internalType": null }], "outputs": [{ "name": "", "type": "string", "components": null, "internalType": null }, { "name": "", "type": "uint256", "components": null, "internalType": null }, { "name": "", "type": "uint256", "components": null, "internalType": null }, { "name": "", "type": "bool", "components": null, "internalType": null }, { "name": "", "type": "uint256", "components": null, "internalType": null }] }, { "type": "function", "name": "withdraw", "stateMutability": "nonpayable", "inputs": [], "outputs": [] }, { "type": "function", "name": "initializeRound", "stateMutability": "nonpayable", "inputs": [], "outputs": [] }, { "type": "function", "name": "owner", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "address", "components": null, "internalType": null }] }, { "type": "function", "name": "currentRound", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "components": null, "internalType": null }] }, { "type": "function", "name": "minEntryFee", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "components": null, "internalType": null }] }, { "type": "function", "name": "rounds", "stateMutability": "view", "inputs": [{ "name": "arg0", "type": "uint256", "components": null, "internalType": null }], "outputs": [{ "name": "", "type": "tuple", "components": [{ "name": "prompt", "type": "string", "components": null, "internalType": null }, { "name": "startTime", "type": "uint256", "components": null, "internalType": null }, { "name": "endTime", "type": "uint256", "components": null, "internalType": null }, { "name": "active", "type": "bool", "components": null, "internalType": null }, { "name": "entryFee", "type": "uint256", "components": null, "internalType": null }], "internalType": null }] }, { "type": "function", "name": "drawings", "stateMutability": "view", "inputs": [{ "name": "arg0", "type": "uint256", "components": null, "internalType": null }, { "name": "arg1", "type": "address", "components": null, "internalType": null }], "outputs": [{ "name": "", "type": "tuple", "components": [{ "name": "artist", "type": "address", "components": null, "internalType": null }, { "name": "imageURL", "type": "string", "components": null, "internalType": null }, { "name": "prompt", "type": "string", "components": null, "internalType": null }, { "name": "totalScore", "type": "uint256", "components": null, "internalType": null }, { "name": "voterCount", "type": "uint256", "components": null, "internalType": null }, { "name": "exists", "type": "bool", "components": null, "internalType": null }, { "name": "submissionTime", "type": "uint256", "components": null, "internalType": null }], "internalType": null }] }, { "type": "function", "name": "roundParticipants", "stateMutability": "view", "inputs": [{ "name": "arg0", "type": "uint256", "components": null, "internalType": null }, { "name": "arg1", "type": "uint256", "components": null, "internalType": null }], "outputs": [{ "name": "", "type": "address", "components": null, "internalType": null }] }, { "type": "function", "name": "hasVoted", "stateMutability": "view", "inputs": [{ "name": "arg0", "type": "uint256", "components": null, "internalType": null }, { "name": "arg1", "type": "address", "components": null, "internalType": null }, { "name": "arg2", "type": "address", "components": null, "internalType": null }], "outputs": [{ "name": "", "type": "bool", "components": null, "internalType": null }] }, { "type": "function", "name": "promptCount", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "components": null, "internalType": null }] }, { "type": "function", "name": "prompts", "stateMutability": "view", "inputs": [{ "name": "arg0", "type": "uint256", "components": null, "internalType": null }], "outputs": [{ "name": "", "type": "string", "components": null, "internalType": null }] }];

async function initContract() {
    signer = provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    userAddress = await signer.getAddress();
    console.log("Contract initialized with user:", userAddress);
    updateUI();
    updateWalletUI();
    checkAdmin();
}

function updateWalletUI() {
    document.getElementById('walletAddress').textContent = `Connected: ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
    document.getElementById('walletAddress').classList.remove('hidden');
    document.getElementById('connectWallet').classList.add('hidden');
    document.getElementById('notConnectedWarning').classList.add('hidden');
}

async function connectWallet() {
    if (!window.ethereum) {
        showNotification('Error', 'MetaMask is not installed!');
        return;
    }
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length === 0) {
            showNotification('Error', 'No accounts found.');
            return;
        }
        await initContract();
        showNotification('Success', 'Wallet connected!');
    } catch (error) {
        showNotification('Error', error.message);
    }
}

document.getElementById('connectWallet').addEventListener('click', connectWallet);

// Automatically connect if MetaMask is already authorized
async function autoConnect() {
    if (!window.ethereum) {
        showNotification('Error', 'MetaMask is not installed!');
        return;
    }
    try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            await initContract();
            showNotification('Success', 'Wallet automatically connected!');
        } else {
            document.getElementById('notConnectedWarning').classList.remove('hidden');
        }
    } catch (error) {
        showNotification('Error', 'Failed to auto-connect: ' + error.message);
    }
}

// Listen for account changes in MetaMask
if (window.ethereum) {
    window.ethereum.on('accountsChanged', async (accounts) => {
        if (accounts.length > 0) {
            await initContract();
            showNotification('Success', 'Wallet account changed!');
        } else {
            userAddress = null;
            document.getElementById('walletAddress').classList.add('hidden');
            document.getElementById('connectWallet').classList.remove('hidden');
            document.getElementById('notConnectedWarning').classList.remove('hidden');
            document.getElementById('adminControls').classList.add('hidden');
            showNotification('Info', 'Wallet disconnected.');
        }
    });

    window.ethereum.on('chainChanged', () => {
        window.location.reload(); // Reload the page if the network changes
    });
}

async function checkAdmin() {
    try {
        const owner = await contract.owner();
        if (owner.toLowerCase() === userAddress.toLowerCase()) {
            document.getElementById('adminControls').classList.remove('hidden');
        }
    } catch (error) {
        console.error("Check admin failed:", error);
    }
}

async function updateUI() {
    try {
        let currentRound = await contract.currentRound();
        console.log("Current round:", currentRound.toString());

        // Check if there's an active round
        let roundInfo;
        let prompt;
        let startTime;
        let endTime;
        let active;
        let entryFee;

        try {
            console.log("Fetching round info for round:", currentRound.toString());
            roundInfo = await contract.getRoundInfo(currentRound);
            prompt = roundInfo[0];
            startTime = roundInfo[1].toNumber();
            endTime = roundInfo[2].toNumber();
            active = roundInfo[3];
            entryFee = ethers.utils.formatEther(roundInfo[4]);
            console.log("Round info:", { prompt, startTime, endTime, active, entryFee });
            console.log("Current timestamp:", Math.floor(Date.now() / 1000));
            console.log("Is round active based on time?", Math.floor(Date.now() / 1000) < endTime);
            console.log("Is round active based on flag?", active);
            console.log("Final condition (active && time check):", active && Math.floor(Date.now() / 1000) < endTime);
        } catch (error) {
            console.error("Error fetching round info:", error);
            active = false;
            showNotification('Error', 'Failed to fetch round info: ' + error.message);
        }

        // Update DOM elements
        const currentPromptElement = document.getElementById('currentPrompt');
        const submissionPromptElement = document.getElementById('submissionPrompt');
        const submissionFeeElement = document.getElementById('submissionFee');
        const currentRoundNumberElement = document.getElementById('currentRoundNumber');
        const submissionSectionElement = document.getElementById('submissionSection');
        const noActiveRoundElement = document.getElementById('noActiveRound');
        const roundTimerElement = document.getElementById('roundTimer');

        if (!currentPromptElement || !submissionPromptElement || !submissionFeeElement ||
            !currentRoundNumberElement || !submissionSectionElement ||
            !noActiveRoundElement || !roundTimerElement) {
            console.error("One or more DOM elements not found.");
            return;
        }

        if (active && Math.floor(Date.now() / 1000) < endTime) {
            console.log("Round is active, updating UI...");
            const displayPrompt = prompt || "No prompt available";
            currentPromptElement.textContent = `Current Prompt: ${displayPrompt}`;
            submissionPromptElement.textContent = displayPrompt;
            submissionFeeElement.textContent = entryFee;
            currentRoundNumberElement.textContent = currentRound.toString();
            submissionSectionElement.classList.remove('hidden');
            noActiveRoundElement.classList.add('hidden');
            updateTimer(endTime);
            loadDrawings(currentRound);
        } else {
            console.log("Round is not active or has ended.");
            try {
                console.log("Fetching daily prompt...");
                const dailyPrompt = await contract.getDailyPrompt();
                console.log("Daily prompt:", dailyPrompt);
                const displayDailyPrompt = dailyPrompt || "No prompts available";
                currentPromptElement.textContent = `Today's Prompt: ${displayDailyPrompt}`;
            } catch (e) {
                console.error("Error fetching daily prompt:", e);
                currentPromptElement.textContent = `No prompts available`;
            }
            submissionSectionElement.classList.add('hidden');
            noActiveRoundElement.classList.remove('hidden');
            roundTimerElement.textContent = 'No active round';
        }

        // Try to get drawings for the current round
        try {
            const drawing = await contract.drawings(currentRound, userAddress);
            if (drawing.exists) {
                const alreadySubmittedElement = document.getElementById('alreadySubmitted');
                const yourSubmissionElement = document.getElementById('yourSubmission');
                if (submissionSectionElement && alreadySubmittedElement && yourSubmissionElement) {
                    submissionSectionElement.classList.add('hidden');
                    alreadySubmittedElement.classList.remove('hidden');
                    yourSubmissionElement.src = drawing.imageURL;
                }
            }

            const participants = await contract.getDrawingsForRound(currentRound);
            const totalSubmissionsElement = document.getElementById('totalSubmissions');
            if (totalSubmissionsElement) {
                totalSubmissionsElement.textContent = participants.length;
            }

            try {
                const roundInfo = await contract.getRoundInfo(currentRound);
                const prizePoolElement = document.getElementById('prizePool');
                if (prizePoolElement) {
                    prizePoolElement.textContent = ethers.utils.formatEther(roundInfo[4].mul(participants.length));
                }
            } catch (e) {
                const prizePoolElement = document.getElementById('prizePool');
                if (prizePoolElement) {
                    prizePoolElement.textContent = "0";
                }
            }
        } catch (error) {
            console.error("Error fetching drawings:", error);
            const totalSubmissionsElement = document.getElementById('totalSubmissions');
            const prizePoolElement = document.getElementById('prizePool');
            if (totalSubmissionsElement) totalSubmissionsElement.textContent = "0";
            if (prizePoolElement) prizePoolElement.textContent = "0";
        }
    } catch (error) {
        console.error('Error updating UI:', error);
        const currentPromptElement = document.getElementById('currentPrompt');
        const submissionSectionElement = document.getElementById('submissionSection');
        const noActiveRoundElement = document.getElementById('noActiveRound');
        if (currentPromptElement) currentPromptElement.textContent = `No active round`;
        if (submissionSectionElement) submissionSectionElement.classList.add('hidden');
        if (noActiveRoundElement) noActiveRoundElement.classList.remove('hidden');
    }
}

function updateTimer(endTime) {
    const interval = setInterval(() => {
        const now = Math.floor(Date.now() / 1000);
        const timeLeft = endTime - now;
        if (timeLeft > 0) {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            document.getElementById('roundTimer').textContent = `Time Left: ${minutes}m ${seconds}s`;
            document.getElementById('timeRemaining').textContent = `${minutes}m ${seconds}s`;
        } else {
            document.getElementById('roundTimer').textContent = 'Round has ended';
            document.getElementById('timeRemaining').textContent = 'Round Ended';
            clearInterval(interval);
            updateUI();
        }
    }, 1000);
}

document.getElementById('addPromptBtn').addEventListener('click', async () => {
    const newPrompt = document.getElementById('newPromptInput').value;
    if (!newPrompt) {
        showNotification('Error', 'Please enter a prompt');
        return;
    }
    try {
        const tx = await contract.addPrompt(newPrompt);
        await tx.wait();
        showNotification('Success', 'Prompt added successfully!');
        document.getElementById('newPromptInput').value = '';
        updateUI();
    } catch (error) {
        showNotification('Error', 'Failed to add prompt: ' + error.message);
    }
});

async function loadDrawings(roundId) {
    const gallery = document.getElementById('drawingsGallery');
    gallery.innerHTML = '';
    try {
        const participants = await contract.getDrawingsForRound(roundId);
        for (const artist of participants) {
            const drawing = await contract.drawings(roundId, artist);
            const hasVoted = await contract.hasVoted(roundId, artist, userAddress);
            const card = `
                <div class="bg-gray-50 rounded-lg p-4 shadow">
                    <img src="${drawing.imageURL}" alt="Drawing" class="w-full h-48 object-cover rounded-md mb-2">
                    <p class="text-sm text-gray-600">Artist: ${artist.slice(0, 6)}...${artist.slice(-4)}</p>
                    <p class="text-sm text-gray-600">Score: ${drawing.totalScore.toString()} (${drawing.voterCount.toString()} votes)</p>
                    ${!hasVoted ? `<button class="vote-btn mt-2 bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700" data-artist="${artist}">Vote</button>` : ''}
                </div>
            `;
            gallery.innerHTML += card;
        }
        document.querySelectorAll('.vote-btn').forEach(btn => {
            btn.addEventListener('click', () => openVoteModal(btn.dataset.artist, btn.closest('div').querySelector('img').src));
        });
    } catch (error) {
        console.error('Error loading drawings:', error);
    }
}

let selectedScore = 0;
function openVoteModal(artist, imageUrl) {
    document.getElementById('voteModal').classList.remove('hidden');
    document.getElementById('voteImage').src = imageUrl;
    selectedScore = 0;
    document.getElementById('submitVote').disabled = true;

    document.querySelectorAll('.vote-score-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedScore = parseInt(btn.dataset.score);
            document.getElementById('submitVote').disabled = false;
            document.querySelectorAll('.vote-score-btn').forEach(b => b.classList.remove('bg-indigo-200'));
            btn.classList.add('bg-indigo-200');
        });
    });

    document.getElementById('submitVote').onclick = async () => {
        try {
            const tx = await contract.voteOnDrawing(artist, selectedScore);
            await tx.wait();
            showNotification('Success', 'Vote submitted!');
            document.getElementById('voteModal').classList.add('hidden');
            updateUI();
        } catch (error) {
            showNotification('Error', 'Failed to vote: ' + error.message);
        }
    };

    document.getElementById('cancelVote').onclick = () => {
        document.getElementById('voteModal').classList.add('hidden');
    };
}

function showNotification(title, message) {
    const notification = document.getElementById('notification');
    document.getElementById('notificationTitle').textContent = title;
    document.getElementById('notificationMessage').textContent = message;
    notification.classList.remove('hidden');
    notification.classList.remove('translate-y-full');
    setTimeout(() => {
        notification.classList.add('translate-y-full');
        setTimeout(() => notification.classList.add('hidden'), 300);
    }, 5000);
    document.getElementById('closeNotification').onclick = () => {
        notification.classList.add('translate-y-full');
        setTimeout(() => notification.classList.add('hidden'), 300);
    };
}

async function loadPastRounds() {
    const pastRoundsList = document.getElementById('pastRoundsList');
    pastRoundsList.innerHTML = '';
    try {
        const currentRound = await contract.currentRound();
        for (let i = 0; i < currentRound; i++) {
            const roundInfo = await contract.getRoundInfo(i);
            const winnerEvent = await contract.queryFilter('RoundEnded', 0, 'latest');
            const winner = winnerEvent.find(e => e.args.roundId.toNumber() === i)?.args.winner || 'No winner';
            pastRoundsList.innerHTML += `
                <div class="bg-gray-50 p-4 rounded">
                    <p>Round ${i}: ${roundInfo[0]}</p>
                    <p>Winner: ${winner.slice(0, 6)}...${winner.slice(-4)}</p>
                    <p>Reward: ${ethers.utils.formatEther(roundInfo[4].mul(await contract.getDrawingsForRound(i).length))} ETH</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading past rounds:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Automatically attempt to connect on page load
    autoConnect();

    // Insert the "Manage Prompts" section
    const adminControls = document.getElementById('adminControls');
    if (adminControls) {
        adminControls.insertAdjacentHTML('beforeend', `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                    <input type="number" id="duration" value="60" min="5" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Entry Fee (ETH)</label>
                    <input type="number" id="entryFee" value="0.01" min="0.01" step="0.01" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2">
                </div>
                <div class="flex items-end">
                    <button id="startNewRound" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">Start New Round</button>
                </div>
            </div>
            <button id="endCurrentRound" class="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">End Current Round</button>
        `);
        const startNewRoundBtn = document.getElementById('startNewRound');
        const endCurrentRoundBtn = document.getElementById('endCurrentRound');

        if (startNewRoundBtn) {
            startNewRoundBtn.addEventListener('click', async () => {
                const duration = document.getElementById('duration').value;
                const entryFee = document.getElementById('entryFee').value;
                if (!duration || !entryFee) {
                    showNotification('Error', 'Please fill all fields');
                    return;
                }
                try {
                    const tx = await contract.startNewRound(duration, ethers.utils.parseEther(entryFee));
                    await tx.wait();
                    showNotification('Success', 'New round started!');
                    updateUI();
                } catch (error) {
                    showNotification('Error', 'Failed to start round: ' + error.message);
                }
            });
        } else {
            console.error("startNewRound button not found");
        }

        if (endCurrentRoundBtn) {
            endCurrentRoundBtn.addEventListener('click', async () => {
                try {
                    const tx = await contract.endRound();
                    await tx.wait();
                    showNotification('Success', 'Round ended!');
                    updateUI();
                } catch (error) {
                    showNotification('Error', 'Failed to end round: ' + error.message);
                }
            });
        } else {
            console.error("endCurrentRound button not found");
        }
    } else {
        console.error("adminControls element not found");
    }
});