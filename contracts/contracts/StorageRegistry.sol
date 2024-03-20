// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.19;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import {AccessControlEnumerable} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {FixedPointMathLib} from "solmate/src/utils/FixedPointMathLib.sol";
import {IStorageRegistry} from "../interfaces/IStorageRegistry.sol";
import {TransferHelper} from "../libraries/TransferHelper.sol";

/**
 * @notice Storage Registry Contract for Aizen IDs
 * @dev This contract is responsible for managing the storage registry for Aizen IDs
 */

contract StorageRegistry is
    IStorageRegistry,
    AccessControlEnumerable,
    Pausable
{
    using FixedPointMathLib for uint256;
    using TransferHelper for address;

    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX ERRORS START XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

    /// @dev Revert if caller attempts to rent storage after the contract is deprecated
    error ContractDeprecated();

    /// @dev Revert if caller attempts to rent more storage than available
    error ExceedsCapacity();

    /// @dev Revert if caller attempts to rent storage with an invalid amount such as zero units
    error InvalidAmount();

    /// @dev Reert if caller attmepts to batch rent storage with mismatched input array lengths or an empty array
    error InvalidBatchInput();

    /// @dev Revert if caller provides wrong payment amount
    error InvalidPayment();

    /// @dev Revert if price feed returns a stale answer
    error StaleAnswer();

    /// @dev Revert if any data feed round is incomplete and not yet generated an answer
    error IncompleteRound();

    /// @dev Revert if data feed returns a timestamp in the future
    error InvalidRoundTimestamp();

    /// @dev Revert if any dtaa feed returns a value greater than acceptable min/max bound
    error PriceOutOfBounds();

    /// @dev Revert if price feed returns a zero or negative price
    error InvalidPrice();

    /// @dev Revert if sequencer uptime feed detects L2 sequencer is unavailable
    error SequencerDown();

    /// @dev Revert if L2 sequencer restarted less than uptimeFeedGracePeriod seconds
    error GracePeriodNotOver();

    /// @dev Revert if deprecation timestamp parameter is in the past
    error InvalidDeprecationTimestamp();

    /// @dev Revert if priceFeedMinAnswer is equal to or greater than priceFeedMaxAnswer
    error InvalidMinAnswer();

    /// @dev Revert if priceFeedMaxAnswer is equal to or lesser than priceFeedMinAnswer
    error InvalidMaxAnswer();

    /// @dev Revert if fixedEthUdsPrice is outside configured price bounds
    error InvalidFixedPrice();

    /// @dev Revert if caller is not an owner
    error NotOwner();

    /// @dev Revert if caller is not an operator
    error NotOperator();

    /// @dev Revert if caller is not a treasurer
    error NotTreasurer();

    /// @dev Revert if caller does not have an authorized role
    error Unauthorized();

    /// @dev Revert if transferred to zero address
    error InvalidAddress();

    /// @dev Revert if caller attempts a continuous credit with an invalid range
    error InvalidRangeInput();

    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX ERRORS END XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX EVENTS START XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

    /** @notice Emit an event when caller pays rent for an aizen id's storage
     * Nodes increase the units of storage for an aizen id for 395 (365 + 30) days from the time of payment
     * @param payer Address of the caller | account paying the rent
     * @param id Aizen ID of the caller which receives the storage units
     * @param units Number of storage units rented
     */

    event Rent(address indexed payer, uint256 indexed id, uint256 units);

    /**
     * @notice Emit an event when the price feed address is updated
     * @param oldFeed Previous price feed address
     * @param newFeed New price feed address
     */
    event SetPriceFeed(address oldFeed, address newFeed);

    /**
     * @notice Emit an event when the uptime feed address is updated
     * @param oldFeed Previous uptime feed address
     * @param newFeed New uptime feed address
     */
    event SetUptimeFeed(address oldFeed, address newFeed);

    /**
     * @notice Emit an event when the price per unit of stroage units is updated by the owner
     * @param oldPrice Previous unit price of storage in usd | Fixed point value with 8 decimals
     * @param newPrice New unit price of storage in usd | Fixed point value with 8 decimals
     */
    event SetPrice(uint256 oldPrice, uint256 newPrice);

    /**
     * @dev Emit an event when an owner changes the fixed ETH/USD price.
     *      Setting this value to zero means the fixed price is disabled.
     *
     * @param oldPrice The previous ETH price in USD. Fixed point value with 8 decimals.
     * @param newPrice The new ETH price in USD. Fixed point value with 8 decimals.
     */
    event SetFixedEthUsdPrice(uint256 oldPrice, uint256 newPrice);
    
    event SetMaxUnits(uint256 oldMax, uint256 newMax);
    event SetDeprecationTimestamp(uint256 oldTimestamp, uint256 newTimestamp);
    event SetCacheDuration(uint256 oldDuration, uint256 newDuration);
    event SetMaxAge(uint256 oldAge, uint256 newAge);

    event SetMinAnswer(uint256 oldPrice, uint256 newPrice);
    event SetMaxAnswer(uint256 oldPrice, uint256 newPrice);
    event SetGracePeriod(uint256 oldPeriod, uint256 newPeriod);
    event SetVault(address oldVault, address newVault);
    event Withdraw(address indexed to, uint256 amount);

    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX EVENTS END XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX CONSTANTS START XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    /**
     * @inheritdoc IStorageRegistry
     */
    string public constant VERSION = "2024.03.20"    // YYYY.MM.DD

    bytes32 internal constant OWNER_ROLE = keccak256("OWNER_ROLE");
    bytes32 internal constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 internal constant TREASURER_ROLE = keccak256("TREASURER_ROLE");
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX CONSTANTS END XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX PARAMETERS START XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    /**
     * @inheritdoc IStorageRegistry
     */
    AggregatorV3Interface public priceFeed;

    /**
     * @inheritdoc IStorageRegistry
     */
    AggregatorV3Interface public uptimeFeed;

    /**
     * @inheritdoc IStorageRegistry
     */
    uint256 public deprecationTimestamp;

    /**
     * @inheritdoc IStorageRegistry
     */
    uint256 public usdUnitPrice;

    /**
     * @inheritdoc IStorageRegistry
     */
    uint256 public fixedEthUsdPrice;

    /**
     * @inheritdoc IStorageRegistry
     */
    uint256 public maxUnits;

    /**
     * @inheritdoc IStorageRegistry
     */
    uint256 public priceFeedCacheDuration;

    /**
     * @inheritdoc IStorageRegistry
     */
    uint256 public priceFeedMaxAge;

    /**
     * @inheritdoc IStorageRegistry
     */
    uint256 public priceFeedMinAnswer;

    /**
     * @inheritdoc IStorageRegistry
     */
    uint256 public priceFeedMaxAnswer;

    /**
     * @inheritdoc IStorageRegistry
     */
    uint256 public uptimeFeedGracePeriod;

    /**
     * @inheritdoc IStorageRegistry
     */
    address public vault;

    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX PARAMETERS END XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXX STORAGE PARAMETERS START XXXXXXXXXXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    /**
     * @inheritdoc IStorageRegistry
     */
    uint256 public rentedUnits;

    /**
     * @inheritdoc IStorageRegistry
     */
    uint256 public ethUsdPrice;

    /**
     * @inheritdoc IStorageRegistry
     */
    uint256 public prevEthUsdPrice;

    /**
     * @inheritdoc IStorageRegistry
     */
    uint256 public lastPriceFeedUpdateTime;

    /**
     * @inheritdoc IStorageRegistry
     */
    uint256 public lastPriceFeedUpdateBlock;

    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXX STORAGE PARAMETERS END XXXXXXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXX CONSTRUCTOR START XXXXXXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    /**
     * @notice Construct a new StorageRegistry contract
     * 
     * @param _priceFeed Chainlink ETH?USD price feed contract
     * @param _uptimeFeed Chainlink L2 sequencer uptime feed contract
     * @param _initialUsdUnitPrice Initial unit price in USD | Fixed point - 8 decimals
     * @param _initialMaxUnits Initial maximum number of storage units
     * @param _initialVault Initial vault address
     * @param _initialRoleAdmin Initial role admin address
     * @param _initialOwner Initial owner address
     * @param _initialOperator Initial operator address
     * @param _initialTreasurer Initial treasurer address
     */

    constructor(
        AggregatorV3Interface _priceFeed,
        AggregatorV3Interface _uptimeFeed,
        uint256 _initialUsdUnitPrice,
        uint256 _initialMaxUnits,
        address _initialVault,
        address _initialRoleAdmin,
        address _initialOwner,
        address _initialOperator,
        address _initialTreasurer) {
            priceFeed = _priceFeed;
            emit SetPriceFeed(address(0), address(_priceFeed));

            uptimeFeed = _uptimeFeed;
            emit SetUptimeFeed(address(0), address(_uptimeFeed));

            deprecationTimestamp = block.timestamp + 365 days;
            emit SetDeprecationTimestamp(0, deprecationTimestamp);

            usdUnitPrice = _initialUsdUnitPrice;
            emit SetPrice(0, _initialUsdUnitPrice);

            maxUnits = _initialMaxUnits;
            emit SetMaxUnits(0, _initialMaxUnits);

            priceFeedCacheDuration = 1 days;
            emit SetCacheDuration(0, 1 days);

            priceFeedMaxAge = 2 hours;
            emit SetMaxAge(0, 2 hours);

            uptimeFeedGracePeriod = 1 hours;
            emit SetGracePeriod(0, 1 hours);

            priceFeedMinAnswer = 100e8;    // 100 USD/ETH
            emit SetMinAnswer(0, 100e8);

            priceFeedMaxAnswer = 10_000e8;    // 10000 USD/ETH
            emit SetMaxAnswer(0, 10_000e8);

            vault = _initialVault;
            emit SetVault(address(0), _initialVault);

            _grantRole(DEFAULT_ADMIN_ROLE, _initialRoleAdmin);
            _grantRole(OWNER_ROLE, _initialOwner);
            _grantRole(OPERATOR_ROLE, _initialOperator);
            _grantRole(TREASURER_ROLE, _initialTreasurer);

            _refreshPrice();
        }
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXX CONSTRUCTOR END XXXXXXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXX MODIFIERS START XXXXXXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

    modifier whenNotDeprecated() {
        if (block.timestamp >= deprecationTimestamp) {
            revert ContractDeprecated()
        } ;
        _;
    }

    modifier onlyOwner() {
        if (!hasRole(OWNER_ROLE, msg.sender)) {
            revert NotOwner();
        }
        _;
    }

    modifier onlyOperator() {
        if (!hasRole(OPERATOR_ROLE, msg.sender)) {
            revert NotOperator();
        }
        _;
    }

    modifier onlyTreasurer() {
        if (!hasRole(TREASURER_ROLE, msg.sender)) {
            revert NotTreasurer();
        }
        _;
    }
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXX MODIFIERS END XXXXXXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXX STORAGE RENTAL LOGIC START XXXXXXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

    /**
     * @inheritdoc IStorageRegistry
     */
    function rent(uint256 id, uint256 units) external payable whenNotPaused whenNotDeprecated returns (uint256 overpayment) {
        if (units == 0) {
            revert InvalidAmount();
        }

        if (rentedUnits + units > maxUnits) {
            revert ExceedsCapacity();
        }

        uint256 totalPrice = _price(units);
        if (msg.value < totalPrice) {
            revert InvalidPayment();
        }

        // Effects
        rentedUnits += units;
        emit Rent(msg.sender, id, units);

        // Interactions
        // Safety Check: Transfer any overpayment back to the caller
        overpayment = msg.value - totalPrice;

        if (overpayment > 0) {
            msg.sender.sendNative(overpayment);    // Change to sendNative when library defined
        }
        
    }

// ToDo: Refactor and rename both _price functions
    /**
     * @inheritdoc IStorageRegistry
     */
    function _price(uint256 units) internal returns (uint256) {
        return _price(units, usdUnitPrice, _ethUsdPrice());
    }

    /**
     * @inheritdoc IStorageRegistry
     */
    function _price(uint256 units, uint256 usdPerUnit, uint256 usdPerEth) internal pure returns (uint256) {
        return (units * usdPerUnit).divWadUp(usdPerEth);
    }

    /**
     * @inheritdoc IStorageRegistry
     */
    function batchRent(uint256[] calldata ids, uint256[] calldata units) external payable whenNotPaused whenNotDeprecated {

        // Validate input
        if (ids.length == 0 || units.length == 0) revert InvalidBatchInput();
        if (ids.length != units.length) revert InvalidBatchInput();

        // Effects
        unit256 _usdPrice = usdUnitPrice;
        uint256 _ethPrice = _ethUsdPrice();

        uint256 totalQty;
        for (uint256 i; i < ids.length; ++i) {
            uint256 qty = units[i];
            if (qty == 0) continue;
            totalQty += qty;
            emit Rent(msg.sender, ids[i], qty);
        }
        uint256 totalPrice = _price(totalQty, _usdPrice, _ethPrice);

        // Checks on capacity and value
        if (rentedUnits + totalQty > maxUnits) {
            revert ExceedsCapacity();
        }
        if (msg.value < totalPrice) {
            revert InvalidPayment();
        }

        // Effects 
        rentedUnits += totalQty;

        // Interactions
        // Safety Check: Transfer any overpayment back to the caller
        if (msg.value > totalPrice) {
            msg.sender.sendNative(msg.value - totalPrice);    // Change to sendNative when library defined
        }
    }

    // PRICE RELATED FUNCTIONS

    /**
     * @inheritdoc IStorageRegistry
     */
    function unitPrice() external view returns (uint256) {
        return price(1);
    }

    /**
     * @inheritdoc IStorageRegistry
     */
    function price(uint256 units) public view returns (uint256) {
        uint256 ethPrice;

        if (fixedEthUsdPrice != 0) {
            ethPrice = fixedEthUsdPrice;
        } else if (lastPriceFeedUpdateBlock == block.number) {
            ethPrice = prevEthUsdPrice;
        } else {
            ethPrice = ethUsdPrice;
        }
        return _price(units, usdUnitPrice, ethPrice);
    }

    /**
     * @dev Return the fixed price if present and the cached ethUsdPrice if it is not.
     * If cached price is no longer valid, refresh the cache from the price feed but
     * return the cached price for the rest of this block to avoid unexpected price
     * changes.
     */
    function _ethUsdPrice() internal returns (uint256) {

        // If the fixed price is set, return it - no external calls - emergencies only
        if (fixedEthUsdPrice != 0) {
            return fixedEthUsdPrice;
        }

        // Check for cache duration - if expired, get latest price from price feed
        // This updates prevEthUsdPrice, ethUsdPrice, lastPriceFeedUpdateTime, and lastPriceFeedUpdateBlock

        if (block.timestamp - lastPriceFeedUpdateTime > priceFeedCacheDuration) {
            _refreshPrice();
        }

        /**
         *  We want price changes to take effect in the first block after the price
         *  refresh, rather than immediately, to keep the price from changing intra
         *  block. If we update the price in this block, use the previous price
         *  until the next block. Otherwise, use the latest price.
         */
        return (lastPriceFeedUpdateBlock == block.number) ? prevEthUsdPrice : ethUsdPrice;
    }

    /**
     * @inheritdoc IStorageRegistry
     * @dev Get the latest ETH/USD price from the price feed and update the cache
     * 1. Get and validate L2 sequencer status | if restarted, ensure grace period has lapsed
     * 2. Get and validate the Chainlink ETH/USD price. Validate that the answer is a positive value, the round is complete, and the answer is not stale by round.
     */
    function _refreshPrice() internal {

        // uptimeFeed: Check if L2 sequencer is down
        (uint256 uptimeRoundId, uint256 sequencerUp, uint256 uptimeStartedAt, uint256 uptimeUpdatedAt) = uptimeFeed.latestRoundData();

        if (sequencerUp != 0) revert SequencerDown();
        if (uptimeRoundId == 0) revert IncompleteRound();
        if (uptimeUpdatedAt == 0) revert IncompleteRound();
        if (uptimeUpdatedAt > block.timestamp) revert InvalidRoundTimestamp();

        uint256 timeSinceUp = block.timestamp - uptimeStartedAt;
        if (timeSinceUp < uptimeFeedGracePeriod) revert GracePeriodNotOver();

        // priceFeed: Get the latest ETH/USD price from the price feed
        (uint80 priceRoundId, int256 answer,, uint256 priceUpdatedAt,) = priceFeed.latestRoundData();

        if (answer <= 0) revert InvalidPrice();
        if (priceRoundId == 0) revert IncompleteRound();
        if (priceUpdatedAt == 0) revert IncompleteRound();
        if (priceUpdatedAt > block.timestamp) revert InvalidRoundTimestamp();
        if (block.timestamp - priceUpdatedAt > priceFeedMaxAge) {revert StaleAnswer()};

        if (uint256(answer) < priceFeedMinAnswer || uint256(answer) > priceFeedMaxAnswer) revert PriceOutOfBounds();

        // Update state variables
        lastPriceFeedUpdateTime = block.timestamp;
        lastPriceFeedUpdateBlock = block.number;

        if (prevEthUsdPrice == 0 && ethUsdPrice == 0) {
            prevEthUsdPrice = uint256(answer);
            ethUsdPrice = uint256(answer);
        } else {
            prevEthUsdPrice = ethUsdPrice;
            ethUsdPrice = uint256(answer);
        }  
    }


    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXX STORAGE RENTAL LOGIC END XXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXX ADMIN FUNCTIONS XXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

    /**
     * @inheritdoc IStorageRegistry
     */
    function credit(uint256 id, uint256 units) external onlyOperator whenNotDeprecated whenNotPaused {
        if (units == 0) {
            revert InvalidAmount();
        }
        if (rentedUnits + units > maxUnits) revert ExceedsCapacity();
        rentedUnits += units;
        emit Rent(msg.sender, id, units);
    }

    /**
     * @inheritdoc IStorageRegistry
     */
    function batchCredit(uint256[] calldata ids, uint256 units) external onlyOperator whenNotDeprecated whenNotPaused {
        if (units == 0) {
            revert InvalidAmount();
        }
        uint256 totalQty = units * ids.length;
        if (rentedUnits + totalQty > maxUnits) {
            revert ExceedsCapacity();
        }
        rentedUnits += totalQty;
        for (uint256 i; i < ids.length; ++i) {
            emit Rent(msg.sender, ids[i], units);
        }
    }


    function continuousCredit(uint256 start, uint256 end, uint256 units) external onlyOperator whenNotDeprecated whenNotPaused {
        if (units == 0) revert InvalidAmount();
        if (start >= end) {
            revert InvalidRangeInput();
        }

        uint256 len = end - start + 1;
        uint256 totalQty = units * len;

        if (rentedUnits + totalQty > maxUnits) {
            revert ExceedsCapacity();
        }
        rentedUnits += totalQty;
        for (uint256 i; i < len; ++i) {
            emit Rent(msg.sender, start + i, units);
        }
    }

    /**
     * @inheritdoc IStorageRegistry
     */
    function refreshPrice() external onlyOperator whenNotDeprecated whenNotPaused {
        if (!hasRole(OWNER_ROLE, msg.sender) && !hasRole(TREASURER_ROLE, msg.sender)) {
            revert Unauthorized();
        }
        _refreshPrice();
    }

    /**
     * @inheritdoc IStorageRegistry
     */
    function setPriceFeed(AggregatorV3Interface feed) external onlyOwner {
        emit SetPriceFeed(address(priceFeed), address(feed));
        priceFeed = feed;
    }

    /**
     * @inheritdoc IStorageRegistry
     */
    function setUptimeFeed(AggregatorV3Interface feed) external onlyOwner {
        emit SetUptimeFeed(address(uptimeFeed), address(feed));
        uptimeFeed = feed; 
    }

    /**
     * @inheritdoc IStorageRegistry
     */
    function setPrice(uint256 usdPrice) external onlyOwner {
        emit SetPrice(usdUnitPrice, usdPrice);
        usdUnitPrice = usdPrice;
    }

    /**
     * @inheritdoc IStorageRegistry
     */
    function setFixedEthUsdPrice(uint256 fixedPrice) external onlyOwner {
        if (fixedPrice != 0) {
            if (fixedPrice < priceFeedMinAnswer || fixedPrice > priceFeedMaxAnswer) {
                revert InvalidFixedPrice();
            }
        }
        emit SetFixedEthUsdPrice(fixedEthUsdPrice, fixedPrice);
        fixedEthUsdPrice = fixedPrice; 
    }

    /**
     * @inheritdoc IStorageRegistry
     */
    function setMaxUnits(uint256 max) external onlyOwner {
        emit SetMaxUnits(maxUnits, max);
        maxUnits = max;
    }

    /**
     * @inheritdoc IStorageRegistry
     */
    function setDeprecationTimestamp(uint256 timestamp) external onlyOwner {
        if (timestamp < block.timestamp) {
            revert InvalidDeprecationTimestamp();
        }
        emit SetDeprecationTimestamp(deprecationTimestamp, timestamp);
        deprecationTimestamp = timestamp;
    }

    /**
     * @inheritdoc IStorageRegistry
     */
    function setCacheDuration(uint256 duration) external onlyOwner {
        emit SetCacheDuration(priceFeedCacheDuration, duration);
        priceFeedCacheDuration = duration;
    }

    /**
     * @inheritdoc IStorageRegistry
     */
    function setMaxAge(uint256 age) external onlyOwner {
        emit SetMaxAge(priceFeedMaxAge, age);
        priceFeedMaxAge = age;
    }

    /**
     * @inheritdoc IStorageRegistry
     */
    function setMinAnswer(uint256 minPrice) external onlyOwner {
        if (minPrice >= priceFeedMaxAnswer) {
            revert InvalidMinAnswer();
        }
        emit SetMinAnswer(priceFeedMinAnswer, minPrice);
        priceFeedMinAnswer = minPrice;
    }

    /**
     * @inheritdoc IStorageRegistry
     */
    function setMaxAnswer(uint256 maxPrice) external onlyOwner {
        if (maxPrice <= priceFeedMinAnswer) {
            revert InvalidMaxAnswer();
        }
        emit SetMaxAnswer(priceFeedMaxAnswer, maxPrice);
        priceFeedMaxAnswer = maxPrice;
    }

    /**
     * @inheritdoc IStorageRegistry
     */
    function setGracePeriod(uint256 period) external onlyOwner {
        emit SetGracePeriod(uptimeFeedGracePeriod, period);
        uptimeFeedGracePeriod = period;
    }

    /**
     * @inheritdoc IStorageRegistry
     */
    function setVault(address vaultAddr) external onlyOwner {
        if (vaultAddr == address(0)) revert InvalidAddress();
        emit SetVault(vault, vaultAddr);
        vault = vaultAddr;
    }

    /**
     * @inheritdoc IStorageRegistry
     */
    function withdraw(uint256 amount) external onlyTreasurer {
        if (amount == 0) revert InvalidAmount();
        if (amount > address(this).balance) revert InvalidAmount();
        emit Withdraw(vault, amount);
        vault.sendNative(amount);
    }

    /**
     * @inheritdoc IStorageRegistry
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @inheritdoc IStorageRegistry
     */
    function unpause() external onlyOwner {
        _unpause();
    }



}
