const Web3 = require('web3');
const url = 'https://rinkeby.infura.io/v3/f92b70f0f82c4b2184d365b2efc9a4cd';
const web3 = new Web3(url);
const UniswapV3FactoryAddress = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
const WETH9 = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
const USDT = "0x3B00Ef435fA4FcFF5C209a37d1f3dcff37c705aD";
const Fee = 3000;
let poolContractAddress;
const ABIs=require('./ABI');
 
const contractFactory = new web3.eth.Contract(ABIs.UniswapV3FactoryABI, UniswapV3FactoryAddress);


async function getPoolContractAddress() {
    poolContractAddress = await contractFactory.methods.getPool(WETH9, USDT, Fee).call()
    await console.log(poolContractAddress);
    await getPoolContractValues();
};
getPoolContractAddress()

async function getPoolContractValues() {
    let contractPool = new web3.eth.Contract(ABIs.UniswapV3PoolABI, poolContractAddress);
    const secondsAgo=10;
    const secondsAgos=[secondsAgo,0];
    const result=await contractPool.methods.observe(secondsAgos).call();

    await console.log(result);
};
