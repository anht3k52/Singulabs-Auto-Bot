const ethers = require('ethers');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { SocksProxyAgent } = require('socks-proxy-agent');
const { HttpsProxyAgent } = require('https-proxy-agent');
const chalk = require('chalk');
const { SiweMessage } = require('siwe');
const banner = require('./banner');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function loadPrivateKeys() {
    try {
        const keys = fs.readFileSync('pk.txt', 'utf8')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('#'));
        console.log(chalk.green(`Loaded ${keys.length} private keys`));
        return keys;
    } catch (error) {
        console.error(chalk.red('Error loading private keys:', error));
        process.exit(1);
    }
}

function loadProxies() {
    try {
        if (fs.existsSync('proxy.txt')) {
            const proxies = fs.readFileSync('proxy.txt', 'utf8')
                .split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('#'));
            console.log(chalk.green(`Loaded ${proxies.length} proxies`));
            return proxies;
        }
        console.log(chalk.yellow('No proxy.txt found, running in direct mode'));
        return [];
    } catch (error) {
        console.error(chalk.red('Error loading proxies:', error));
        return [];
    }
}

function getProxyAgent(proxy) {
    if (!proxy) return null;
    
    try {
        if (proxy.toLowerCase().startsWith('socks')) {
            return new SocksProxyAgent(proxy);
        } else {
            return new HttpsProxyAgent(proxy);
        }
    } catch (error) {
        console.error(chalk.red('Error creating proxy agent:', error));
        return null;
    }
}

async function downloadImage(url, filename, proxyAgent) {
    const options = {
        url,
        method: 'GET',
        responseType: 'stream'
    };

    if (proxyAgent) {
        options.httpsAgent = proxyAgent;
        options.proxy = false;
    }

    try {
        const response = await axios(options);
        return new Promise((resolve, reject) => {
            const writer = fs.createWriteStream(filename);
            response.data.pipe(writer);
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(chalk.red('Error downloading image:', error.message));
        throw error;
    }
}

class ImageComparisonBot {
    constructor(privateKey, proxyUrl = null, walletIndex = 0) {
        this.walletIndex = walletIndex;
        this.provider = new ethers.JsonRpcProvider('https://rpc.odyssey.storyrpc.io/');
        this.wallet = new ethers.Wallet(privateKey, this.provider);
        this.baseUrl = 'https://tools-api.singulabs.xyz';
        this.authToken = null;
        this.webDomain = 'tools.singulabs.xyz';
        this.proxyAgent = getProxyAgent(proxyUrl);
        this.imageUrls = [
            'https://picsum.photos/800/600'
        ];

        this.axiosInstance = axios.create({
            httpsAgent: this.proxyAgent,
            proxy: false
        });

        console.log(chalk.cyan(`[Wallet ${walletIndex + 1}] Initialized: ${this.wallet.address}`));
        if (proxyUrl) {
            console.log(chalk.cyan(`[Wallet ${walletIndex + 1}] Using proxy: ${proxyUrl}`));
        }
    }

    getRandomImageUrl() {
        return this.imageUrls[Math.floor(Math.random() * this.imageUrls.length)];
    }

    async getRandomImages() {
        const timestamp = Date.now();
        const originalPath = path.join(__dirname, `original_${this.walletIndex}_${timestamp}.jpg`);
        const comparePath = path.join(__dirname, `compare_${this.walletIndex}_${timestamp}.jpg`);

        console.log(chalk.yellow(`[Wallet ${this.walletIndex + 1}] Downloading random images...`));
        await downloadImage(this.getRandomImageUrl(), originalPath, this.proxyAgent);
        await sleep(1000);
        await downloadImage(this.getRandomImageUrl(), comparePath, this.proxyAgent);

        return { originalPath, comparePath };
    }

    cleanupImages(originalPath, comparePath) {
        try {
            if (fs.existsSync(originalPath)) fs.unlinkSync(originalPath);
            if (fs.existsSync(comparePath)) fs.unlinkSync(comparePath);
        } catch (error) {
            console.error(chalk.red(`[Wallet ${this.walletIndex + 1}] Error cleaning up images:`, error));
        }
    }

    async getNonce() {
        try {
            const response = await this.axiosInstance.get(`${this.baseUrl}/api/nonce`, {
                headers: {
                    'Origin': `https://${this.webDomain}`,
                    'Referer': `https://${this.webDomain}/`
                }
            });
            return response.data.nonce;
        } catch (error) {
            console.error(chalk.red(`[Wallet ${this.walletIndex + 1}] Failed to get nonce:`, error.message));
            throw error;
        }
    }

    async login() {
        try {
            console.log(chalk.yellow(`[Wallet ${this.walletIndex + 1}] Starting login process...`));
            
            const nonce = await this.getNonce();
            const now = new Date();
            const message = `${this.webDomain} wants you to sign in with your Ethereum account:
${this.wallet.address}

Sign in with Ethereum to the app.

URI: https://${this.webDomain}
Version: 1
Chain ID: 1516
Nonce: ${nonce}
Issued At: ${now.toISOString()}`;

            const signature = await this.wallet.signMessage(message);

            const verifyResponse = await this.axiosInstance.post(
                `${this.baseUrl}/api/verify`,
                { message, signature },
                {
                    headers: {
                        'Origin': `https://${this.webDomain}`,
                        'Referer': `https://${this.webDomain}/`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (verifyResponse.data.token) {
                this.authToken = verifyResponse.data.token;
                console.log(chalk.green(`[Wallet ${this.walletIndex + 1}] Login successful`));
                return this.authToken;
            }
            throw new Error('No token received');
        } catch (error) {
            console.error(chalk.red(`[Wallet ${this.walletIndex + 1}] Login failed:`, error.message));
            throw error;
        }
    }

    async getPoints() {
        try {
            if (!this.authToken) throw new Error('Not authenticated');

            const response = await this.axiosInstance.get(
                `${this.baseUrl}/api/points`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.authToken}`,
                        'Origin': `https://${this.webDomain}`,
                        'Referer': `https://${this.webDomain}/`
                    }
                }
            );

            return response.data.points;
        } catch (error) {
            console.error(chalk.red(`[Wallet ${this.walletIndex + 1}] Failed to get points:`, error.message));
            throw error;
        }
    }

    async uploadOriginalImage(imagePath) {
        try {
            if (!this.authToken) throw new Error('Not authenticated');

            const formData = new FormData();
            formData.append('file', fs.createReadStream(imagePath));

            const response = await this.axiosInstance.post(
                `${this.baseUrl}/api/upload`,
                formData,
                {
                    headers: {
                        ...formData.getHeaders(),
                        'Authorization': `Bearer ${this.authToken}`,
                        'Origin': `https://${this.webDomain}`,
                        'Referer': `https://${this.webDomain}/`
                    }
                }
            );

            console.log(chalk.green(`[Wallet ${this.walletIndex + 1}] Upload successful`));
            return response.data;
        } catch (error) {
            console.error(chalk.red(`[Wallet ${this.walletIndex + 1}] Upload failed:`, error.message));
            throw error;
        }
    }

    async compareImage(compareImagePath) {
        try {
            if (!this.authToken) throw new Error('Not authenticated');

            const formData = new FormData();
            formData.append('file', fs.createReadStream(compareImagePath));

            const response = await this.axiosInstance.post(
                `${this.baseUrl}/api/compare`,
                formData,
                {
                    headers: {
                        ...formData.getHeaders(),
                        'Authorization': `Bearer ${this.authToken}`,
                        'Origin': `https://${this.webDomain}`,
                        'Referer': `https://${this.webDomain}/`
                    }
                }
            );

            console.log(chalk.green(`[Wallet ${this.walletIndex + 1}] Comparison successful`));
            return response.data;
        } catch (error) {
            console.error(chalk.red(`[Wallet ${this.walletIndex + 1}] Comparison failed:`, error.message));
            throw error;
        }
    }

    async runContinuous() {
        while (true) {
            try {
                console.log(chalk.cyan(`\n[Wallet ${this.walletIndex + 1}] === Starting new cycle ===`));
                console.log(chalk.cyan(`[Wallet ${this.walletIndex + 1}] Time:`, new Date().toISOString()));

                if (!this.authToken) {
                    await this.login();
                }

                const startPoints = await this.getPoints();
                console.log(chalk.yellow(`[Wallet ${this.walletIndex + 1}] Current points:`, startPoints));

                const { originalPath, comparePath } = await this.getRandomImages();
                
                await this.uploadOriginalImage(originalPath);
                await this.compareImage(comparePath);

                const endPoints = await this.getPoints();
                console.log(chalk.green(`[Wallet ${this.walletIndex + 1}] Points earned:`, endPoints - startPoints));

                this.cleanupImages(originalPath, comparePath);

                console.log(chalk.yellow(`[Wallet ${this.walletIndex + 1}] Waiting 30 seconds before next cycle...`));
                await sleep(30000);

            } catch (error) {
                console.error(chalk.red(`[Wallet ${this.walletIndex + 1}] Error:`, error.message));
                
                if (error.response?.status === 401) {
                    console.log(chalk.yellow(`[Wallet ${this.walletIndex + 1}] Auth token expired, will re-login`));
                    this.authToken = null;
                }

                await sleep(30000);
            }
        }
    }
}

async function main() {
    try {
        console.clear();
        console.log(chalk.cyan(banner));
        
        const privateKeys = loadPrivateKeys();
        const proxies = loadProxies();
        
        const bots = privateKeys.map((pk, index) => {
            const proxy = proxies.length > 0 ? proxies[index % proxies.length] : null;
            return new ImageComparisonBot(pk, proxy, index);
        });

        await Promise.all(bots.map(bot => bot.runContinuous()));

    } catch (error) {
        console.error(chalk.red('Fatal error:', error.message));
        process.exit(1);
    }
}

// Run the main function
main().catch(console.error);