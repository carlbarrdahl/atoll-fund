// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title Project
 * @dev A crowdfunding project contract that allows contributors to fund projects with ERC20 tokens.
 */
contract Project is Ownable, Initializable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    /// @notice The ERC20 token used for funding (e.g., USDC)
    IERC20 public token;

    /// @notice Project metadata (e.g., IPFS hash or URL)
    string public metadata;

    /// @notice Timestamp when the funding period ends
    uint256 public deadline;

    /// @notice Funding goal amount
    uint256 public target;

    /// @notice Minimum funding amount per contribution
    uint256 public minFundingAmount;

    /// @notice Maximum possible funding target
    uint256 public maxFundingAmount;

    /// @notice Minimum duration for a project (e.g., 1 hour)
    uint256 public minDuration;

    /// @notice Maximum duration for a project (e.g., 365 days)
    uint256 public maxDuration;

    /// @notice Flag indicating if funds have been withdrawn
    bool public withdrawn;

    /// @notice Total amount of funds raised
    uint256 public totalRaised;

    /// @notice Mapping of contributor address to their contribution amount
    mapping(address => uint256) public contributions;

    // Events
    /// @notice Emitted when the project is initialized
    event ProjectInitialized(
        address indexed projectAddress,
        address indexed owner,
        address indexed token,
        string metadata,
        uint256 deadline,
        uint256 target,
        uint256 minFundingAmount,
        uint256 maxFundingAmount,
        uint256 minDuration,
        uint256 maxDuration
    );

    /// @notice Emitted when a contribution is made
    event Funded(address indexed funder, uint256 amount);

    /// @notice Emitted when funds are withdrawn by the project owner
    event Withdrawn(address indexed owner, uint256 amount);

    /// @notice Emitted when a contributor receives a refund
    event Refunded(
        address indexed funder,
        uint256 contributionAmount,
        uint256 bonusAmount
    );

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Initializes the Project contract with the specified parameters.
     * @param _token The ERC20 token used for funding
     * @param _owner The address of the project owner
     * @param _metadata Project metadata (IPFS hash or URL)
     * @param _deadline Funding period end timestamp
     * @param _target Funding goal amount
     * @param _minFundingAmount Minimum contribution amount
     * @param _maxFundingAmount Maximum possible funding target
     * @param _minDuration Minimum duration for the project in seconds
     * @param _maxDuration Maximum duration for the project in seconds
     */
    function initialize(
        IERC20 _token,
        address _owner,
        string memory _metadata,
        uint256 _deadline,
        uint256 _target,
        uint256 _minFundingAmount,
        uint256 _maxFundingAmount,
        uint256 _minDuration,
        uint256 _maxDuration
    ) external initializer {
        require(_minDuration > 0, "Min duration must be greater than zero");
        require(
            _maxDuration > _minDuration,
            "Max duration must be greater than min duration"
        );
        require(
            _deadline >= block.timestamp + _minDuration,
            "Deadline too soon"
        );
        require(
            _deadline <= block.timestamp + _maxDuration,
            "Deadline too far"
        );
        require(_target <= _maxFundingAmount, "Target above max funding");
        require(_target > _minFundingAmount, "Target below min funding");
        require(bytes(_metadata).length > 0, "Empty metadata");
        require(
            _minFundingAmount > 0,
            "Min funding amount must be greater than zero"
        );
        require(_owner != address(0), "Invalid owner address");
        require(address(_token) != address(0), "Invalid token address");

        token = _token;
        _transferOwnership(_owner);

        metadata = _metadata;
        deadline = _deadline;
        target = _target;
        minFundingAmount = _minFundingAmount;
        maxFundingAmount = _maxFundingAmount;
        minDuration = _minDuration;
        maxDuration = _maxDuration;
        withdrawn = false;
        totalRaised = 0;

        emit ProjectInitialized(
            address(this),
            _owner,
            address(_token),
            _metadata,
            _deadline,
            _target,
            _minFundingAmount,
            _maxFundingAmount,
            _minDuration,
            _maxDuration
        );
    }

    /**
     * @dev Function for users to fund the project.
     * @param _amount The amount of tokens to contribute.
     */
    function fund(uint256 _amount) external nonReentrant {
        require(block.timestamp < deadline, "Funding period has ended");
        require(
            _amount >= minFundingAmount,
            "Amount below minimum funding amount"
        );

        // Transfer tokens from the funder to this contract
        token.safeTransferFrom(msg.sender, address(this), _amount);

        // Update contributor's balance and total raised
        contributions[msg.sender] += _amount;
        totalRaised += _amount;

        emit Funded(msg.sender, _amount);
    }

    /**
     * @dev Function for the project owner to withdraw funds if the target is met.
     */
    function withdraw() external onlyOwner nonReentrant {
        require(block.timestamp >= deadline, "Cannot withdraw before deadline");
        require(!withdrawn, "Funds already withdrawn");
        require(totalRaised >= target, "Funding target not reached");

        withdrawn = true;

        uint256 balance = token.balanceOf(address(this));
        token.safeTransfer(owner(), balance);

        emit Withdrawn(owner(), balance);
    }

    /**
     * @dev Function for contributors to refund their contributions if the target wasn't met.
     */
    function refund() external nonReentrant {
        require(block.timestamp >= deadline, "Cannot refund before deadline");
        require(totalRaised < target, "Funding target met, cannot refund");
        require(msg.sender != owner(), "Owner cannot refund");

        uint256 contributedAmount = contributions[msg.sender];
        uint256 ownerContribution = contributions[owner()];
        uint256 contributionsTotal = totalRaised - ownerContribution;

        require(contributedAmount > 0, "No contributions to refund");
        require(contributionsTotal > 0, "No contributions to calculate bonus");

        // Calculate the bonus
        uint256 bonus = 0;
        if (ownerContribution > 0) {
            bonus =
                (ownerContribution * contributedAmount) /
                contributionsTotal;
        }

        // Update contributions mapping before transfer
        contributions[msg.sender] = 0;
        if (bonus > 0) {
            require(
                contributions[owner()] >= bonus,
                "Insufficient owner contribution"
            );
            contributions[owner()] -= bonus;
        }

        uint256 refundAmount = contributedAmount + bonus;
        require(
            token.balanceOf(address(this)) >= refundAmount,
            "Insufficient contract balance"
        );
        token.safeTransfer(msg.sender, refundAmount);

        emit Refunded(msg.sender, refundAmount, bonus);
    }

    /**
     * @dev Returns all project details
     * @return tokenAddress The address of the funding token
     * @return projectMetadata The project metadata
     * @return fundingDeadline The funding deadline timestamp
     * @return fundingTarget The funding goal amount
     * @return minimumFunding The minimum contribution amount
     * @return maximumFunding The maximum possible funding target
     * @return projectMinDuration The minimum project duration
     * @return projectMaxDuration The maximum project duration
     * @return isWithdrawn Whether funds have been withdrawn
     * @return totalFundsRaised Total amount raised
     * @return projectOwner The project owner address
     */
    function getProjectDetails()
        external
        view
        returns (
            address tokenAddress,
            string memory projectMetadata,
            uint256 fundingDeadline,
            uint256 fundingTarget,
            uint256 minimumFunding,
            uint256 maximumFunding,
            uint256 projectMinDuration,
            uint256 projectMaxDuration,
            bool isWithdrawn,
            uint256 totalFundsRaised,
            address projectOwner
        )
    {
        return (
            address(token),
            metadata,
            deadline,
            target,
            minFundingAmount,
            maxFundingAmount,
            minDuration,
            maxDuration,
            withdrawn,
            totalRaised,
            owner()
        );
    }
}

/**
 * @title ProjectFactory
 * @dev Factory contract for creating new Project instances using the minimal proxy pattern
 */
contract ProjectFactory {
    using Clones for address;

    /// @notice The address of the Project implementation contract
    address public immutable implementation;

    /// @notice Default minimum duration for projects (1 hour)
    uint256 public constant DEFAULT_MIN_DURATION = 1 hours;

    /// @notice Default maximum duration for projects (365 days)
    uint256 public constant DEFAULT_MAX_DURATION = 365 days;

    /// @notice Emitted when a new project is created
    event ProjectCreated(
        address indexed projectAddress,
        address indexed owner,
        address indexed token,
        string metadata,
        uint256 deadline,
        uint256 target,
        uint256 minFundingAmount,
        uint256 maxFundingAmount,
        uint256 minDuration,
        uint256 maxDuration
    );

    constructor(address _implementation) {
        require(
            _implementation != address(0),
            "Invalid implementation address"
        );
        implementation = _implementation;
    }

    /**
     * @dev Creates a new project clone
     * @param _token The ERC20 token used for funding
     * @param _metadata Project metadata
     * @param _deadline Funding period end timestamp
     * @param _target Funding goal amount
     * @param _minFundingAmount Minimum contribution amount
     * @param _minDuration Optional minimum duration for the project (defaults to 1 hour)
     * @param _maxDuration Optional maximum duration for the project (defaults to 365 days)
     * @return clone Address of the newly created project
     */
    function createProject(
        IERC20 _token,
        string memory _metadata,
        uint256 _deadline,
        uint256 _target,
        uint256 _minFundingAmount,
        uint256 _minDuration,
        uint256 _maxDuration
    ) external returns (address clone) {
        // Use default durations if 0 is provided
        uint256 minDuration = _minDuration == 0
            ? DEFAULT_MIN_DURATION
            : _minDuration;
        uint256 maxDuration = _maxDuration == 0
            ? DEFAULT_MAX_DURATION
            : _maxDuration;

        uint256 maxFundingAmount = type(uint96).max;

        clone = Clones.clone(implementation);

        Project(clone).initialize(
            _token,
            msg.sender,
            _metadata,
            _deadline,
            _target,
            _minFundingAmount,
            maxFundingAmount,
            minDuration,
            maxDuration
        );

        emit ProjectCreated(
            clone,
            msg.sender,
            address(_token),
            _metadata,
            _deadline,
            _target,
            _minFundingAmount,
            maxFundingAmount,
            minDuration,
            maxDuration
        );

        return clone;
    }
}
