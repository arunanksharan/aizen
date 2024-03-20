// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.19;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

interface IStorageRegistry {
    // CONSTANTS
    /**
     * @notice Version of contract specified in protocol version scheme
     */
    function VERSION() external view returns (string memory);

    // PARAMETERS
    // PRICE OF STORAGE - Needs Chainlinks feeds for ETH/USD conversion

    /**
     * @notice Chainlink's ETH/USD price feed
     */
    function priceFeed() external view returns (AggregatorV3Interface);

    /**
     * @notice Chainlink L2 Sequencer Uptime Feed
     */
    function uptimeFeed() external view returns (AggregatorV3Interface);

    /**
     * @notice Deprecation TImestamp - block timestamp at which this contract will stop accepting storage rent payment - can be changed by the owner
     */
    function deprecationTimestamp() external view returns (uint256);

    /**
     * @notice Price per storage unit in USD | Fixed point value with 8 decimals | Can be changed by the owner
     * @dev This value is multiplied by 1e8 to convert to fixed point - 10e8 = USD 10
     */
    function usdUnitPrice() external view returns (uint256);

    /**
     * @notice A fixed ETH/USD price - override Chainlink Feed | If this value is non-zero, use this price | External calls to price feed are disabled | Can be changed by the owner | Contingency for price feed failure
     */
    function fixedEthUsdPrice() external view returns (uint256);

    /**
     * @notice Total storage units in the registry | Can be changed by the owner
     */
    function maxUnits() external view returns (uint256);

    /**
     * @notice Duration to cache ethUsdPrice before updating it | Can be changed by the owner
     */
    function priceFeedCacheDuration() external view returns (uint256);

    /**
     * @notice Maximum age of price feed answer before considered stale/old | Can be changed by the owner
     */
    function priceFeedMaxAge() external view returns (uint256);

    /**
     * @notice Lower bound on acceptable price feed answer | Can be changed by the owner
     */
    function priceFeedMinAnswer() external view returns (uint256);

    /**
     * @notice Upper bound on acceptable price feed answer | Can be changed by the owner
     */
    function priceFeedMaxAnswer() external view returns (uint256);

    /**
     * @notice Grace period for sequencer uptime feed in seconds | TIme to wait after L2 sequencer restarts before resuming rentals | Can be changed by the owner
     */
    function uptimeFeedGracePeriod() external view returns (uint256);

    /**
     * @notice Vault address to which treasurer can role can withdraw funds | Can be changed by the owner
     */
    function vault() external view returns (address);

    /**
     * @notice Total number of storage units which have been rented
     */
    function rentedUnits() external view returns (uint256);

    /**
     * @notice Cached Chainlink ETH/USD price.
     */
    function ethUsdPrice() external view returns (uint256);

    /**
     * @notice Previously cached Chainlink ETH/USD price.
     */
    function prevEthUsdPrice() external view returns (uint256);

    /**
     * @notice Timestamp of the last update to ethUsdPrice.
     */
    function lastPriceFeedUpdateTime() external view returns (uint256);

    /**
     * @notice Block number of the last update to ethUsdPrice.
     */
    function lastPriceFeedUpdateBlock() external view returns (uint256);

    // STORAGE RENTAL LOGIC
    /**
     * @notice Rent storage for a givenfid for a year | Caller to provide atleast price(units) in wei of payment | Excess payment is refunded to caller
     * 1. Nodes provide storage for 365 days from the time of payment + 30 days grace
     *
     * @param aid Aizen ID of the caller which receives the storage units
     * @param units Number of storage units to rent
     */
    function rent(
        uint256 aid,
        uint256 units
    ) external payable returns (uint256 overpayment);

    /**
     * @notice Rent storage for multiple aids for a year | Caller to provide atleast price(units) in wei of payment which is the sum of storage units | Excess payment is refunded to caller
     * @param aids Array of Aizen IDs of the caller which receives the storage units
     * @param units Array of Number of storage units to rent | Length of array to be the same as aids array
     */
    function batchRent(
        uint256[] calldata aids,
        uint256[] calldata units
    ) external payable;

    // PRICE
    /**
     * @notice Calculate the cost in wei to rent one storage unit
     * @return uint256 Cost in wei
     */
    function unitPrice() external view returns (uint256);

    /**
     * @notice Calculate the cost in wei to rent given number of storage units
     * @param units Number of storage units
     * @return uint256 Cost in wei
     */
    function price(uint256 units) external view returns (uint256);

    // ADMIN FUNCTIONS

    /**
     * @notice Credit a single aid with free storage units | Can be called by the operator
     *
     * @param aid Aizen ID to credit
     * @param units Number of storage units to credit
     */
    function credit(uint256 aid, uint256 units) external;

    /**
     * @notice Credit multiple aids with free storage units | Can be called by the operator
     *
     * @param aids Array of Aizen IDs to credit
     * @param units Array of Number of storage units to credit | Length of array to be the same as aids array
     */
    function batchCredit(
        uint256[] calldata aids,
        uint256[] calldata units
    ) external;

    /**
     * @notice Credit a continuous sequence of fids with free storage units. Only callable by operator.
     *
     * @param start Lowest fid in sequence (inclusive).
     * @param end   Highest fid in sequence (inclusive).
     * @param units Number of storage units per fid.
     */
    function continuousCredit(
        uint256 start,
        uint256 end,
        uint256 units
    ) external;

    /**
     * @notice Force refresh the cached Chainlink ETH/USD price. Callable by owner and treasurer.
     */
    function refreshPrice() external;

    /**
     * @notice Change the price feed addresss. Callable by owner.
     *
     * @param feed The new price feed.
     */
    function setPriceFeed(AggregatorV3Interface feed) external;

    /**
     * @notice Change the uptime feed addresss. Callable by owner.
     *
     * @param feed The new uptime feed.
     */
    function setUptimeFeed(AggregatorV3Interface feed) external;

    /**
     * @notice Change the USD price per storage unit. Callable by owner.
     *
     * @param usdPrice The new unit price in USD. Fixed point value with 8 decimals.
     */
    function setPrice(uint256 usdPrice) external;

    /**
     * @notice Set the fixed ETH/USD price, disabling the price feed if the value is
     *         nonzero. This is an emergency fallback in case of a price feed failure.
     *         Only callable by owner.
     *
     * @param fixedPrice The new fixed ETH/USD price. Fixed point value with 8 decimals.
     *                   Setting this value back to zero from a nonzero value will
     *                   re-enable the price feed.
     */
    function setFixedEthUsdPrice(uint256 fixedPrice) external;

    /**
     * @notice Change the maximum supply of storage units. Only callable by owner.
     *
     * @param max The new maximum supply of storage units.
     */
    function setMaxUnits(uint256 max) external;

    /**
     * @notice Change the deprecationTimestamp. Only callable by owner.
     *
     * @param timestamp The new deprecationTimestamp. Must be at least equal to block.timestamp.
     */
    function setDeprecationTimestamp(uint256 timestamp) external;

    /**
     * @notice Change the priceFeedCacheDuration. Only callable by owner.
     *
     * @param duration The new priceFeedCacheDuration.
     */
    function setCacheDuration(uint256 duration) external;

    /**
     * @notice Change the priceFeedMaxAge. Only callable by owner.
     *
     * @param age The new priceFeedMaxAge.
     */
    function setMaxAge(uint256 age) external;

    /**
     * @notice Change the priceFeedMinAnswer. Only callable by owner.
     *
     * @param minPrice The new priceFeedMinAnswer. Must be less than current priceFeedMaxAnswer.
     */
    function setMinAnswer(uint256 minPrice) external;

    /**
     * @notice Change the priceFeedMaxAnswer. Only callable by owner.
     *
     * @param maxPrice The new priceFeedMaxAnswer. Must be greater than current priceFeedMinAnswer.
     */
    function setMaxAnswer(uint256 maxPrice) external;

    /**
     * @notice Change the uptimeFeedGracePeriod. Only callable by owner.
     *
     * @param period The new uptimeFeedGracePeriod.
     */
    function setGracePeriod(uint256 period) external;

    /**
     * @notice Change the vault address that can receive funds from this contract.
     *         Only callable by owner.
     *
     * @param vaultAddr The new vault address.
     */
    function setVault(address vaultAddr) external;

    /**
     * @notice Withdraw a specified amount of ether from the contract balance to the vault.
     *         Only callable by treasurer.
     *
     * @param amount The amount of ether to withdraw.
     */
    function withdraw(uint256 amount) external;

    /**
     * @notice Pause, disabling rentals and credits.
     *         Only callable by owner.
     */
    function pause() external;

    /**
     * @notice Unpause, enabling rentals and credits.
     *         Only callable by owner.
     */
    function unpause() external;
}
