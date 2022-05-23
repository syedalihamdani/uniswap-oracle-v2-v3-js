const Web3 = require('web3');
const url = "https://mainnet.infura.io/v3/4e65c2fa20464f838512b3f523ab7c05";
const web3 = new Web3(url);
const UniswapV3FactoryAddress = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
const WETH9 = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const Fee = 3000;
let poolContractAddress;
const ABIs=require('./ABI');
const baseAmount=1000000000000000000;
const baseToken=WETH9;
const quoteToken=USDT;
// const tick=arithmeticMeanTick;
let quoteAmount;
 
const contractFactory = new web3.eth.Contract(ABIs.UniswapV3FactoryABI, UniswapV3FactoryAddress);


async function getPoolContractAddress() {
    poolContractAddress = await contractFactory.methods.getPool(WETH9, USDT, Fee).call()
    await console.log(poolContractAddress);
    await getPoolContractValues();
};
getPoolContractAddress()

async function getPoolContractValues() {
    let contractPool = new web3.eth.Contract(ABIs.UniswapV3PoolABI, poolContractAddress);
    const secondsAgo=1000;
    const secondsAgos=[secondsAgo,0];
    const result=await contractPool.methods.observe(secondsAgos).call();
    console.log(result);

    const tickCumulatives=await result.tickCumulatives;
    const secondsPerLiquidityCumulativeX128s=await result.secondsPerLiquidityCumulativeX128s;

    // console.log(tickCumulatives);
    // console.log(secondsPerLiquidityCumulativeX128s);
    const tickCumulativesDelta = tickCumulatives[1] - tickCumulatives[0];

    const secondsPerLiquidityCumulativesDelta =
        secondsPerLiquidityCumulativeX128s[1] - secondsPerLiquidityCumulativeX128s[0];

        // console.log(tickCumulativesDelta);
        // console.log(secondsPerLiquidityCumulativesDelta);


    arithmeticMeanTick = tickCumulativesDelta / secondsAgo;

    console.log(arithmeticMeanTick);
    function getQuoteAtTick(){
        const sqrtRatioX96 = Math.sqrt(arithmeticMeanTick);

        // Calculate quoteAmount with better precision if it doesn't overflow when multiplied by itself
        if (sqrtRatioX96 <= 340282366920938463463374607431768211455) {
            let ratioX192 =sqrtRatioX96 * sqrtRatioX96;
            quoteAmount = baseToken < quoteToken
                ? FullMath.mulDiv(ratioX192, baseAmount, 1 << 192)
                : FullMath.mulDiv(1 << 192, baseAmount, ratioX192);
        } else {
            uint256 ratioX128 = FullMath.mulDiv(sqrtRatioX96, sqrtRatioX96, 1 << 64);
            quoteAmount = baseToken < quoteToken
                ? FullMath.mulDiv(ratioX128, baseAmount, 1 << 128)
                : FullMath.mulDiv(1 << 128, baseAmount, ratioX128);
        }
    }

    // console.log(sqrtRatioX96);
};
