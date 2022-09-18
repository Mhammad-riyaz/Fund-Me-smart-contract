const networkConfig = {
    4: {
        name: "Rinkeby",
        ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
    },

    317: {
        name: "polygon",
        ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
    },
}

const deploymentchains = ["hardhat", "localhost"]

module.exports = { networkConfig, deploymentchains }
