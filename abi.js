var abi = [
  {
    "inputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "betResult",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "valueBack",
        "type": "uint256"
      }
    ],
    "name": "Result",
    "type": "event"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "contractBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "random",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "coinSelection",
        "type": "uint256"
      }
    ],
    "name": "placeBet",
    "outputs": [
      {
        "internalType": "bool",
        "name": "betResult",
        "type": "bool"
      }
    ],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  }
]
