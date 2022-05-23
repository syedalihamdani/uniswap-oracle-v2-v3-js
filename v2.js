const Web3 = require('web3');
const url = "https://mainnet.infura.io/v3/4e65c2fa20464f838512b3f523ab7c05";
const web3 = new Web3(url);
const UniswapV2FactoryAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
const WETH9 = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const dai="0x6B175474E89094C44Da98b954EedeAC495271d0F";
let pairContractAddress="0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11";
const ABIs = require('./ABI');
let reserve0;
let reserve1;
/**
 * 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
 * Uniswapv2 router contract address;we need this for test price
 */





const contractFactory = new web3.eth.Contract(ABIs.UniswapV2FactoryABI, UniswapV2FactoryAddress);


async function getPoolContractAddress() {
    pairContractAddress = await contractFactory.methods.getPair(WETH9, dai).call()
    // await console.log(pairContractAddress);

    await getPairContractValues();
}



async function getPairContractValues() {
    let contractPair = new web3.eth.Contract(ABIs.UniswapV2PairABI, pairContractAddress); 
    getReserves = await contractPair.methods.getReserves().call();
    reserve0 = getReserves._reserve0;
    reserve1 = getReserves._reserve1;
    // blockTimestampLast = getReserves._blockTimestampLast;
    console.log(reserve0);
    console.log(reserve1);
    // console.log(blockTimestampLast);
    getTradePrice(dai,amount);
};

/**
 * Pric calculation formula
         * x*y=k
         * (x+dx)*(y-dy)=k;
         * dy=?
         * y-dy-k/(x+dx);
         * dy=y-xy/(x+dx);
         * dy=(yx+ydx-xy)/(x+dx)
         * ydx/(x+dx)
         * Uniswap trading fee=0.3%;
         * dy=y*0.997*dx/(x+0.997*dx )
         */

let amount=web3.utils.toWei('1','ether');
async function getTradePrice(token,amountIn){
    let x=await reserve0;
    let y=await reserve1;
    if(token==WETH9){
        let dx=amountIn;
        let dy=y*0.997*dx/(x+0.997*dx)
        console.log(dy);
    
    }else if(token==dai){
        let dy=amountIn;
        let dx=x*0.997*dy/(y+0.997*dy);
        console.log(dx);
        
    }else{
        console.log("Not a valid token");
    }
}

getPoolContractAddress();


