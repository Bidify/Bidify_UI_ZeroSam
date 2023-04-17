import logo_eth from "../assets/logo/bidifylogo.png";
import logo_egem from "../assets/logo/bidifylogo_egem.png";
import logo_avax from "../assets/logo/bidifylogo_avax.png";
import logo_matic from "../assets/logo/bidifylogo_matic.png";
import logo_bnb from "../assets/logo/bidifylogo_bnb.png";
import logo_etc from "../assets/logo/bidifylogo_etc.png";
import logo_xdai from "../assets/logo/bidifylogo_xdai.png";
import logo_evmos from "../assets/logo/bidifylogo_evmos.png";
import logo_movr from "../assets/logo/bidifylogo_movr.png";
import logo_optimism from "../assets/logo/bidifylogo_optimism.png";
import logo_arbitrum from "../assets/logo/bidifylogo_arbitrum.png";
import logo_zksync from "../assets/logo/bidifylogo_zksync.png";

import ethLoader from "../assets/icons/loader_3d.gif";
import egemLoader from "../assets/icons/loader_3d_egem.gif";
import avaxLoader from "../assets/icons/loader_3d_avax.gif";
import maticLoader from "../assets/icons/loader_3d_matic.gif";
import bnbLoader from "../assets/icons/loader_bnb.gif";
import movrLoader from "../assets/icons/loader_movr.gif";
import evmosLoader from "../assets/icons/loader_evmos.gif";
import xdaiLoader from "../assets/icons/loader_xdai.gif";
import etcLoader from "../assets/icons/loader_etc.gif";
import arbitrumLoader from "../assets/icons/loader_arbitrum.gif";
import optimismLoader from "../assets/icons/loader_optimism.gif";
import zksyncLoader from "../assets/icons/loader_3d_zksync.gif";

export const baseUrl = "https://api.bidify.org/api"
// export const baseUrl = "http://localhost:8080/api"
export const NetworkId = {
  ETHEREUM: 1,
  RINKEBY: 4,
  MATIC: 137,
  EGEM: 1987,
  AVAX: 43114,
  EVMOS: 9001,
  MOVR: 1285,
  BNB: 56,
  ETC: 61,
  XDAI: 100,
  ARBITRUM: 42161,
  OPTIMISM: 10,
  zkSyncTestnet: 280,
  zkSyncMainnet: 324,
}
export const NetworkData = {
  [NetworkId.MATIC]: {
    symbol: "MATIC",
    id: "137",
    name: "POLYGON",
    color: "#8247e5",
    logo: logo_matic,
    loader: maticLoader
  },
  [NetworkId.BNB]: {
    symbol: "BNB",
    id: "56",
    name: "BINANCE SMART CHAIN",
    color: "#FCD535",
    logo: logo_bnb,
    loader: bnbLoader
  },
  [NetworkId.ETC]: {
    symbol: "ETC",
    id: "61",
    name: "ETHEREUM CLASSIC",
    color: "#34d399",
    logo: logo_etc,
    loader: etcLoader
  },
  [NetworkId.XDAI]: {
    symbol: "XDAI",
    id: "100",
    name: "GNOSIS",
    color: "#009cb4",
    logo: logo_xdai,
    loader: xdaiLoader
  },
  [NetworkId.EGEM]: {
    symbol: "EGEM",
    id: "1987",
    name: "ETHERGEM",
    color: "#dfdfdf",
    logo: logo_egem,
    loader: egemLoader
  },
  [NetworkId.AVAX]: {
    symbol: "AVAX",
    id: "43114",
    name: "AVALANCHE",
    color: "#de4437",
    logo: logo_avax,
    loader: avaxLoader
  },
  [NetworkId.RINKEBY]: {
    id: '4',
    color: '#F4DD62',
    symbol: "ETH",
    name: "RINKEBY",
    logo: logo_eth,
    loader: ethLoader
  },
  [NetworkId.MOVR]: {
    symbol: "MOVR",
    id: "1285",
    name: "MOONRIVER",
    color: "#f2b705",
    logo: logo_movr,
    loader: movrLoader
  },
  [NetworkId.EVMOS]: {
    symbol: "EVMOS",
    id: "9001",
    name: "EVMOS",
    color: "#2d2925",
    logo: logo_evmos,
    loader: evmosLoader
  },
  [NetworkId.ARBITRUM]: {
    symbol: "ETH",
    id: "42161",
    name: "ARBITRUM",
    color: "#34d399",
    logo: logo_arbitrum,
    loader: arbitrumLoader
  },
  [NetworkId.OPTIMISM]: {
    symbol: "ETH",
    id: "10",
    name: "OPTIMISM",
    color: "#34d399",
    logo: logo_optimism,
    loader: optimismLoader
  },
  // [NetworkId.zkSyncTestnet]: {
  //   symbol: "ETH",
  //   id: "280",
  //   name: "zkSyncTestnet",
  //   color: "#34d399",
  //   logo: logo_zksync,
  //   loader: zksyncLoader
  // },
  [NetworkId.zkSyncMainnet]: {
    symbol: "ETH",
    id: "324",
    name: "zkSyncMainnet",
    color: "#34d399",
    logo: logo_zksync,
    loader: zksyncLoader
  },
  // [NetworkId.ETHEREUM]: {
  //   symbol: "ETH",
  //   name: "ETHEREUM",
  //   logo: logo_eth,
  //   loader: ethLoader
  // },
}
export const getSymbol = (chainId) => {
  if(chainId) return NetworkData[chainId].symbol;
  else return "N/A"
}
export const supportedChainIds = [ NetworkId.MATIC, NetworkId.BNB, NetworkId.ETC, NetworkId.XDAI, NetworkId.EGEM, NetworkId.AVAX, NetworkId.RINKEBY, NetworkId.MOVR, NetworkId.EVMOS, NetworkId.zkSyncMainnet]
export const getLogUrl = {
  [NetworkId.MATIC]: "https://api.polygonscan.com/api?module=logs&action=getLogs",
  [NetworkId.AVAX]: "https://api.snowtrace.io/api?module=logs&action=getLogs",
  [NetworkId.BNB]: "https://api.bscscan.com/api?module=logs&action=getLogs",
  [NetworkId.MOVR]: "https://api-moonriver.moonscan.io/api?module=logs&action=getLogs",
  [NetworkId.EVMOS]: "https://evm.evmos.org/api?module=logs&action=getLogs",
  [NetworkId.XDAI]: "https://blockscout.com/xdai/mainnet/api?module=logs&action=getLogs",
  [NetworkId.zkSyncTestnet]: "https://zksync2-testnet.zkscan.io/api?module=logs&action=getLogs",
  [NetworkId.zkSyncTestnet]: "https://zksync2-mainnet.zkscan.io/api?module=logs&action=getLogs",
}
export const snowApi = {
  [NetworkId.AVAX]: "Y72B4EMH42SYS5C3RGGIDJM9HPQKYUSUTH",
  [NetworkId.MATIC]: "XKIRV2YEWTDJIXRQSXB42PT78P1879NTJT",
  [NetworkId.BNB]: "WYSBB1UFVWFNRVRMCRZ6PMI5XD3K1D2A9F",
  [NetworkId.MOVR]: "GCYJCX8CRQQQ21H94QT4YR8TGRHRZIBDIG",
  [NetworkId.EVMOS]: ""

}
export const EXPLORER = {
  [NetworkId.EGEM]: "https://blockscout.egem.io",
  [NetworkId.RINKEBY]: "https://rinkeby.etherscan.io",
  [NetworkId.MATIC]: "https://polygonscan.com",
  [NetworkId.EVMOS]: "https://evm.evmos.org",
  [NetworkId.BNB]: "https://bscscan.com",
  [NetworkId.MOVR]: "https://moonriver.moonscan.io",
  [NetworkId.XDAI]: "https://blockscout.com/poa/xdai",
  [NetworkId.ETC]: "https://blockscout.com/etc/mainnet",
  [NetworkId.AVAX]: "https://snowtrace.io",
  [NetworkId.OPTIMISM]: "",
  [NetworkId.ARBITRUM]: "",
  [NetworkId.zkSyncTestnet]: "https://goerli.explorer.zksync.io",
  [NetworkId.zkSyncMainnet]: "https://explorer.zksync.io",
}

export const URLS = {
  // 1: "https://mainnet.infura.io/v3/0c8149f8e63b4b818d441dd7f74ab618",
  // 3: "https://ropsten.infura.io/v3/0c8149f8e63b4b818d441dd7f74ab618",
  // 80001: "https://matic-testnet-archive-rpc.bwarelabs.com",
  // 43113: "https://api.avax-test.network/ext/bc/C/rpc",
  // 5: "https://goerli.infura.io/v3/0c8149f8e63b4b818d441dd7f74ab618",
  [NetworkId.RINKEBY]: "https://rinkeby.infura.io/v3/0c8149f8e63b4b818d441dd7f74ab618",
  [NetworkId.EGEM]: "https://lb.rpc.egem.io",
  [NetworkId.AVAX]: "https://api.avax.network/ext/bc/C/rpc",
  [NetworkId.MATIC]: "https://polygon-rpc.com",
  [NetworkId.XDAI]: "https://rpc.gnosischain.com",
  [NetworkId.ETC]: "https://www.ethercluster.com/etc",
  [NetworkId.EVMOS]: "https://eth.bd.evmos.org:8545",
  [NetworkId.MOVR]: "https://rpc.api.moonriver.moonbeam.network",
  [NetworkId.BNB]: "https://bsc-dataseed1.binance.org",
  [NetworkId.OPTIMISM]: "",
  [NetworkId.ARBITRUM]: "",
  [NetworkId.zkSyncTestnet]: "https://testnet.era.zksync.dev",
  [NetworkId.zkSyncMainnet]: "https://mainnet.era.zksync.io",

};

export const BIDIFY = {
  address: {
    [NetworkId.RINKEBY]: "0xE9f8f0267342c4b9e65C7Bc14c1b33877e10C817", //new tested
    [NetworkId.EGEM]: "0x159f569E2c35C7B5B601D222AFafc90edD23E1f9", //new tested
    [NetworkId.AVAX]: "0xED002B4F0b3167E9096F6f4674c18433dca96518", //new tested
    [NetworkId.MATIC]: "0x2FccEd65EeC83Bf2790bBc046013e13d6498038C", //new tested
    [NetworkId.XDAI]: "0xcA592ed60C20085217C4529CF75638A0d71F1F02", //new tested
    [NetworkId.ETC]: "0xD4e83E1Fc9d88730CA63Aaaffef168811BFC6D14", //new tested
    [NetworkId.EVMOS]: "0x1779ac6Dc323528DcC93aE8716211FC7dEDb4294", //new tested
    [NetworkId.MOVR]: "0xD4e83E1Fc9d88730CA63Aaaffef168811BFC6D14", //new tested
    [NetworkId.BNB]: "0xA878b8eB62B4a25308CA75B0c89C718F1448B50F", //new tested
    [NetworkId.OPTIMISM]: "",
    [NetworkId.ARBITRUM]: "",
    [NetworkId.zkSyncTestnet]: "0x6eB662c9464F5bc1476efe8E1834E0d616568a8b",
    [NetworkId.zkSyncMainnet]: "0x6eB662c9464F5bc1476efe8E1834E0d616568a8b",
  },
  abi: [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint64",
          "name": "id",
          "type": "uint64"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "time",
          "type": "uint256"
        }
      ],
      "name": "AuctionExtended",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint64",
          "name": "id",
          "type": "uint64"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "nftRecipient",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "AuctionFinished",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint64",
          "name": "id",
          "type": "uint64"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "bidder",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "referrer",
          "type": "address"
        }
      ],
      "name": "Bid",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint64",
          "name": "id",
          "type": "uint64"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "currency",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "platform",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "token",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "endingPrice",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "timeInDays",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "lister",
          "type": "address"
        }
      ],
      "name": "ListingCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "id",
          "type": "uint64"
        },
        {
          "internalType": "address",
          "name": "referrer",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "bid",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "id",
          "type": "uint64"
        }
      ],
      "name": "finish",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "getListing",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "creator",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "currency",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "platform",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "token",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "endingPrice",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "referrer",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "lister",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "highBidder",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "paidOut",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "isERC721",
              "type": "bool"
            }
          ],
          "internalType": "struct Bidify.Listing",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "id",
          "type": "uint64"
        }
      ],
      "name": "getNextBid",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "currency",
          "type": "address"
        }
      ],
      "name": "getPriceUnit",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "currency",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "platform",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "token",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "endingPrice",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "timeInDays",
          "type": "uint8"
        },
        {
          "internalType": "bool",
          "name": "isERC721",
          "type": "bool"
        },
        {
          "internalType": "address",
          "name": "lister",
          "type": "address"
        }
      ],
      "name": "list",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        },
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "name": "onERC1155BatchReceived",
      "outputs": [
        {
          "internalType": "bytes4",
          "name": "",
          "type": "bytes4"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "name": "onERC1155Received",
      "outputs": [
        {
          "internalType": "bytes4",
          "name": "",
          "type": "bytes4"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "name": "onERC1155Received",
      "outputs": [
        {
          "internalType": "bytes4",
          "name": "",
          "type": "bytes4"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "name": "onERC721Received",
      "outputs": [
        {
          "internalType": "bytes4",
          "name": "",
          "type": "bytes4"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ],
};
export const ERC1155 = {
  "abi": [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "uri_",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "values",
          "type": "uint256[]"
        }
      ],
      "name": "TransferBatch",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "TransferSingle",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "value",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "URI",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "accounts",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        }
      ],
      "name": "balanceOfBatch",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeBatchTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "uri",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
}
export const ERC721 = {
  address: "0xA6642FaAEaB5142CBB3636BA00319Bc46306eb3E",
  abi: [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "approved",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "ApprovalForAll",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "baseURI",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      name: "counterfeit",
      outputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_to",
          type: "address",
        },
        {
          internalType: "string",
          name: "_file",
          type: "string",
        },
        {
          internalType: "string",
          name: "_metadata",
          type: "string",
        },
      ],
      name: "createNFT",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "getApproved",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
      ],
      name: "isApprovedForAll",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ownerOf",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "_data",
          type: "bytes",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "setApprovalForAll",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes4",
          name: "interfaceId",
          type: "bytes4",
        },
      ],
      name: "supportsInterface",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "index",
          type: "uint256",
        },
      ],
      name: "tokenByIndex",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "index",
          type: "uint256",
        },
      ],
      name: "tokenOfOwnerByIndex",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "tokenURI",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
};

export const BIT = { //WETH
  address: {
    // 1: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    // 3: "0x87D6eDf380767461A390e41076Bcb20DFEC676A0",
    // 42: "0x010Dd8B6EDa66127a1F2fCfB53933515D111c855",
    // 5: "0x89bAF37C8214bFcaeCB0586FD26E1459D40417c6",
    [NetworkId.EGEM]: "0xE5fca20e55811D461800A853f444FBC6f5B72BEa",
    [NetworkId.RINKEBY]: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
  },
  abi: [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "_mint",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint8",
          name: "decimals_",
          type: "uint8",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "subtractedValue",
          type: "uint256",
        },
      ],
      name: "decreaseAllowance",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "addedValue",
          type: "uint256",
        },
      ],
      name: "increaseAllowance",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "recipient",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "transfer",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "sender",
          type: "address",
        },
        {
          internalType: "address",
          name: "recipient",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
      ],
      name: "allowance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "decimals",
      outputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ],
};
