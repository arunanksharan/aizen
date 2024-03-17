'use client';
import { useEffect, useState } from 'react';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env['NEXT_PUBLIC_OPENAI_API_KEY'],
  dangerouslyAllowBrowser: true,
});

import Image from 'next/image';
import { Web3Auth } from '@web3auth/modal';
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from '@web3auth/base';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import Web3 from 'web3';

const clientId =
  'BFHy7YTc3cwAPC5NsTgZCnHUPkEczWRnjteme0OdCnonK1q3wh9vgZew_WCfuOPBQgTs54NHbuxEdq4a2De523Q';

const chainConfig = {
  chainId: '0x1', // Please use 0x1 for Mainnet
  rpcTarget: 'https://rpc.ankr.com/eth',
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  displayName: 'Ethereum Mainnet',
  blockExplorerUrl: 'https://etherscan.io/',
  ticker: 'ETH',
  tickerName: 'Ethereum',
  logo: 'https://images.toruswallet.io/eth.svg',
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig: chainConfig },
});

const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  privateKeyProvider: privateKeyProvider,
});

export default function Home() {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [prompt, setPrompt] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();
        setProvider(web3auth.provider);

        if (web3auth.connected) {
          console.log('web3auth.connected');
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    if (web3auth.connected) {
      setLoggedIn(true);
    }
    console.log('web3authProvider + clickedLogin');
  };

  const getUserInfo = async () => {
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
    uiConsole('logged out');
  };

  const getAccounts = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const web3 = new Web3(provider as any);

    // Get user's Ethereum public address
    const address = await web3.eth.getAccounts();
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const web3 = new Web3(provider as any);

    // Get user's Ethereum public address
    const address = (await web3.eth.getAccounts())[0];

    // Get user's balance in ether
    const balance = web3.utils.fromWei(
      await web3.eth.getBalance(address), // Balance is in wei
      'ether'
    );
    uiConsole(balance);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const web3 = new Web3(provider as any);

    // Get user's Ethereum public address
    const fromAddress = (await web3.eth.getAccounts())[0];

    const originalMessage = 'YOUR_MESSAGE';

    // Sign the message
    const signedMessage = await web3.eth.personal.sign(
      originalMessage,
      fromAddress,
      'test password!' // configure your own password here.
    );
    uiConsole(signedMessage);
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector('#console>p');
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
    console.log(...args);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    uiConsole(prompt);

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
    });

    if (response.data[0].url) {
      setImageUrl(response.data[0].url);
    } else {
      // Handle the case where the URL is undefined
      // For example, set a default image URL or log an error
      console.error('No URL returned from the API');
      setImageUrl('path/to/default/image.png'); // Example default path
    }

    // Convert to NFT
    // Save prompt, its hash and image to IPFS
    // Mint NFT with metadata
  };

  const loggedInView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={getUserInfo} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={getBalance} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div>
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="prompt">Prompt:</label>
            <input
              type="text"
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
              className="bg-slate-400 m-5 p-2 rounded-md w-80"
            ></input>
          </div>
          <button type="submit">Submit</button>
        </form>
        {imageUrl && (
          <Image
            src={imageUrl}
            width={1024}
            height={1024}
            alt="image of prompt"
          />
        )}
      </div>
    </>
  );

  const unloggedInView = (
    <button onClick={login} className="card">
      Login
    </button>
  );

  return (
    <>
      <div>Welcome to Aizen</div>
      <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>
    </>
  );
}

// ToDo: Refactor the above code into
// 1. Components - loggedIn vs loggedOut
// 2. pages/api - for call OpenAI API and image generation with prompt
// 3. pages/api - for minting NFT
// 4. pages/api - for IPFS upload
// 5. Messi | MS Dhoni | Water crisis in Bengaluru | US Elections  cron-job + AI Agent - find top trending topics and generate prompts + convert into images
// Hackernews API
// Farcaster API
