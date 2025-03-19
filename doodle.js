const CONTRACT_ADDRESS = "0x2c96382A2f78500aD5cE12BB075a3eb3ac9AA679"; // Update with your new address
const provider = new ethers.providers.Web3Provider(window.ethereum);
let signer;
let contract;
let userAddress;

const ABI = [{"type":"event","name":"NewRound","inputs":[{"name":"roundId","type":"uint256","components":null,"internalType":null,"indexed":false},{"name":"prompt","type":"string","components":null,"internalType":null,"indexed":false}],"anonymous":false},{"type":"event","name":"NewDrawing","inputs":[{"name":"roundId","type":"uint256","components":null,"internalType":null,"indexed":false},{"name":"artist","type":"address","components":null,"internalType":null,"indexed":false},{"name":"imageURL","type":"string","components":null,"internalType":null,"indexed":false}],"anonymous":false},{"type":"event","name":"NewVote","inputs":[{"name":"roundId","type":"uint256","components":null,"internalType":null,"indexed":false},{"name":"artist","type":"address","components":null,"internalType":null,"indexed":false},{"name":"voter","type":"address","components":null,"internalType":null,"indexed":false},{"name":"score","type":"uint256","components":null,"internalType":null,"indexed":false}],"anonymous":false},{"type":"event","name":"RoundEnded","inputs":[{"name":"roundId","type":"uint256","components":null,"internalType":null,"indexed":false},{"name":"winner","type":"address","components":null,"internalType":null,"indexed":false},{"name":"reward","type":"uint256","components":null,"internalType":null,"indexed":false}],"anonymous":false},{"type":"function","name":"addPrompt","stateMutability":"nonpayable","inputs":[{"name":"_prompt","type":"string","components":null,"internalType":null}],"outputs":[]},{"type":"constructor","stateMutability":"nonpayable","inputs":[]},{"type":"function","name":"startNewRound","stateMutability":"nonpayable","inputs":[{"name":"durationInMinutes","type":"uint256","components":null,"internalType":null},{"name":"entryFee","type":"uint256","components":null,"internalType":null}],"outputs":[]},{"type":"function","name":"submitDrawing","stateMutability":"payable","inputs":[{"name":"imageURL","type":"string","components":null,"internalType":null}],"outputs":[]},{"type":"function","name":"voteOnDrawing","stateMutability":"nonpayable","inputs":[{"name":"artist","type":"address","components":null,"internalType":null},{"name":"score","type":"uint8","components":null,"internalType":null}],"outputs":[]},{"type":"function","name":"endRound","stateMutability":"nonpayable","inputs":[],"outputs":[]},{"type":"function","name":"getDrawingsForRound","stateMutability":"view","inputs":[{"name":"roundId","type":"uint256","components":null,"internalType":null}],"outputs":[{"name":"","type":"address[]","components":null,"internalType":null}]},{"type":"function","name":"getDrawingDetails","stateMutability":"view","inputs":[{"name":"roundId","type":"uint256","components":null,"internalType":null},{"name":"artist","type":"address","components":null,"internalType":null}],"outputs":[{"name":"","type":"string","components":null,"internalType":null},{"name":"","type":"string","components":null,"internalType":null},{"name":"","type":"uint256","components":null,"internalType":null},{"name":"","type":"uint256","components":null,"internalType":null}]},{"type":"function","name":"getCurrentPrompt","stateMutability":"view","inputs":[],"outputs":[{"name":"","type":"string","components":null,"internalType":null}]},{"type":"function","name":"getRoundInfo","stateMutability":"view","inputs":[{"name":"roundId","type":"uint256","components":null,"internalType":null}],"outputs":[{"name":"","type":"string","components":null,"internalType":null},{"name":"","type":"uint256","components":null,"internalType":null},{"name":"","type":"uint256","components":null,"internalType":null},{"name":"","type":"bool","components":null,"internalType":null},{"name":"","type":"uint256","components":null,"internalType":null}]},{"type":"function","name":"withdraw","stateMutability":"nonpayable","inputs":[],"outputs":[]},{"type":"function","name":"owner","stateMutability":"view","inputs":[],"outputs":[{"name":"","type":"address","components":null,"internalType":null}]},{"type":"function","name":"currentRound","stateMutability":"view","inputs":[],"outputs":[{"name":"","type":"uint256","components":null,"internalType":null}]},{"type":"function","name":"minEntryFee","stateMutability":"view","inputs":[],"outputs":[{"name":"","type":"uint256","components":null,"internalType":null}]},{"type":"function","name":"rounds","stateMutability":"view","inputs":[{"name":"arg0","type":"uint256","components":null,"internalType":null}],"outputs":[{"name":"","type":"tuple","components":[{"name":"prompt","type":"string","components":null,"internalType":null},{"name":"startTime","type":"uint256","components":null,"internalType":null},{"name":"endTime","type":"uint256","components":null,"internalType":null},{"name":"active","type":"bool","components":null,"internalType":null},{"name":"entryFee","type":"uint256","components":null,"internalType":null}],"internalType":null}]},{"type":"function","name":"drawings","stateMutability":"view","inputs":[{"name":"arg0","type":"uint256","components":null,"internalType":null},{"name":"arg1","type":"address","components":null,"internalType":null}],"outputs":[{"name":"","type":"tuple","components":[{"name":"artist","type":"address","components":null,"internalType":null},{"name":"imageURL","type":"string","components":null,"internalType":null},{"name":"prompt","type":"string","components":null,"internalType":null},{"name":"totalScore","type":"uint256","components":null,"internalType":null},{"name":"voterCount","type":"uint256","components":null,"internalType":null},{"name":"exists","type":"bool","components":null,"internalType":null},{"name":"submissionTime","type":"uint256","components":null,"internalType":null}],"internalType":null}]},{"type":"function","name":"roundParticipants","stateMutability":"view","inputs":[{"name":"arg0","type":"uint256","components":null,"internalType":null},{"name":"arg1","type":"uint256","components":null,"internalType":null}],"outputs":[{"name":"","type":"address","components":null,"internalType":null}]},{"type":"function","name":"hasVoted","stateMutability":"view","inputs":[{"name":"arg0","type":"uint256","components":null,"internalType":null},{"name":"arg1","type":"address","components":null,"internalType":null},{"name":"arg2","type":"address","components":null,"internalType":null}],"outputs":[{"name":"","type":"bool","components":null,"internalType":null}]},{"type":"function","name":"promptCount","stateMutability":"view","inputs":[],"outputs":[{"name":"","type":"uint256","components":null,"internalType":null}]},{"type":"function","name":"prompts","stateMutability":"view","inputs":[{"name":"arg0","type":"uint256","components":null,"internalType":null}],"outputs":[{"name":"","type":"string","components":null,"internalType":null}]}];

async function initContract() {
    signer = provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    userAddress = await signer.getAddress();
    console.log("Contract initialized with user:", userAddress);
    updateUI();
}

document.getElementById('connectWallet').addEventListener('click', async () => {
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
        document.getElementById('walletAddress').textContent = `Connected: ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
        document.getElementById('walletAddress').classList.remove('hidden');
        document.getElementById('connectWallet').classList.add('hidden');
        document.getElementById('notConnectedWarning').classList.add('hidden');
        showNotification('Success', 'Wallet connected!');
        checkAdmin();
    } catch (error) {
        showNotification('Error', error.message);
    }
});

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
        const currentRound = await contract.currentRound();
        console.log("Current round:", currentRound.toString());
        const roundInfo = await contract.getRoundInfo(currentRound);
        const prompt = roundInfo[0];
        const startTime = roundInfo[1].toNumber();
        const endTime = roundInfo[2].toNumber();
        const active = roundInfo[3];
        const entryFee = ethers.utils.formatEther(roundInfo[4]);

        if (active) {
            document.getElementById('currentPrompt').textContent = `Current Prompt: ${prompt}`;
            document.getElementById('submissionPrompt').textContent = prompt;
            document.getElementById('submissionFee').textContent = entryFee;
            document.getElementById('currentRoundNumber').textContent = currentRound.toString();
            document.getElementById('submissionSection').classList.remove('hidden');
            document.getElementById('noActiveRound').classList.add('hidden');
            updateTimer(endTime);
            loadDrawings(currentRound);
        } else {
            const dailyPrompt = await contract.getDailyPrompt();
            document.getElementById('currentPrompt').textContent = `Today's Prompt: ${dailyPrompt}`;
            document.getElementById('submissionSection').classList.add('hidden');
            document.getElementById('noActiveRound').classList.remove('hidden');
            document.getElementById('roundTimer').textContent = 'No active round';
        }

        const drawing = await contract.drawings(currentRound, userAddress);
        if (drawing.exists) {
            document.getElementById('submissionSection').classList.add('hidden');
            document.getElementById('alreadySubmitted').classList.remove('hidden');
            document.getElementById('yourSubmission').src = drawing.imageURL;
        }

        const participants = await contract.getDrawingsForRound(currentRound);
        document.getElementById('totalSubmissions').textContent = participants.length;
        document.getElementById('prizePool').textContent = ethers.utils.formatEther(roundInfo[4].mul(participants.length));
    } catch (error) {
        console.error('Error updating UI:', error);
        document.getElementById('currentPrompt').textContent = `Error: ${error.message}`;
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

document.getElementById('startNewRound').addEventListener('click', async () => {
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

document.getElementById('adminControls').insertAdjacentHTML('beforeend', `
    <div class="mt-4">
        <h3 class="text-lg font-semibold mb-2">Manage Prompts</h3>
        <input type="text" id="newPromptInput" placeholder="Enter new prompt" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 mb-2">
        <button id="addPromptBtn" class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">Add Prompt</button>
    </div>
`);

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

if (window.ethereum) {
    window.ethereum.on('accountsChanged', () => location.reload());
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
}