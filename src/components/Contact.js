import './Contact.scss';
import {useState, useEffect} from 'react';
import { CONTRACT_ADDRESS, API_KEY } from '../utils/Constants';
import businessCard from '../utils/BusinessCard.json';
import { ethers } from 'ethers';
import { Biconomy } from "@biconomy/mexa";
import linkedinLogo from '../assets/linkedin.svg';
import phoneLogo from '../assets/phone.svg';
import emailLogo from '../assets/mail.svg';



const Contact = () => {
  const [contract, setContract] = useState(null);
  const [network, setNetwork] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [hasNFT, setHasNFT] = useState(false);
  const [loading, setLoading] = useState(false);
  const chainId = 137; //80001; to switch to testnet mumbai
  const tokenId = 1;
  const [biconomy, setBiconomy] = useState(false);

  useEffect(() => {
    setBiconomyContract();
  }, []);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [contract]);

  useEffect(() => {
    if (currentAccount && contract && network == chainId){
      checkIfUserHasNFT();
    }
  }, [currentAccount, network, loading]);

  const checkIfUserHasNFT = async () => {
    const txn = await contract.balanceOf(currentAccount, tokenId);
    setHasNFT(txn == 0 ? false : true);
  }

  const setBiconomyContract = async () => {
    if (!contract) {
      const { ethereum } = window;
      const biconomy = new Biconomy(ethereum, {
          apiKey: API_KEY,
          contractAddresses: [CONTRACT_ADDRESS],
          debug: true
      });
      await biconomy.init();
      const newContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          businessCard.abi,
          biconomy.ethersProvider
      );
      newContract.on("CardGiven", cardGivenEvent);
      setContract(newContract);
      setBiconomy(biconomy);
    };
  }

  const cardGivenEvent = () => {
    setHasNFT(true);
    setLoading(false);
  }

  const updateNetwork = async () => {
    if (window.ethereum.networkVersion !== chainId) {
      setLoading(true);
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: ethers.utils.hexlify(chainId) }]
        });
        setNetwork(chainId);
      } catch (err) {
        if (err.code === 4902) { // This error code indicates that the chain has not been added to MetaMask
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainName: 'Polygon Mainnet',
                chainId: ethers.utils.hexlify(chainId),
                nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
                rpcUrls: ['https://polygon-rpc.com/']
              }
            ]
          });
          setNetwork(chainId);
        }
      }
      setLoading(false);
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        return;
      } else {

        setNetwork(ethereum.networkVersion ? ethereum.networkVersion : 1);
        
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log('Found an authorized account:', account);
          setCurrentAccount(account);
          if (contract && ethereum.networkVersion == chainId){
            const txn = await contract.balanceOf(account, tokenId);
            setHasNFT(txn == 0 ? false : true);
          }
        } else {
          console.log('No authorized account found');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const connectWalletAction = async () => {
    if(!currentAccount){
      setLoading(true);
      try {
        setLoading(true);
        const { ethereum } = window;
        if (!ethereum) {
          alert('Get MetaMask!');
          return;
        }
        const accounts = await ethereum.request({
          method: 'eth_requestAccounts',
        });
        setCurrentAccount(accounts[0]);
        if (contract){
          contract.balanceOf(accounts[0]);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
      setLoading(false);
    } 
  };

  const receiveBusinessCard = (tokenId) => async () => {
    try {
      console.log(contract);
      if (contract) {
        setLoading(true);
        const provider = await biconomy.provider;
        const { data } = await contract.populateTransaction.receiveBusinessCard(tokenId);
        const txParams = {
          data: data,
          to: CONTRACT_ADDRESS,
          from: currentAccount,
          signatureType: "EIP712_SIGN",
        };
        await provider.request({
          method: 'eth_sendTransaction',
          params: [txParams]
        });
      }
    } catch (error) {
      console.warn('receiveBusinessCard Error:', error);
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading){
      return (
        <div className="Dynamic-Connect">
          <div className="Loader"></div>
        </div>
      );
    } else if (!network){
      return (
        <div className="Dynamic-Connect">
          <p>To receive your NFT, you'll first need <a href="https://metamask.io/download/" rel="noreferrer" target="_blank">metamask</a>.</p>
        </div>
      );
    } else if(!currentAccount) {
      return (
        <div className="Dynamic-Connect">
          <p><span onClick={connectWalletAction}>Connect your metamask account.</span></p>
        </div>
      );
    } else if (currentAccount && hasNFT) {
      return (
        <div className="Dynamic-Connect">
          <p>You own a business card NFT! Check it out now on <a href={"https://opensea.io/fr/assets/matic/" + CONTRACT_ADDRESS + "/" + tokenId} rel="noreferrer" target="_blank">opensea </a>.</p>
        </div>
      );
    } else if(network != chainId) {
      return (
        <div className="Dynamic-Connect">
          <p>To receive your NFT, <span onClick={updateNetwork}> connect to the Polygon network</span>.</p>
        </div>
      );
    } else if(!hasNFT) {
      return (
        <div className="Dynamic-Connect">
          <button onClick={receiveBusinessCard(tokenId)}><span>Get your gas free NFT</span></button>
        </div>
      );
    } else {
      console.log("error on render")
    }
  }; 

  return(
  <div className="Contact" id="Contact">
    <div className="NFT-Contact">
      <div className="NFT">
        <p className= "Intro-text">On my spare time, I like playing piano, riding my motorbike, taking good care of my numerous plants but also shipping blockchain & Web3 related projects. To thank you for your visit, get your free NFT Business Card below.</p>
        <img src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/51542251168899.58e4d1266384a.gif" alt="Business card GIF" />
        {renderContent()}
      </div>
      <div className="Contact-Boxes">
        <ul>
          <li><div className="In"><img className="Linkedin-logo" src={linkedinLogo} alt="LinkedIn"/></div><p>@CharlesSteimberg</p><a className="LinkedIn-text" href="https://www.linkedin.com/in/charles-steimberg-b2a7b0100/" target="_blank" rel="noreferrer"><p>Join me on LinkedIn</p></a></li>
          <li><div className="Mail"><img className="Email-logo" src={emailLogo} alt="Mail"/></div><p>charles.steimberg@gmail.com</p><a href="mailto:charles.steimberg@gmail.com?subject=Getting in touch&body=Hello Charles, nice to meet you!" ><p>Drop me a line</p></a></li>
          <li><div className="Phone"><img className="Phone-logo" src={phoneLogo} alt="Phone"/></div><p>+33 6 09 13 54 78</p><a href="sms:+33609136578" ><p>Text me</p></a></li>
        </ul>
      </div>
    </div>
    <div className= "Goodbye"><p>Currently based in Paris 🇫🇷 but open to work anywhere.</p></div>
  </div>
  );
}
export default Contact;