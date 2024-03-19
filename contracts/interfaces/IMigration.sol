// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.19;

interface IMigration {
    // ERRORS
    /**
     * @dev Revert if caller is not the migrator
     */
    error OnlyMigrator();

    /**
     * @dev Revert if migrator calls a migration function after the grace period
     */
    error PermissionRevoked();

    /**
     * @dev Revert if migrator calls migrate more than once
     */
    error AlreadyMigrated();

    // EVENTS
    /**
     * @dev Emits an event when admin calls migrate(). Used to migrate Nodes from reading events from one contract to another
     *
     * @param migratedAt The timestamp of the migration
     */
    event Migrated(uint256 indexed migratedAt);

    /**
     * @notice Emit an event when owner changes the migrator address
     *
     * @param oldMigrator The old migrator address
     * @param newMigrator The new migrator address
     */

    event SetMigrator(address oldMigrator, address newMigrator);

    // IMMUTABLES
    /**
     * @notice Period in seconds after migration during which admin can continue to call protected migration functions | A timeframe to make corrections to migrated data during this grace period
     */
    function gracePeriod() external view returns (uint256);

    // STORAGE

    /**
     * @notice Migration Admin Address
     */
    function migrator() external view returns (address);

    /**
     * @notice Timestamp at which data is migrated | Nodes will change to the new contract after this timestamp as their source of truth
     */
    function migratedAt() external view returns (uint256);

    // VIEWS
    /**
     * @notice Check if the contract has been migrated
     *
     * @return bool - true if the contract has been migrated
     */
    function isMigrated() external view returns (bool);

    // PERMISSIONED FUNCTIONS
    /**
     * @notice Set the time of migration and emit an event | Nodes will listen to this event and change to the new contract as their source of truth after this timestamp
     * Only callable by the migrator
     */

    function migrate() external;

    /**
     * @notice Set the migrator address | Only callable by the owner
     *
     * @param _migrator Migration Admin Address
     */
    function setMigrator(address _migrator) external;
}
