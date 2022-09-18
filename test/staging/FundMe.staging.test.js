const { assert } = require("chai")
const { network, ethers, getNamedAccounts } = require("hardhat")
const { deploymentchains } = require("../../helper-hardhat-config")

deploymentchains.includes(network.name)
    ? describe.skip
    : describe("FundMe Staging Tests", async function() {
          let deployer
          let fundMe
          const sendValue = ethers.utils.parseEther("0.1")
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              fundMe = await ethers.getContractAt(
                  "FundMe",
                  "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
              )
          })

          it("allows people to fund and withdraw", async function() {
              const fundTxResponse = await fundMe.fund({
                  value: sendValue
              })
              //   await fundTxResponse.wait(1)
              const withdrawTxResponse = await fundMe.withdraw()
              //   await withdrawTxResponse.wait(1)

              const endingFundMeBalance = await fundMe.provider.getBalance(
                  fundMe.address
              )
              console.log(
                  endingFundMeBalance.toString() +
                      " should equal 0, running assert equal..."
              )
              assert.equal(endingFundMeBalance.toString(), "0")
          })
      })
