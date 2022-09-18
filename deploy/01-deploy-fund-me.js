// module.exports = async (hre) => {
//     const { getNamedAccounts, deployments } = hre
//     const { deploy, log } = deployments
//     const { deployer } = await getNamedAccounts()
//     const chainId = network.conifg.chainId
// }

const { network, deployments, getNamedAccounts } = require("hardhat")
const { networkConfig, deploymentchains } = require("../helper-hardhat-config")
const { mock } = require("./00-mocks-deploy")
const { verify } = require("../utils/verify")
require("dotenv").config()

// OR

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const chainId = network.config.chainId
    let ethPriceFeedAddress
    if (deploymentchains.includes(network.name)) {
        const mock = await deployments.get("MockV3Aggregator")
        ethPriceFeedAddress = mock.address
    } else {
        ethPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethPriceFeedAddress],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    })
    log("Fund-me deployed!")
    log("------------------------------------")

    if (!deploymentchains.includes(network.name) && process.env.API_KEY) {
        await verify(fundMe.address, [ethPriceFeedAddress])
    }
    console.log("-------------------------------------------------------------")
}

module.exports.tags = ["all", "fund-me"]
