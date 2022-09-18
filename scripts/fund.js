const { ethers, getNamedAccounts } = require("hardhat")
async function main() {
    const deployer = (await getNamedAccounts()).deployer
    // const fundMe = await ethers.getContractAt(
    //     "FundMe",
    //     "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
    // )
    const fundMe = await ethers.getContract("FundMe", deployer)
    const sendValue = ethers.utils.parseEther("0.0002")
    const tx = await fundMe.fund({ value: sendValue })
    await tx.wait(1)
    console.log("Funded")
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error)
        process.exit(1)
    })
