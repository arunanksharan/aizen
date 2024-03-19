// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.19;

import {IMigration} from "../interfaces/IMigration.sol";
import {Guardians} from "./Guardians.sol";

abstract contract Migration is IMigration, Guardians {
    // IMMUTABLES
    /**
     * @inheritdoc IMigration
     */
    uint256 public immutable gracePeriod;

    // STORAGE
    /**
     * @inheritdoc IMigration
     */
    address public migrator;

    /**
     * @inheritdoc IMigration
     */
    uint256 public migratedAt;

    // MODIFIERS
    modifier onlyMigrator() {
        if (msg.sender != migrator) {
            revert OnlyMigrator();
        }
        if (isMigrated() && block.timestamp > migratedAt + gracePeriod) {
            revert PermissionRevoked();
        }
        _requirePaused();
        _;
    }

    // CONSTRUCTOR
    constructor(
        uint256 _gracePeriod,
        address _migrator,
        address _initalOwner
    ) Guardians(_initialOwner) {
        gracePeriod = _gracePeriod;
        migrator = _migrator;
        emit SetMigrator(address(0), _migrator);
        _pause();
    }

    // VIEWS
    /**
     * @inheritdoc IMigration
     */
    function isMigrated() public view returns (bool) {
        return migratedAt != 0;
    }

    // MIGRATION LOGIC

    /**
     * @inheritdoc IMigration
     */
    function migrate() external {
        if (msg.sender != migrator) {
            revert OnlyMigrator();
        }
        if (isMigrated()) {
            revert AlreadyMigrated();
        }
        _requirePaused();
        migratedAt = uint256(block.timestamp);
        emit Migrated(migratedAt);
    }

    /**
     * @inheritdoc IMigration
     */
    function setMigrator(address _migrator) public onlyOwner {
        if (isMigrated()) {
            revert AlreadyMigrated();
        }
        _requirePaused();
        emit SetMigrator(migrator, _migrator);
        migrator = _migrator;
    }
}
