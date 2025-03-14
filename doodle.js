// app.js
const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE"; // Replace with your deployed contract address
const provider = new ethers.providers.Web3Provider(window.ethereum);
let signer;
let contract;
let userAddress;

// ABI from your provided JSON
const ABI = [/* Paste your pretty-printed ABI here */]; // Replace with the ABI you provided earlier

// Initialize contract
async function initContract() {
    signer = provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    userAddress = await signer.getAddress();
    updateUI();
}

// Wallet connection
document.getElementById('connectWallet').addEventListener('click', async () => {
    if (!window.ethereum) {
        // If MetaMask is not installed
        showNotification('Error', 'MetaMask is not installed! Please install MetaMask to connect your wallet.');
        return;
    }

    try {
        // Request account access, which opens MetaMask
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length === 0) {
            showNotification('Error', 'No accounts found. Please connect an account in MetaMask.');
            return;
        }

        await initContract();
        document.getElementById('walletAddress').textContent = `Connected: ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
        document.getElementById('walletAddress').classList.remove('hidden');
        document.getElementById('connectWallet').classList.add('hidden');
        document.getElementById('notConnectedWarning').classList.add('hidden');
        showNotification('Success', 'Wallet connected successfully!');
        checkAdmin();
    } catch (error) {
        if (error.code === 4001) {
            // User rejected the request
            showNotification('Error', 'You rejected the connection request in MetaMask.');
        } else {
            showNotification('Error', 'Failed to connect wallet: ' + error.message);
        }
    }
});

// Check if user is admin (contract owner)
async function checkAdmin() {
    const owner = await contract.owner();
    if (owner.toLowerCase() === userAddress.toLowerCase()) {
        document.getElementById('adminControls').classList.remove('hidden');
    }
}

// Update UI with current round info
async function updateUI() {
    try {
        const currentRound = await contract.currentRound();
        const roundInfo = await contract.getRoundInfo(currentRound);
        const prompt = roundInfo[0];
        const startTime = roundInfo[1].toNumber();
        const endTime = roundInfo[2].toNumber();
        const active = roundInfo[3];
        const entryFee = ethers.utils.formatEther(roundInfo[4]);

        document.getElementById('currentPrompt').textContent = `Current Prompt: ${prompt}`;
        document.getElementById('submissionPrompt').textContent = prompt;
        document.getElementById('submissionFee').textContent = entryFee;
        document.getElementById('currentRoundNumber').textContent = currentRound.toString();

        if (active) {
            document.getElementById('submissionSection').classList.remove('hidden');
            document.getElementById('noActiveRound').classList.add('hidden');
            updateTimer(endTime);
            loadDrawings(currentRound);
        } else {
            document.getElementById('submissionSection').classList.add('hidden');
            document.getElementById('noActiveRound').classList.remove('hidden');
            document.getElementById('roundTimer').textContent = 'Round has ended';
        }

        // Check if user has submitted
        const drawing = await contract.drawings(currentRound, userAddress);
        if (drawing.exists) {
            document.getElementById('submissionSection').classList.add('hidden');
            document.getElementById('alreadySubmitted').classList.remove('hidden');
            document.getElementById('yourSubmission').src = drawing.imageURL;
        }

        // Update contest info
        const participants = await contract.getDrawingsForRound(currentRound);
        document.getElementById('totalSubmissions').textContent = participants.length;
        document.getElementById('prizePool').textContent = ethers.utils.formatEther(roundInfo[4].mul(participants.length));
    } catch (error) {
        console.error('Error updating UI:', error);
    }
}

// Timer update
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

// Start new round (Admin)
document.getElementById('startNewRound').addEventListener('click', async () => {
    const prompt = document.getElementById('newPrompt').value;
    const duration = document.getElementById('duration').value;
    const entryFee = document.getElementById('entryFee').value;

    if (!prompt || !duration || !entryFee) {
        showNotification('Error', 'Please fill all fields');
        return;
    }

    try {
        const tx = await contract.startNewRound(prompt, duration, ethers.utils.parseEther(entryFee));
        await tx.wait();
        showNotification('Success', 'New round started!');
        updateUI();
    } catch (error) {
        showNotification('Error', 'Failed to start round: ' + error.message);
    }
});

// End current round (Admin)
document.getElementById('endCurrentRound').addEventListener('click', async () => {
    try {
        const tx = await contract.endRound();
        await tx.wait();
        showNotification('Success', 'Round ended!');
        updateUI();
    } catch (error) {
        showNotification('Error', 'Failed to end round: ' + error.message);
    }
});

// Submit drawing
document.getElementById('submitDrawing').addEventListener('click', async () => {
    const imageUrl = document.getElementById('imageUrl').value;
    if (!imageUrl) {
        showNotification('Error', 'Please provide an image URL');
        return;
    }

    try {
        const roundInfo = await contract.getRoundInfo(await contract.currentRound());
        const entryFee = roundInfo[4];
        const tx = await contract.submitDrawing(imageUrl, { value: entryFee });
        await tx.wait();
        showNotification('Success', 'Drawing submitted!');
        updateUI();
    } catch (error) {
        showNotification('Error', 'Failed to submit drawing: ' + error.message);
    }
});

// Load drawings for gallery
async function loadDrawings(roundId) {
    const gallery = document.getElementById('drawingsGallery');
    gallery.innerHTML = '';
    const participants = await contract.getDrawingsForRound(roundId);

    for (const artist of participants) {
        const drawing = await contract.drawings(roundId, artist);
        const hasVoted = await contract.hasVoted(roundId, artist, userAddress);
        const card = `
            <div class="bg-gray-50 rounded-lg p-4 shadow">
                <img src="${drawing.imageURL}" alt="Drawing" class="w-full h-48 object-cover rounded-md mb-2">
                <p class="text-sm text-gray-600">Artist: ${artist.slice(0, 6)}...${artist.slice(-4)}</p>
                <p class="text-sm text-gray-600">Score: ${drawing.totalScore.toString()} (${drawing.voterCount.toString()} votes)</p>
                ${!hasVoted && roundInfo[3] ? `<button class="vote-btn mt-2 bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700" data-artist="${artist}">Vote</button>` : ''}
            </div>
        `;
        gallery.innerHTML += card;
    }

    // Add vote button listeners
    document.querySelectorAll('.vote-btn').forEach(btn => {
        btn.addEventListener('click', () => openVoteModal(btn.dataset.artist, drawing.imageURL));
    });
}

// Voting modal
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

// Notification system
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

// Load past rounds (basic implementation)
async function loadPastRounds() {
    const pastRoundsList = document.getElementById('pastRoundsList');
    pastRoundsList.innerHTML = '';
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
}

// Initial load
if (window.ethereum) {
    window.ethereum.on('accountsChanged', () => location.reload());
    // Check if already connected
    window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
        if (accounts.length > 0) {
            initContract().then(() => {
                document.getElementById('walletAddress').textContent = `Connected: ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
                document.getElementById('walletAddress').classList.remove('hidden');
                document.getElementById('connectWallet').classList.add('hidden');
                loadPastRounds();
            });
        }
    });
} else {
    document.getElementById('notConnectedWarning').classList.remove('hidden');
    document.getElementById('notConnectedWarning').textContent = 'MetaMask is not installed. Please install MetaMask to participate in the drawing contest.';
}