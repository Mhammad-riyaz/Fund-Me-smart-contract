const { deployments, ethers, getNamedAccounts, network } = require("hardhat")
const { assert, expect } = require("chai")
const { deploymentchains } = require("../../helper-hardhat-config")

!deploymentchains.includes(network.name)
    ? describe.skip
    : describe("FundMe", function() {
          let fundMe
          let mockV3Aggregator
          let deployer
          const sendValue = ethers.utils.parseEther("1") // ---->  1000000000000000000
          beforeEach(async function() {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"]) // deploys like hardhat-deploy
              //   fundMe = await ethers.getContractAt(
              //       "FundMe",
              //       "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
              //   )
              fundMe = await ethers.getContract("FundMe", deployer)
              //   mockV3Aggregator = await ethers.getContractAt(
              //       "MockV3Aggregator",
              //       "0x5FbDB2315678afecb367f032d93F642f64180aa3"
              //   )
              mockV3Aggregator = await ethers.getContract("MockV3Aggregator")
          })

          it("sets the Aggregator address correctly", async function() {
              const response = await fundMe.getPriceFeed()
              assert.equal(response, mockV3Aggregator.address)
          })

          describe("fund", function() {
              it("Fails if you don't send enough ETH", async () => {
                  await expect(fundMe.fund()).to.be.reverted
              })

              it("Updated the amount funded data structure", async function() {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.getAddressToAmountFunded(
                      deployer
                  )
                  assert.equal(sendValue.toString(), response.toString())
              })
              it("Updating the getFunders array", async function() {
                  await fundMe.fund({ value: sendValue })
                  const funder = await fundMe.getFunders(0)
                  assert.equal(funder, deployer)
              })
          })

          describe("withdraw", function() {
              beforeEach(async function() {
                  await fundMe.fund({ value: sendValue })
              })
              it(" allows withdraw ETH from a single funder", async function() {
                  // Arrange
                  const startingContractBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const startingDeployerBalance = await fundMe.provider.getBalance(
                      deployer
                  )
                  // Act
                  const response = await fundMe.withdraw()
                  const reciept = await response.wait(1)
                  const { gasUsed, effectiveGasPrice } = reciept
                  gasPrice = gasUsed.mul(effectiveGasPrice)
                  const endingContractBalance = await ethers.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance = await ethers.provider.getBalance(
                      deployer
                  )
                  // Assert
                  assert.equal(endingContractBalance, 0)
                  assert.equal(
                      startingContractBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasPrice).toString()
                  )
              })

              it("allow withdraw from multiple users", async function() {
                  const accounts = await ethers.getSigners()

                  for (let i = 0; i < 6; i++) {
                      const fundMeConncectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConncectedContract.fund({ value: sendValue })
                  }

                  // Arrange
                  const startingfundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const startingDeployerBalance = await fundMe.provider.getBalance(
                      deployer
                  )

                  // Act
                  const response = await fundMe.withdraw()
                  const reciept = await response.wait()
                  const { gasUsed, effectiveGasPrice } = reciept
                  const gasPrice = gasUsed.mul(effectiveGasPrice)
                  console.log(`gas used${gasUsed}:`)
                  console.log(`effective gas price:${effectiveGasPrice}:`)
                  console.log(`gas used${gasPrice}:`)

                  const endingfundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance = await fundMe.provider.getBalance(
                      deployer
                  )

                  // Assert

                  assert.equal(endingfundMeBalance, 0)
                  assert.equal(
                      startingfundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasPrice)
                  )

                  // Make sure funder is set properly
                  await expect(fundMe.getFunders(0)).to.be.reverted

                  for (let i = 0; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })

              it("only allows the owner to call the withdraw", async function() {
                  const accounts = await ethers.getSigners()
                  const attacker = accounts[1]
                  const attackerConnectedContract = await fundMe.connect(
                      attacker
                  )
                  await expect(attackerConnectedContract.withdraw()).to.be
                      .reverted
              })

              it(" allows cheaper withdraw ETH from a single funder", async function() {
                  // Arrange
                  const startingContractBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const startingDeployerBalance = await fundMe.provider.getBalance(
                      deployer
                  )
                  // Act
                  const response = await fundMe.cheaperWithdraw()
                  const reciept = await response.wait(1)
                  const { gasUsed, effectiveGasPrice } = reciept
                  gasPrice = gasUsed.mul(effectiveGasPrice)
                  const endingContractBalance = await ethers.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance = await ethers.provider.getBalance(
                      deployer
                  )
                  // Assert
                  assert.equal(endingContractBalance, 0)
                  assert.equal(
                      startingContractBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasPrice).toString()
                  )
              })

              it("Cheaper withdraw", async function() {
                  const accounts = await ethers.getSigners()

                  for (let i = 0; i < 6; i++) {
                      const fundMeConncectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConncectedContract.fund({ value: sendValue })
                  }

                  // Arrange
                  const startingfundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const startingDeployerBalance = await fundMe.provider.getBalance(
                      deployer
                  )

                  // Act
                  const response = await fundMe.cheaperWithdraw()
                  const reciept = await response.wait()
                  const { gasUsed, effectiveGasPrice } = reciept
                  const gasPrice = gasUsed.mul(effectiveGasPrice)
                  console.log(`gas used${gasUsed}:`)
                  console.log(`effective gas price:${effectiveGasPrice}:`)
                  console.log(`gas used${gasPrice}:`)

                  const endingfundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance = await fundMe.provider.getBalance(
                      deployer
                  )

                  // AssertS

                  assert.equal(endingfundMeBalance, 0)
                  assert.equal(
                      startingfundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasPrice)
                  )

                  // Make sure funder is set properly
                  await expect(fundMe.getFunders(0)).to.be.reverted

                  for (let i = 0; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })

              it("only allows the owner to call the withdraw", async function() {
                  const accounts = await ethers.getSigners()
                  const attacker = accounts[1]
                  const attackerConnectedContract = await fundMe.connect(
                      attacker
                  )
                  await expect(attackerConnectedContract.cheaperWithdraw()).to
                      .be.reverted
              })
          })
      })
