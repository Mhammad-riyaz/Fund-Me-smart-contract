const { network, deployments, getNamedAccounts } = require("hardhat")
const { deploymentchains } = require("../helper-hardhat-config")
// const { deploy, log } = require("hard")]
const DECIMALS = 8
const INITIAL_ANSER = 200000000000
module.exports = async ({ deployments, getNamedAccounts }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    if (deploymentchains.includes(network.name)) {
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            args: [DECIMALS, INITIAL_ANSER],
            log: true,
        })

        log("Mocks deployed!")
        log("---------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
