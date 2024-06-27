import React, { useEffect, useState, useCallback } from 'react';
import { Testnet } from "@nibiruchain/nibijs";

const chainInfo = {
  chainId: "nibiru-testnet-2",
  chainName: "Nibiru Testnet-2",
  rpc: "https://rpc.testnet-2.nibiru.fi",
  rest: "https://lcd.testnet-2.nibiru.fi",
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: "nibiru",
    bech32PrefixAccPub: "nibiru" + "pub",
    bech32PrefixValAddr: "nibiru" + "valoper",
    bech32PrefixValPub: "nibiru" + "valoperpub",
    bech32PrefixConsAddr: "nibiru" + "valcons",
    bech32PrefixConsPub: "nibiru" + "valconspub",
  },
  currencies: [
    {
      coinDenom: "NIBI",
      coinMinimalDenom: "unibi",
      coinDecimals: 6,
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "NIBI",
      coinMinimalDenom: "unibi",
      coinDecimals: 6,
    },
  ],
  stakeCurrency: {
    coinDenom: "NIBI",
    coinMinimalDenom: "unibi",
    coinDecimals: 6,
  },
  coinType: 118,
  gasPriceStep: {
    low: 0.01,
    average: 0.025,
    high: 0.04,
  },
};

const ConnectWalletButton = ({ setSigner }) => {
  const [account, setAccount] = useState(null);

  const connectWallet = useCallback(async () => {
    if (!window.getOfflineSignerAuto || !window.keplr) {
      alert("Please install Keplr extension");
      return;
    }

    try {
      console.log("Suggesting chain info:", chainInfo);
      await window.keplr.experimentalSuggestChain(chainInfo);

      const chainId = chainInfo.chainId;
      console.log("Enabling Keplr for chainId:", chainId);
      await window.keplr.enable(chainId);
      const offlineSigner = window.getOfflineSigner(chainId);
      const accounts = await offlineSigner.getAccounts();
      console.log("Accounts:", accounts);

      if (Array.isArray(accounts) && accounts.length > 0) {
        setAccount(accounts[0].address);
        setSigner(offlineSigner);
      } else {
        console.error("No accounts found or accounts is not an array", accounts);
      }
    } catch (error) {
      console.error("Failed to connect wallet", error);
    }
  }, [setSigner]);

  const formatAddress = (address) => {
    return `${address.slice(0, 3)}...${address.slice(-3)}`;
  };

  useEffect(() => {
    if (window.keplr) {
      window.addEventListener("keplr_keystorechange", connectWallet);
      return () => {
        window.removeEventListener("keplr_keystorechange", connectWallet);
      };
    }
  }, [connectWallet]);

  return (
    <div>
      {account ? (
        <p className="text-lg">Connected: {formatAddress(account)}</p>
      ) : (
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-indigo-600 rounded-lg text-white text-lg"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default ConnectWalletButton;
