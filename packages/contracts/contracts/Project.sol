// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Project is Ownable, Initializable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // The ERC20 token used for funding (e.g., USDC)
    IERC20 public token;

    // Project metadata (e.g., IPFS hash or URL)
    string public metadata;
    // Timestamp when the funding period ends
    uint256 public deadline;
    // Funding goal amount
    uint256 public target;
    // Minimum funding amount per contribution
    uint256 public minFundingAmount;
    // Flag indicating if funds have been withdrawn
    bool public withdrawn;
    // Total amount of funds raised
    uint256 public totalRaised;
    // Mapping of contributor address to their contribution amount
    mapping(address => uint256) public contributions;

    // Events for logging activities
    event Funded(address indexed funder, uint256 amount);
    event Withdrawn(address indexed owner, uint256 amount);
    event Refunded(address indexed funder, uint256 amount);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Initialize function to set up the Project contract.
     * @param _token The ERC20 token used for funding (e.g., USDC).
     * @param _owner The address of the project owner.
     * @param _metadata A string containing project metadata.
     * @param _deadline A future timestamp indicating the funding deadline.
     * @param _target The funding goal amount.
     * @param _minFundingAmount The minimum amount per contribution.
     */
    function initialize(
        IERC20 _token,
        address _owner,
        string memory _metadata,
        uint256 _deadline,
        uint256 _target,
        uint256 _minFundingAmount
    ) external initializer {
        require(_deadline > block.timestamp, "Deadline must be in the future");
        require(_target > 0, "Target must be greater than zero");
        require(
            _minFundingAmount > 0,
            "Min funding amount must be greater than zero"
        );
        require(_owner != address(0), "Invalid owner address");
        require(address(_token) != address(0), "Invalid token address");

        token = _token;

        _transferOwnership(_owner);

        // Initialize project parameters
        metadata = _metadata;
        deadline = _deadline;
        target = _target;
        minFundingAmount = _minFundingAmount;
        withdrawn = false;
        totalRaised = 0;
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

        uint256 contributedAmount = contributions[msg.sender];
        require(contributedAmount > 0, "No contributions to refund");

        // Reset the contributor's balance
        contributions[msg.sender] = 0;
        totalRaised -= contributedAmount;

        token.safeTransfer(msg.sender, contributedAmount);

        emit Refunded(msg.sender, contributedAmount);
    }

    /**
     * @dev Function to get the project details.
     * @return tokenAddress The address of the ERC20 token used for funding.
     * @return projectMetadata The metadata of the project.
     * @return fundingDeadline The timestamp when the funding period ends.
     * @return fundingTarget The funding goal amount.
     * @return minimumFundingAmount The minimum funding amount per contribution.
     * @return isWithdrawn Flag indicating if funds have been withdrawn.
     * @return totalFundsRaised The total amount of funds raised.
     */
    function getProjectDetails()
        external
        view
        returns (
            address tokenAddress,
            string memory projectMetadata,
            uint256 fundingDeadline,
            uint256 fundingTarget,
            uint256 minimumFundingAmount,
            bool isWithdrawn,
            uint256 totalFundsRaised
        )
    {
        return (
            address(token),
            metadata,
            deadline,
            target,
            minFundingAmount,
            withdrawn,
            totalRaised
        );
    }
}

contract ProjectFactory {
    using Clones for address;

    // Address of the Project implementation contract
    address public immutable implementation;

    // Array to keep track of all deployed project addresses
    address[] public allProjects;

    // Event emitted when a new project is created
    event ProjectCreated(address indexed projectAddress, address indexed owner);

    constructor() {
        // Deploy the implementation contract
        implementation = address(new Project());
    }

    /**
     * @dev Function to create a new project clone.
     * @param _token The ERC20 token used for funding.
     * @param _metadata A string containing project metadata.
     * @param _deadline A future timestamp indicating the funding deadline.
     * @param _target The funding goal amount.
     * @param _minFundingAmount The minimum amount per contribution.
     */
    function createProject(
        IERC20 _token,
        string memory _metadata,
        uint256 _deadline,
        uint256 _target,
        uint256 _minFundingAmount
    ) external returns (address) {
        // Clone the Project implementation contract
        address clone = Clones.clone(implementation);

        // Initialize the clone with project configuration
        Project(clone).initialize(
            _token,
            msg.sender,
            _metadata,
            _deadline,
            _target,
            _minFundingAmount
        );

        // Add the new project to the list
        allProjects.push(clone);

        emit ProjectCreated(clone, msg.sender);

        return clone;
    }

    /**
     * @dev Function to get all deployed projects.
     * @return An array of project addresses.
     */
    function getAllProjects() external view returns (address[] memory) {
        return allProjects;
    }
}
