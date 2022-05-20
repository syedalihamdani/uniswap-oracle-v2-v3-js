const Web3 = require('web3');
const url = "https://mainnet.infura.io/v3/4e65c2fa20464f838512b3f523ab7c05";
const web3 = new Web3(url);
const UniswapV2FactoryAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
const WETH9 = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
let pairContractAddress;
const ABIs=require('./ABI');
const baseAmount=1000000000000000000;
let Token0; //WETH9
let Token1; //USDT

let  price0CumulativeLast;
let price1CumulativeLast;
let blockTimestampLast;

let reserve0;
let reserve1;
let constant;


 
const contractFactory = new web3.eth.Contract(ABIs.UniswapV2FactoryABI, UniswapV2FactoryAddress);


async function getPoolContractAddress() {
    pairContractAddress = await contractFactory.methods.getPair(WETH9, USDT).call()
    await console.log(pairContractAddress);
    await getPairContractValues();
};
getPoolContractAddress()

async function getPairContractValues() {
    let contractPair = new web3.eth.Contract(ABIs.UniswapV2PairABI, pairContractAddress);
    const secondsAgo=1000;
    const secondsAgos=[secondsAgo,0];
     Token0=await contractPair.methods.token0().call();
    console.log(Token0);
    Token1=await contractPair.methods.token1().call();
    console.log(Token1);

    price0CumulativeLast=await contractPair.methods.price0CumulativeLast().call();
    console.log(price0CumulativeLast);

    
    price1CumulativeLast=await contractPair.methods.price1CumulativeLast().call();
    console.log(price1CumulativeLast);

    getReserves=await contractPair.methods.getReserves().call();
    reserve0=getReserves._reserve0;
    reserve1=getReserves._reserve1;
    blockTimestampLast=getReserves._blockTimestampLast
        console.log(reserve0);
        console.log(reserve1);
        console.log(blockTimestampLast);

     constant=reserve0*reserve1;
     console.log(constant);

     function getTradePrice(token,amountIn){
         let delta0;
         let delta1;
         if(token==token0){
             reserve0+amountIn
         }
     }

     
   
};
