import {
    useAccount,
    useConnect,
    useDisconnect,
    useContractReads,
    usePrepareContractWrite,
    useContractWrite,
    erc20ABI
  } from 'wagmi'
import contractABI from "./ABI/ContractABI.json"
import { useState } from 'react'
  
  export default function Profile() {
    const stakingContract = '0x571f830C36EAFAe5d11654211636291fa0e460A9'
    const amount = 2 * Math.pow(10, 18);
    const { address, connector, isConnected } = useAccount()
    const [tokenAddress, setTokenAddress] = useState('');
    const { connect, connectors, pendingConnector } =useConnect()
    const { disconnect } = useDisconnect()

    // const stakingContract = {
    //   address: '0x571f830C36EAFAe5d11654211636291fa0e460A9',
    //   abi: contractABI,
    // }
    // const staketokenAddress = {
    //   address: '0x01Ce6F7B62CCeC4D1f73c13c50E7F341378d88A3',
    //   abi: erc20ABI,
    // }

    // const { data, isError, isLoading } = useContractReads({
    //   contracts: [
    //     {
    //       ...stakingContract,
    //       functionName: 'lastRewardBlock',
    //     },
    //     {
    //       ...staketokenAddress,
    //       functionName: 'decimals',
    //     },
    //     {
    //       ...staketokenAddress,
    //       functionName: 'balanceOf',
    //       args:[address]
    //     },
    //   ],
    // })

    const { config: depositConfig, error, isError } = usePrepareContractWrite({
      address: stakingContract,
      abi: contractABI,
      functionName: 'deposit',
      args:[amount],
      onSuccess(data) {
        console.log('usePrepareContractWrite Success', data)
      },
      onError(error) {
        console.log('usePrepareContractWrite Error', error)
      },
      onSettled(data, error) {
        console.log('usePrepareContractWrite Settled', { data, error })
      },
    })
    const { data:depositData, write: depositWrite, isLoading } = useContractWrite(depositConfig)

    console.log(depositData)
  
    if (isConnected) {
      return (
        <div className='main-div'>
          <div>
          <div>Connected to {address}</div>
          <button onClick={disconnect}>Disconnect</button>
          </div>
          <div className='stak-div'>
            <input 
            type='text'
            className='stake-input'
            placeholder='Enter Amount'
            value={tokenAddress}
            onChange={(e) =>  setTokenAddress(e.target.value)}
            />
            <button onClick={() => depositWrite()}>Stake</button>
            <p>{isError}</p>
          </div>
        </div>
      )
    }
  
    return (
      <div>
        {connectors.map((connector) => (
          <button
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => connect({ connector })}
          >
            {connector.name}
            {!connector.ready && ' (unsupported)'}
            {/* {isLoading &&
              connector.id === pendingConnector?.id &&
              ' (connecting)'} */}
          </button>
        ))}
  
        {error && <div>{error.message}</div>}
      </div>
    )
  }
  