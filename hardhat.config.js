const { version } = require("os")

require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("dotenv").config()
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    // solidity: "0.8.8",
    solidity: {
        compilers: [{ version: "0.8.8" }, { version: "0.6.8" }]
    },

    networks: {
        rinkeby: {
            url: process.env.RINKEBY_PROVIDER_URL,
            accounts: [process.env.RINKEBY_PRIVATE_KEY],
            chainId: 4,
            blockConfirmation: 6,
            gas: 2100000,
            gasPrice: 800000000
        },
        polygon: {
            url:
                "https://polygon-mainnet.g.alchemy.com/v2/38JkluxafjN3l0PmPG9Ls4FOu_5vqMH-",
            accounts: [],
            chaindId: 317
        }
    },
    namedAccounts: {
        deployer: {
            default: 0
        }
    },
    external: {
        contracts: [{ artifacts: "./artifacts" }]
    },
    gasReporter: {
        enabled: false,
        coinmarketcap: process.env.COINMARKET_CAP_API,
        currency: "USD",
        token: "eth"
    },
    etherscan: {
        apiKey: process.env.API_KEY
    }
}
