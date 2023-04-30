import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import Web3Modal from 'web3modal'
import { utils, providers, ethers } from "ethers"
import styles from '../styles/Home.module.css'
import { NFT_CONTRACT_ABI, NFT_CONTRACT_ADDRESS } from '../constants'

export default function Home() {

  const [isOwner, setIsOwner] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numTokensMinted, setNumTokensMinted] = useState("");

  const web3ModalRef = useRef();


  const publicMint = async () => {
    setLoading(true);
    try {
      const signer = await getProviderOrSigner(true);

      const nftContract = new ethers.Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        signer
      );

      const txn = await nftContract.mint({
        value: ethers.utils.parseEther("0.01")
      });
      await txn.wait();

      window.alert("You successfully minted NFT!");

    } catch (error) {
      console.error(error);
    }
    setLoading(false);

  }

  const getNumMintedTokens = async () => {
    try {
      const provider = await getProviderOrSigner();
      const nftContract = new ethers.Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        provider
      );

      const numTokenIds = await nftContract.tokenIds();
      setNumTokensMinted(numTokenIds.toString());
      // console.log("tokenIds", numTokenIds);


    } catch (error) {
      console.error(error);
    }
  }

  const getOwner = async () => {
    try {
      const signer = await getProviderOrSigner(true);

      const nftContract = new ethers.Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        signer
      )

      const owner = await nftContract.owner();
      const userAddress = await signer.getAddress();

      if (owner.toLowerCase() == userAddress.toLowerCase()) {
        setIsOwner(true);
      }

    } catch (error) {
      console.error(error);
    }
  }

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (e) {
      console.error(e.message);
    }
  }

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 80001) {
      window.alert("Please, change the network to Mumbai!");
      throw new Error("Incorrect network");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  }

  const onPageLoaded = async () => {
    try {
      // connectWallet();
      await getOwner();
    } catch (error) {
      console.error(error);
    }
    await getNumMintedTokens();

    setInterval(async () => {
      await getNumMintedTokens();
    }, 10 * 1000);

  }

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: 'mumbai',
        providerOptions: {},
        disableInjectedProvider: false
      });
    } else {
      onPageLoaded();
    }

  }, [walletConnected])

  function renderPage() {
    if (loading) {
      return (
        <div className={styles.description}>
          Loading...
        </div>
      );
    }

    return (
      <div>
          <div className={styles.description}>
            {numTokensMinted}/10 have been minted already.
          </div>
        <div className={styles.description}>
          You can mint your NFT.
        </div>
        <button onClick={publicMint} className={styles.button}>
          Public Mint
        </button>
      </div>
    );

  }

  function renderConnectButton() {
    if (!walletConnected) {
      return (
        <div>
          <div>
            <button className={styles.button} onClick={connectWallet}>
              Connect Wallet
            </button>
          </div>
        </div>
      )
    }
  }


  return (
    <div>
      <Head>
        <title>
          LayerWeb3 Punks Collection
        </title>
        <meta name="description" content="LayerWeb3 Punks NFT collection on IPFS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>

          <h1 className={styles.title}>
            Welcome to LayerWeb3 Punks Community!
          </h1>

          {walletConnected ? renderPage() : renderConnectButton()}
        </div>
        <img className={styles.image} src="/LW3Punks/1.png" />

      </div>
      <footer className={styles.footer}>
        From ABaaaC with &#9829;
      </footer>
    </div>

  )
}
