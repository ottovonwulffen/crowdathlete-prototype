// Mock Database and State Management
const DEFAULT_STATE = {
    currentUserEmail: null,
    currentUserType: null, // 'athlete' or 'investor'
    activeView: 'landing',

    // Investor State (Mocking a simple DB where we'd lookup by email)
    investors: {
        // 'test@investor.com': { balance, riskProfile, portfolio }
    },

    // Athlete State (Lookup by email)
    athletes: {
        // 'test@athlete.com': { name, sport, goal, raised, plan, earnings, revenueShare, videoUrl }
    },

    // Mock Database of Athletes in the Market
    marketAthletes: [
        {
            id: 'a1',
            name: 'Carlos Silva',
            sport: 'Tennis',
            country: 'Chile',
            fundingGoal: 15000,
            amountRaised: 8500,
            sharesTotal: 1000,
            sharePrice: 15,
            stats: { winRate: '82%', rank: 'Top 50 ITF' },
            riskLevel: 'high',
            bio: 'Aiming for the professional ATP tour next year. Won the South American U18 championship.',
            image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?fit=crop&w=500&q=80',
            plan: {
                useOfFunds: 'Full time coaching and travel for the ITF Futures circuit over the next 12 months.',
                timePeriod: '12 Months',
                estEarnings: 45000,
                revenueShare: 12
            },
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' // Mock placeholder
        },
        {
            id: 'a2',
            name: 'Sofia Gomez',
            sport: 'Track',
            country: 'Colombia',
            fundingGoal: 8000,
            amountRaised: 2000,
            sharesTotal: 500,
            sharePrice: 16,
            stats: { pb: '11.2s 100m', rank: 'National Champ' },
            riskLevel: 'medium',
            bio: 'Sprinter targeting the Pan American games. Need funding for elite coaching and travel.',
            image: 'https://images.unsplash.com/photo-1552674605-1a8fb1de3e15?fit=crop&w=500&q=80',
            plan: {
                useOfFunds: 'Moving to a high-altitude training camp in Bogota for 6 months prior to qualifications.',
                timePeriod: '6 Months',
                estEarnings: 20000,
                revenueShare: 8
            },
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        {
            id: 'a3',
            name: 'Diego Costa',
            sport: 'Soccer',
            country: 'Brazil',
            fundingGoal: 20000,
            amountRaised: 18000,
            sharesTotal: 1000,
            sharePrice: 20,
            stats: { goals: '24 this season', club: 'Santos Acad' },
            riskLevel: 'low',
            bio: 'Scouted by European clubs. Seeking capital to finalize move and secure independent representation.',
            image: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?fit=crop&w=500&q=80',
            plan: {
                useOfFunds: 'Relocation expenses to Europe, legal representation fees, and physical therapy for 1 year.',
                timePeriod: '1 Year',
                estEarnings: 150000,
                revenueShare: 5
            },
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        }
    ],

    // Mock Secondary Market Orders
    secondaryMarket: [
        { id: 'o1', athleteId: 'a3', sellerId: 'inv_123', shares: 10, price: 22, type: 'sell' },
        { id: 'o2', athleteId: 'a1', sellerId: 'inv_456', shares: 5, price: 14, type: 'sell' }
    ]
};

// Initialize or Load State
let STATE = JSON.parse(localStorage.getItem('crowdAthleteDB')) || DEFAULT_STATE;

// Helper to save state
const saveState = () => {
    localStorage.setItem('crowdAthleteDB', JSON.stringify(STATE));
};

// Core Application Logic
const app = {
    // Initialize application
    init() {
        lucide.createIcons();
        if (STATE.currentUserEmail && STATE.currentUserType) {
            // Restore session
            this.showToast(`Welcome back, ${STATE.currentUserEmail.split('@')[0]}!`);
            this.navigate(STATE.currentUserType === 'investor' ? 'marketplace' : 'athlete-dashboard');
        } else {
            this.navigate('landing');
        }
    },

    // Navigation and Routing
    navigate(viewId) {
        // Hide all views
        document.querySelectorAll('.view').forEach(el => {
            el.classList.remove('active');
            el.classList.add('hidden');
        });

        // Show target view
        const target = document.getElementById(`view-${viewId}`);
        if (target) {
            target.classList.remove('hidden');
            target.classList.add('active');
        }

        STATE.activeView = viewId;

        // Update Nav
        if (viewId !== 'landing') {
            document.getElementById('main-nav').classList.remove('hidden');
        } else {
            document.getElementById('main-nav').classList.add('hidden');
        }

        // View specific logic triggers
        this.triggerViewLogic(viewId);
        this.renderNavbar();
    },

    triggerViewLogic(viewId) {
        switch (viewId) {
            case 'marketplace':
                this.renderMarketplace();
                break;
            case 'portfolio':
                this.renderPortfolio();
                break;
            case 'secondary-market':
                this.renderSecondaryMarket();
                break;
            case 'edit-profile':
                this.populateEditProfile();
                break;
            case 'edit-investor-profile':
                this.populateInvestorEditProfile();
                break;
        }
    },

    // UI Updates
    renderNavbar() {
        const linksContainer = document.getElementById('nav-links-container');
        const profileContainer = document.getElementById('nav-user-profile');

        if (STATE.currentUserType === 'investor') {
            const inv = STATE.investors[STATE.currentUserEmail];
            linksContainer.innerHTML = `
                <a onclick="app.navigate('marketplace')" class="${STATE.activeView === 'marketplace' ? 'active-link' : ''}">Marketplace</a>
                <a onclick="app.navigate('portfolio')" class="${STATE.activeView === 'portfolio' ? 'active-link' : ''}">Portfolio</a>
                <a onclick="app.navigate('secondary-market')" class="${STATE.activeView === 'secondary-market' ? 'active-link' : ''}">Trading Floor</a>
            `;
            profileContainer.innerHTML = `
                <span class="wallet-badge">$${inv ? inv.balance.toLocaleString() : '0'}</span>
                <i data-lucide="user"></i>
                <button class="btn secondary sm" style="margin-left: 1rem;" onclick="app.logout()"><i data-lucide="log-out"></i></button>
            `;
        } else if (STATE.currentUserType === 'athlete') {
            const ath = STATE.athletes[STATE.currentUserEmail];
            linksContainer.innerHTML = `
                <a onclick="app.navigate('athlete-dashboard')" class="active-link">Dashboard</a>
            `;
            profileContainer.innerHTML = `
                <span>${ath ? ath.name : 'Athlete'}</span>
                <i data-lucide="award"></i>
                <button class="btn secondary sm" style="margin-left: 1rem;" onclick="app.logout()"><i data-lucide="log-out"></i></button>
            `;
        }
        lucide.createIcons();
    },

    showToast(message, type = "success") {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i data-lucide="${type === 'success' ? 'check-circle' : 'info'}"></i> <span>${message}</span>`;
        document.getElementById('toast-container').appendChild(toast);
        lucide.createIcons();

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // --- AUTHENTICATION ---

    viewLogin(type) {
        document.getElementById('auth-type').value = type;
        document.getElementById('auth-title').innerText = type === 'investor' ? 'Investor Login' : 'Athlete Login';
        this.navigate('login');
    },

    submitAuth(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const type = formData.get('type');

        STATE.currentUserEmail = email;
        STATE.currentUserType = type;

        if (type === 'investor') {
            // Check if exists
            if (!STATE.investors[email]) {
                // Registering new investor
                STATE.investors[email] = {
                    balance: 10000,
                    riskProfile: null,
                    portfolio: []
                };
                saveState();
                this.navigate('onboarding-investor');
            } else {
                saveState();
                this.showToast('Logged in successfully');
                this.navigate('marketplace');
            }
        } else {
            // Athlete login
            if (!STATE.athletes[email]) {
                // Registering new athlete
                STATE.athletes[email] = null; // null means no profile yet
                saveState();
                this.navigate('onboarding-athlete-wizard');
            } else {
                saveState();
                this.showToast('Logged in successfully');
                this.navigate('athlete-dashboard');
            }
        }
    },

    logout() {
        STATE.currentUserEmail = null;
        STATE.currentUserType = null;
        saveState();
        this.navigate('landing');
        this.showToast('Logged out');
    },

    // --- INVESTOR LOGIC ---

    submitRiskTest(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const riskScore = formData.get('q1') === 'high' ? 'high' : formData.get('q1') === 'medium' ? 'medium' : 'low';

        STATE.investors[STATE.currentUserEmail].riskProfile = riskScore;
        saveState();

        this.showToast('Profile analyzed! Finding your matches...');
        this.navigate('marketplace');
    },

    calculateMatchScore(athlete) {
        const inv = STATE.investors[STATE.currentUserEmail];
        if (!inv || !inv.riskProfile) return 50;

        let score = 50;
        const invRisk = inv.riskProfile;
        const athRisk = athlete.riskLevel;

        if (invRisk === athRisk) {
            score = 90 + Math.floor(Math.random() * 10);
        } else if (
            (invRisk === 'high' && athRisk === 'medium') ||
            (invRisk === 'medium' && (athRisk === 'high' || athRisk === 'low')) ||
            (invRisk === 'low' && athRisk === 'medium')
        ) {
            score = 65 + Math.floor(Math.random() * 15);
        } else {
            score = 30 + Math.floor(Math.random() * 20);
        }
        return score;
    },

    renderMarketplace() {
        const grid = document.getElementById('athlete-grid');
        grid.innerHTML = '';

        STATE.marketAthletes.forEach(athlete => {
            const matchScore = this.calculateMatchScore(athlete);
            const progress = (athlete.amountRaised / athlete.fundingGoal) * 100;

            const card = document.createElement('div');
            card.className = 'card athlete-card';
            card.innerHTML = `
                <div class="athlete-image" style="background-image: url('${athlete.image}')">
                    <div class="match-score">${matchScore}% Match</div>
                </div>
                <div class="athlete-info">
                    <h3>${athlete.name}</h3>
                    <p class="stat-label">${athlete.sport} • ${athlete.country}</p>
                    
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${progress}%"></div>
                    </div>
                    <div class="progress-stats">
                        <span>$${athlete.amountRaised.toLocaleString()}</span>
                        <span>$${athlete.fundingGoal.toLocaleString()}</span>
                    </div>

                    <div class="athlete-stats">
                        <div class="stat">
                            <span class="stat-label">Share Price</span>
                            <span class="stat-val">$${athlete.sharePrice}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Risk Level</span>
                            <span class="stat-val" style="text-transform: capitalize;">${athlete.riskLevel}</span>
                        </div>
                    </div>
                    
                    <button class="btn primary full-width" onclick="app.viewAthleteDetails('${athlete.id}')">View & Invest</button>
                </div>
            `;
            grid.appendChild(card);
        });
    },

    viewAthleteDetails(id) {
        const athlete = STATE.marketAthletes.find(a => a.id === id);
        if (!athlete) return;

        const container = document.getElementById('athlete-profile-container');
        const matchScore = this.calculateMatchScore(athlete);
        const progress = (athlete.amountRaised / athlete.fundingGoal) * 100;

        // Generate stats string
        let statsHtml = '';
        if (athlete.stats) {
            Object.entries(athlete.stats).forEach(([key, val]) => {
                statsHtml += `
                <div class="stat">
                    <span class="stat-label" style="text-transform: capitalize;">${key}</span>
                    <span class="stat-val">${val}</span>
                </div>`;
            });
        }

        // Generate Plan HTML
        let planHtml = '';
        if (athlete.plan) {
            planHtml = `
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; border-radius: var(--radius-md); margin-top: 1.5rem;">
                <h4 style="margin-top: 0; color: var(--color-accent);">The Masterplan</h4>
                <p><strong>Goal:</strong> ${athlete.plan.useOfFunds}</p>
                <div style="display: flex; gap: 2rem; margin-top: 1rem;">
                    <div>
                        <span class="stat-label">Timeline</span>
                        <div class="stat-val">${athlete.plan.timePeriod}</div>
                    </div>
                    <div>
                        <span class="stat-label">Est. Earnings</span>
                        <div class="stat-val">$${athlete.plan.estEarnings ? athlete.plan.estEarnings.toLocaleString() : 'N/A'}</div>
                    </div>
                </div>
            </div>`;
        }

        // Generate Video HTML
        let videoHtml = '';
        if (athlete.videoUrl) {
            videoHtml = `
           <h4 class="mt-4">Highlights</h4>
           <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; border-radius: var(--radius-md); margin-top: 1rem; border: 1px solid rgba(255,255,255,0.1);">
              <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="${athlete.videoUrl}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
           </div>
           `;
        }

        container.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem;">
                <h2>${athlete.name}</h2>
                <button class="btn secondary sm" onclick="app.navigate('marketplace')"><i data-lucide="arrow-left"></i> Back</button>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                <!-- Left Column: Story & Proof -->
                <div class="card athlete-card" style="padding-bottom: 2rem;">
                    <div class="athlete-image" style="background-image: url('${athlete.image}'); height: 300px;">
                        <div class="match-score">${matchScore}% Match</div>
                    </div>
                    <div class="athlete-info">
                        <h3>About</h3>
                        <p>${athlete.bio || athlete.name + ' is raising funds on CrowdAthlete.'}</p>
                        
                        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; border-radius: var(--radius-md); margin-top: 1.5rem; display: flex; gap: 2rem;">
                            <div>
                                <span class="stat-label">Birthday</span>
                                <div class="stat-val" style="font-size: 1.1rem;">${athlete.birthday || 'N/A'}</div>
                            </div>
                            <div>
                                <span class="stat-label">Age</span>
                                <div class="stat-val" style="font-size: 1.1rem;">${athlete.birthday ? Math.floor((new Date() - new Date(athlete.birthday).getTime()) / 3.15576e+10) : 'N/A'}</div>
                            </div>
                            <div>
                                <span class="stat-label">Country</span>
                                <div class="stat-val" style="font-size: 1.1rem;">${athlete.country || 'N/A'}</div>
                            </div>
                        </div>

                        ${planHtml}
                        
                        <h4 class="mt-4">Track Record</h4>
                        <div class="athlete-stats" style="margin-top: 0.5rem; padding-top: 0.5rem; border: none;">
                            ${statsHtml}
                        </div>
                        
                        ${videoHtml}
                    </div>
                </div>

                <!-- Right Column: Investment Contract -->
                <div class="card">
                    <h3>Investment Thesis</h3>
                    <p>Securing early rights to ${athlete.name}'s future winnings via a Smart Contract revenue-share model.</p>
                    
                    <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid var(--color-accent); padding: 1.5rem; border-radius: var(--radius-md); text-align: center; margin: 1.5rem 0;">
                        <div style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">Athlete's Offered Revenue Share</div>
                        <div style="font-size: 2.5rem; font-weight: 800; color: var(--color-accent);">${athlete.plan ? athlete.plan.revenueShare : 10}%</div>
                    </div>
                    
                    <div class="progress-bar-container large">
                        <div class="progress-bar" style="width: ${progress}%"></div>
                    </div>
                    <div class="progress-stats mb-4">
                        <span>$${athlete.amountRaised.toLocaleString()} Raised</span>
                        <span>$${athlete.fundingGoal.toLocaleString()} Goal</span>
                    </div>

                    <h4 class="mt-4" style="color: var(--color-accent); font-size: 1.1rem; margin-bottom: 0.5rem;">Simulated ROI Scenarios</h4>
                    <p style="font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 1rem;">Based on a $10,000 investment for ${athlete.plan ? athlete.plan.revenueShare : 10}% Revenue Share</p>
                    <table style="width: 100%; text-align: left; border-collapse: collapse; margin-bottom: 1.5rem; background: rgba(0,0,0,0.2); border-radius: var(--radius-md); overflow: hidden;">
                        <thead>
                            <tr style="background: rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.1);">
                                <th style="padding: 0.75rem; font-size: 0.85rem; color: var(--color-text-muted); font-weight: 600;">Scenario</th>
                                <th style="padding: 0.75rem; font-size: 0.85rem; color: var(--color-text-muted); font-weight: 600;">Est. Career Earnings</th>
                                <th style="padding: 0.75rem; font-size: 0.85rem; color: var(--color-text-muted); font-weight: 600;">Investor Return</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                                <td style="padding: 0.75rem; font-size: 0.9rem;">Conservative</td>
                                <td style="padding: 0.75rem; font-size: 0.9rem;">€200,000</td>
                                <td style="padding: 0.75rem; font-size: 0.9rem; font-weight: 700;">€${(200000 * (athlete.plan ? athlete.plan.revenueShare / 100 : 0.1)).toLocaleString()}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                                <td style="padding: 0.75rem; font-size: 0.9rem;">Moderate</td>
                                <td style="padding: 0.75rem; font-size: 0.9rem;">€800,000</td>
                                <td style="padding: 0.75rem; font-size: 0.9rem; font-weight: 700; color: var(--color-accent);">€${(800000 * (athlete.plan ? athlete.plan.revenueShare / 100 : 0.1)).toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td style="padding: 0.75rem; font-size: 0.9rem;">Breakout</td>
                                <td style="padding: 0.75rem; font-size: 0.9rem;">€5,000,000</td>
                                <td style="padding: 0.75rem; font-size: 0.9rem; font-weight: 700; color: var(--color-accent);">€${(5000000 * (athlete.plan ? athlete.plan.revenueShare / 100 : 0.1)).toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div style="background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: var(--radius-md); margin: 2rem 0;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                            <span>Share Price</span>
                            <strong>$${athlete.sharePrice}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                            <span>Available Shares</span>
                            <strong>${athlete.sharesTotal - Math.floor(athlete.amountRaised / athlete.sharePrice)}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem;">
                            <span>Your Balance</span>
                            <strong class="text-green">$${STATE.investors[STATE.currentUserEmail] ? STATE.investors[STATE.currentUserEmail].balance.toLocaleString() : 0}</strong>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Shares to Purchase</label>
                        <input type="number" id="invest-shares" value="10" min="1" max="100" onchange="document.getElementById('invest-total').innerText = '$' + (this.value * ${athlete.sharePrice})">
                    </div>
                    
                    <button class="btn primary full-width" style="margin-top: 1rem;" onclick="app.investInAthlete('${athlete.id}', ${athlete.sharePrice})">
                        Invest <span id="invest-total">$${athlete.sharePrice * 10}</span>
                    </button>
                    <p style="text-align: center; font-size: 0.8rem; color: var(--color-text-muted); margin-top: 1rem;">By investing, you agree to the Smart Contract terms securing your proportion of the ${athlete.plan ? athlete.plan.revenueShare : 10}% revenue share.</p>
                </div>
            </div>
        `;

        this.navigate('athlete-profile');
        lucide.createIcons();
    },

    investInAthlete(id, price) {
        const sharesInput = document.getElementById('invest-shares');
        const shares = parseInt(sharesInput.value);
        if (isNaN(shares) || shares <= 0) return this.showToast('Invalid shares amount', 'error');

        const totalCost = shares * price;
        const inv = STATE.investors[STATE.currentUserEmail];

        if (inv.balance < totalCost) {
            return this.showToast('Insufficient balance', 'error');
        }

        // Deduct balance
        inv.balance -= totalCost;

        // Add to portfolio
        const existing = inv.portfolio.find(p => p.athleteId === id);
        if (existing) {
            existing.sharesOwned += shares;
            existing.investedAmount += totalCost;
        } else {
            inv.portfolio.push({
                athleteId: id,
                sharesOwned: shares,
                investedAmount: totalCost
            });
        }

        // Update Athlete logic
        const athlete = STATE.marketAthletes.find(a => a.id === id);
        if (athlete) {
            athlete.amountRaised += totalCost;
        }

        this.showToast(`Successfully invested $${totalCost} in ${athlete.name}!`);
        this.renderNavbar(); // update wallet balance
        this.navigate('portfolio');
    },

    renderPortfolio() {
        const inv = STATE.investors[STATE.currentUserEmail];
        if (!inv) return;

        // Support Legacy referencing STATE.investor for backwards compatibility in existing session states if needed
        STATE.investor = inv;

        // Calculate totals
        let totalInvested = 0;
        inv.portfolio.forEach(p => { totalInvested += p.investedAmount; });

        document.getElementById('port-total-invested').innerText = `$${totalInvested.toLocaleString()}`;
        document.getElementById('port-athletes-backed').innerText = inv.portfolio.length;

        const list = document.getElementById('portfolio-holdings');
        list.innerHTML = '';

        if (inv.portfolio.length === 0) {
            list.innerHTML = '<p class="text-center mt-4">You have not backed any athletes yet. Visit the Marketplace to discover talent.</p>';
            return;
        }

        inv.portfolio.forEach(holding => {
            const athlete = STATE.marketAthletes.find(a => a.id === holding.athleteId);
            if (!athlete) return;

            // Simulating price appreciation based on risk
            const currentPrice = athlete.sharePrice + (athlete.riskLevel === 'high' ? 4 : 2);
            const currentValue = holding.sharesOwned * currentPrice;
            const profitStr = currentValue > holding.investedAmount ? `+$${(currentValue - holding.investedAmount).toLocaleString()}` : `-$${(holding.investedAmount - currentValue).toLocaleString()}`;
            const profitClass = currentValue >= holding.investedAmount ? 'text-green' : 'text-danger';

            const item = document.createElement('div');
            item.className = 'list-item fade-in';
            item.innerHTML = `
                <div class="list-item-main">
                    <div class="athlete-avatar" style="background-image: url('${athlete.image}')"></div>
                    <div>
                        <h4 style="margin: 0;">${athlete.name}</h4>
                        <span style="font-size: 0.85rem; color: var(--color-text-muted);">${holding.sharesOwned} Shares</span>
                    </div>
                </div>
                <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem;">
                    <div>
                        <div style="font-weight: 700;">$${currentValue.toLocaleString()}</div>
                        <div class="${profitClass}" style="font-size: 0.85rem;">${profitStr} Returns</div>
                    </div>
                    <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                        <button class="btn secondary sm" onclick="app.viewAthleteDetails('${holding.athleteId}')">View Profile</button>
                        <button class="btn secondary sm" onclick="app.listOnSecondary('${holding.athleteId}')">List on Market</button>
                    </div>
                </div>
            `;
            list.appendChild(item);
        });
    },

    listOnSecondary(athleteId) {
        const athlete = STATE.marketAthletes.find(a => a.id === athleteId);
        if (!athlete) return;

        const holding = STATE.investor.portfolio.find(p => p.athleteId === athleteId);
        if (!holding || holding.sharesOwned <= 0) return this.showToast('You do not own shares to sell.', 'error');

        // Simple prompt UI for simulation
        const sellAmountStr = prompt(`How many shares of ${athlete.name} do you want to list? (You own ${holding.sharesOwned})`, holding.sharesOwned);
        if (sellAmountStr === null) return; // User cancelled

        const sellAmount = parseInt(sellAmountStr);
        if (isNaN(sellAmount) || sellAmount <= 0 || sellAmount > holding.sharesOwned) {
            return this.showToast('Invalid share amount.', 'error');
        }

        const currentEstPrice = athlete.sharePrice + (athlete.riskLevel === 'high' ? 4 : 2);
        const askingPriceStr = prompt(`What is your asking price per share? (Suggested: $${currentEstPrice})`, currentEstPrice);
        if (askingPriceStr === null) return;

        const askingPrice = parseFloat(askingPriceStr);
        if (isNaN(askingPrice) || askingPrice <= 0) {
            return this.showToast('Invalid asking price.', 'error');
        }

        // Deduct from portfolio
        holding.sharesOwned -= sellAmount;

        // Adjust investedAmount proportionally
        const ratioSold = sellAmount / (holding.sharesOwned + sellAmount);
        holding.investedAmount = holding.investedAmount * (1 - ratioSold);

        // Remove holding array item if empty
        if (holding.sharesOwned <= 0) {
            STATE.investor.portfolio = STATE.investor.portfolio.filter(p => p.athleteId !== athleteId);
        }

        // Add to Secondary Market orders
        STATE.secondaryMarket.push({
            id: 'o_' + Date.now(),
            athleteId: athleteId,
            sellerId: STATE.currentUserEmail, // The current user
            shares: sellAmount,
            price: askingPrice,
            type: 'sell'
        });

        saveState();
        this.showToast(`Listed ${sellAmount} shares of ${athlete.name} for sale at $${askingPrice}/share!`);
        this.renderPortfolio(); // Refresh view
    },

    renderSecondaryMarket() {
        const grid = document.getElementById('secondary-market-grid');
        grid.innerHTML = '';

        STATE.secondaryMarket.forEach(order => {
            const athlete = STATE.marketAthletes.find(a => a.id === order.athleteId);
            if (!athlete) return;

            const card = document.createElement('div');
            card.className = 'card list-item fade-in';
            card.style.flexDirection = 'column';
            card.style.alignItems = 'flex-start';
            card.style.gap = '1rem';

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; width: 100%; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem;">
                    <div class="list-item-main">
                        <div class="athlete-avatar" style="background-image: url('${athlete.image}'); width: 40px; height: 40px;"></div>
                        <div>
                            <h4 style="margin: 0; font-size: 1.1rem;">${athlete.name}</h4>
                            <span style="font-size: 0.8rem; color: var(--color-accent); font-weight: 600;">FOR SALE</span>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <span style="font-size: 0.8rem; color: var(--color-text-muted);">Asking Price</span>
                        <div style="font-size: 1.5rem; font-weight: 800;">$${order.price} <span style="font-size: 0.9rem; font-weight: 400; color: var(--color-text-muted);">/ share</span></div>
                    </div>
                </div>
                
                <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                    <div>
                        <span style="color: var(--color-text-muted);">Available: </span>
                        <strong>${order.shares} Shares</strong>
                    </div>
                    <button class="btn secondary sm" onclick="app.buyFromSecondary('${order.id}', ${order.price}, ${order.shares}, '${athlete.id}')">
                        Buy Block ($${order.price * order.shares})
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
        lucide.createIcons(); // Render icons for the new content
    },

    buyFromSecondary(orderId, price, shares, athleteId) {
        const order = STATE.secondaryMarket.find(o => o.id === orderId);
        if (!order) return this.showToast('Order not found.', 'error');

        if (order.sellerId === STATE.currentUserEmail) {
            return this.showToast('You cannot buy your own listing.', 'error');
        }

        const totalCost = price * shares;
        const buyer = STATE.investors[STATE.currentUserEmail];

        if (buyer.balance < totalCost) {
            return this.showToast('Insufficient balance for this block trade.', 'error');
        }

        // Deduct balance from buyer
        buyer.balance -= totalCost;

        // Add to buyer's portfolio
        const buyerExisting = buyer.portfolio.find(p => p.athleteId === athleteId);
        if (buyerExisting) {
            buyerExisting.sharesOwned += shares;
            buyerExisting.investedAmount += totalCost;
        } else {
            buyer.portfolio.push({
                athleteId: athleteId,
                sharesOwned: shares,
                investedAmount: totalCost
            });
        }

        // Credit the seller's account with virtual funds
        if (STATE.investors[order.sellerId]) {
            STATE.investors[order.sellerId].balance += totalCost;
        }

        // Remove order
        STATE.secondaryMarket = STATE.secondaryMarket.filter(o => o.id !== orderId);

        saveState();

        const athlete = STATE.marketAthletes.find(a => a.id === athleteId);

        this.showToast(`Bought ${shares} shares of ${athlete.name} from secondary market!`);
        this.renderNavbar();
        this.renderSecondaryMarket();
    },

    // --- ATHLETE LOGIC ---

    nextWizardStep(currentStep, e) {
        if (e) e.preventDefault();

        // Hide current
        document.getElementById(`wiz-form-${currentStep}`).classList.add('hidden');
        document.getElementById(`wiz-step-${currentStep}`).classList.remove('text-green');
        document.getElementById(`wiz-step-${currentStep}`).style.fontWeight = 'normal';
        document.getElementById(`wiz-step-${currentStep}`).style.color = 'var(--color-text-muted)';

        const nextStep = currentStep + 1;

        // Calculate Contract details before showing step 4
        if (nextStep === 4) {
            this.calculateContractTerms();
        }

        // Show next
        document.getElementById(`wiz-form-${nextStep}`).classList.remove('hidden');
        document.getElementById(`wiz-step-${nextStep}`).classList.add('text-green');
        document.getElementById(`wiz-step-${nextStep}`).style.fontWeight = '700';
        document.getElementById(`wiz-step-${nextStep}`).style.color = '';
    },

    prevWizardStep(currentStep) {
        document.getElementById(`wiz-form-${currentStep}`).classList.add('hidden');
        document.getElementById(`wiz-step-${currentStep}`).classList.remove('text-green');
        document.getElementById(`wiz-step-${currentStep}`).style.fontWeight = 'normal';
        document.getElementById(`wiz-step-${currentStep}`).style.color = 'var(--color-text-muted)';

        const prevStep = currentStep - 1;

        document.getElementById(`wiz-form-${prevStep}`).classList.remove('hidden');
        document.getElementById(`wiz-step-${prevStep}`).classList.add('text-green');
        document.getElementById(`wiz-step-${prevStep}`).style.fontWeight = '700';
        document.getElementById(`wiz-step-${prevStep}`).style.color = '';
    },

    calculateContractTerms() {
        const goal = parseFloat(document.getElementById('wiz-goal').value);
        const earnings = parseFloat(document.getElementById('wiz-earnings').value);
        const time = document.getElementById('wiz-time').value;

        // Base Algorithm: (Requested / Est Earnings) * 100 to get raw %.
        // Add a "Risk Premium" of 50% (x 1.5) to ensure investors are rewarded for the risk.
        // Cap it at a maximum of 30% so it's not predatory.

        let calculatedShare = 0;
        if (earnings > 0) {
            let rawPct = (goal / earnings) * 100;
            calculatedShare = rawPct * 1.5; // Risk Premium

            if (calculatedShare > 30) calculatedShare = 30; // Max Cap
            if (calculatedShare < 1) calculatedShare = 1;   // Min Cap
        }

        const finalShare = parseFloat(calculatedShare.toFixed(1));

        document.getElementById('calc-goal').innerText = goal.toLocaleString();
        document.getElementById('calc-share').innerText = finalShare;
        document.getElementById('calc-time').innerText = time;

        // Store temp for submission
        window._tempContractShare = finalShare;
    },

    submitAthleteWizard(e) {
        e.preventDefault();

        // Compile all data
        const profileData = {
            email: STATE.currentUserEmail,
            name: document.getElementById('wiz-name').value,
            country: document.getElementById('wiz-country').value,
            birthday: document.getElementById('wiz-birthday').value,
            age: parseInt(document.getElementById('wiz-age').value),
            sport: document.getElementById('wiz-sport').value,
            image: document.getElementById('wiz-image').value || '',
            goal: parseFloat(document.getElementById('wiz-goal').value),
            raised: 0,
            stats: {
                stat1: document.getElementById('wiz-stat1').value,
                stat2: document.getElementById('wiz-stat2').value,
            },
            plan: {
                useOfFunds: document.getElementById('wiz-use').value,
                timePeriod: document.getElementById('wiz-time').value,
                estEarnings: parseFloat(document.getElementById('wiz-earnings').value),
                revenueShare: window._tempContractShare
            },
            bio: document.getElementById('wiz-bio').value,
            videoUrl: document.getElementById('wiz-video').value
        };

        const newId = 'a_' + Date.now();
        profileData.marketId = newId;

        // Save to Athlete State
        STATE.athletes[STATE.currentUserEmail] = profileData;

        // Add to Market Database
        STATE.marketAthletes.unshift({
            id: newId,
            name: profileData.name,
            sport: profileData.sport,
            country: profileData.country,
            birthday: profileData.birthday,
            fundingGoal: profileData.goal,
            amountRaised: 0,
            sharePrice: 10,  // Default starting price
            sharesTotal: Math.floor(profileData.goal / 10),
            stats: profileData.stats,
            riskLevel: 'high', // New profiles default to high risk
            bio: profileData.bio,
            image: profileData.image || 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?fit=crop&w=500&q=80',
            plan: profileData.plan,
            videoUrl: profileData.videoUrl
        });

        saveState();
        this.showToast('Contract Signed! Your profile is live.');
        this.navigate('athlete-dashboard');
        this.renderAthleteDashboard();
    },

    renderAthleteDashboard() {
        const ath = STATE.athletes[STATE.currentUserEmail];
        if (!ath) return;

        document.getElementById('dash-ath-name').innerText = `Welcome, ${ath.name}`;
        document.getElementById('dash-ath-raised').innerText = `$${ath.raised.toLocaleString()} raised`;
        document.getElementById('dash-ath-goal').innerText = `of $${ath.goal.toLocaleString()} goal`;

        const pct = ath.goal > 0 ? (ath.raised / ath.goal) * 100 : 0;
        document.getElementById('dash-ath-progress').style.width = `${pct}%`;
    },

    // Edit Profile Logic
    populateEditProfile() {
        const ath = STATE.athletes[STATE.currentUserEmail];
        if (!ath) return;

        document.getElementById('edit-name').value = ath.name || '';
        document.getElementById('edit-country').value = ath.country || '';
        document.getElementById('edit-birthday').value = ath.birthday || '';
        document.getElementById('edit-bio').value = ath.bio || '';
        document.getElementById('edit-use').value = ath.plan?.useOfFunds || '';
        document.getElementById('edit-image').value = ath.image || '';
        document.getElementById('edit-video').value = ath.videoUrl || '';
        document.getElementById('edit-stat1').value = ath.stats?.stat1 || '';
        document.getElementById('edit-stat2').value = ath.stats?.stat2 || '';

        // Ensure values are properly mapped visually if they had old formats
        if (ath.stats) {
            const keys = Object.keys(ath.stats);
            if (keys.length > 0 && !ath.stats.stat1) document.getElementById('edit-stat1').value = ath.stats[keys[0]] || '';
            if (keys.length > 1 && !ath.stats.stat2) document.getElementById('edit-stat2').value = ath.stats[keys[1]] || '';
        }
    },

    submitEditProfile(e) {
        e.preventDefault();

        const ath = STATE.athletes[STATE.currentUserEmail];
        if (!ath) return;

        // Update STATE.athletes
        ath.name = document.getElementById('edit-name').value;
        ath.country = document.getElementById('edit-country').value;
        ath.birthday = document.getElementById('edit-birthday').value;
        ath.bio = document.getElementById('edit-bio').value;
        if (ath.plan) {
            ath.plan.useOfFunds = document.getElementById('edit-use').value;
        } else {
            ath.plan = { useOfFunds: document.getElementById('edit-use').value, timePeriod: 'N/A', estEarnings: 0, revenueShare: 10 };
        }
        ath.image = document.getElementById('edit-image').value;
        ath.videoUrl = document.getElementById('edit-video').value;
        if (!ath.stats) ath.stats = {};
        ath.stats.stat1 = document.getElementById('edit-stat1').value;
        ath.stats.stat2 = document.getElementById('edit-stat2').value;

        // Update corresponding marketAthlete
        if (ath.marketId) {
            const marketAthlete = STATE.marketAthletes.find(a => a.id === ath.marketId);
            if (marketAthlete) {
                marketAthlete.name = ath.name;
                marketAthlete.country = ath.country;
                marketAthlete.birthday = ath.birthday;
                marketAthlete.bio = ath.bio;
                marketAthlete.image = ath.image || 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?fit=crop&w=500&q=80';
                marketAthlete.videoUrl = ath.videoUrl;
                if (marketAthlete.plan) marketAthlete.plan.useOfFunds = ath.plan.useOfFunds;
                marketAthlete.stats = ath.stats;
            }
        }

        saveState();
        this.showToast('Profile updated successfully!');
        this.navigate('athlete-dashboard');
        this.renderAthleteDashboard();
        this.renderNavbar();
    },

    // Investor Edit Profile Logic
    populateInvestorEditProfile() {
        const inv = STATE.investors[STATE.currentUserEmail];
        if (!inv) return;

        document.getElementById('edit-inv-name').value = inv.name || '';
        document.getElementById('edit-inv-country').value = inv.country || '';
        document.getElementById('edit-inv-birthday').value = inv.birthday || '';
        document.getElementById('edit-inv-image').value = inv.image || '';
    },

    submitInvestorEditProfile(e) {
        e.preventDefault();

        const inv = STATE.investors[STATE.currentUserEmail];
        if (!inv) return;

        inv.name = document.getElementById('edit-inv-name').value;
        inv.country = document.getElementById('edit-inv-country').value;
        inv.birthday = document.getElementById('edit-inv-birthday').value;
        inv.image = document.getElementById('edit-inv-image').value || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?fit=crop&w=500&q=80';

        saveState();
        this.showToast('Investor Profile updated successfully!');
        this.navigate('portfolio');
        this.renderNavbar();
    }
};

// Start app when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
