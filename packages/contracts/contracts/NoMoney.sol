// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NoneMoney {
    event give_money(bool success_holder);
    event return_money(bool success_donor);

    struct Donor {
        uint256 donate_money;
    }

    struct Donate_project {
        string name;
        string description;
        bool state; // 0:donate中 1:審核中 2:結束
        uint256 target_money;
        uint256 get_money;
        address holder_account;
        mapping(address => Donor) donor_map; //donor data
        address[] donor_arr; //donor id
    }

    address owner;
    ///
    uint256[] donate_project_arr;
    mapping(uint256 => Donate_project) donate_project_map;
    ///
    address[] holder_arr;
    ///
    modifier onlyOwner() {
        require(owner == msg.sender, "Only Owner"); //檢查是否為管理者
        _;
    }

    constructor() payable {
        owner = msg.sender;
    }

    function add_project(
        address _holder_account,
        string memory _name,
        string memory _description,
        uint256 _target_money
    ) public {
        require(
            _holder_account != address(0),
            "Holder account cannot be zero address"
        );
        require(bytes(_name).length > 0, "Project name is required");
        require(_target_money > 0, "Set _target_money must be greater than 0");

        uint256 _id = donate_project_arr.length;

        Donate_project storage p = donate_project_map[_id];

        p.holder_account = _holder_account;
        p.name = _name;
        p.description = _description;
        p.state = false;
        p.target_money = _target_money;
        p.get_money = 0;

        donate_project_arr.push(_id);

        if (!_is_holder(_holder_account)) {
            holder_arr.push(_holder_account);
        }
    }

    function add_project_donor(uint256 _project_id) public payable {
        require(msg.value > 0, "Donation must be greater than 0");
        address payable _donor_account = payable(msg.sender);

        uint256 input_money = msg.value;

        Donate_project storage project = donate_project_map[_project_id];

        uint256 temp_money = project.get_money + input_money;
        uint256 target_money = project.target_money;

        project.donor_map[_donor_account].donate_money = input_money;
        project.donor_arr.push(_donor_account);

        if (temp_money < target_money) {
            project.get_money = temp_money;
        } else if (!project.state) {
            address holder_account = project.holder_account;
            address payable payable_holder_account = payable(holder_account);

            project.get_money = target_money;
            project.state = true;
            (bool success_holder, ) = payable_holder_account.call{
                value: target_money
            }("");

            emit give_money(success_holder);

            if ((temp_money - target_money) > 0) {
                (bool success_donor, ) = _donor_account.call{
                    value: (temp_money - target_money)
                }("");
                emit return_money(success_donor);
            }
        }
    }

    ///////search/////////

    function search_project_by_id(
        uint256 _id
    )
        public
        view
        returns (
            uint256 project_id,
            string memory _description,
            string memory _name,
            address holder_account,
            bool state,
            uint256 target_money,
            uint256 get_money
        )
    {
        return (
            _id,
            donate_project_map[_id].name,
            donate_project_map[_id].description,
            donate_project_map[_id].holder_account,
            donate_project_map[_id].state,
            donate_project_map[_id].target_money,
            donate_project_map[_id].get_money
        );
    }

    ///////show all/////////

    function show_donate_projects_id()
        public
        view
        returns (uint256[] memory _donate_projects_arr)
    {
        return (donate_project_arr);
    }

    function show_holders_account()
        public
        view
        returns (address[] memory _holder_arr)
    {
        return (holder_arr);
    }

    ///////private function////////

    function _is_holder(address _account) private view returns (bool) {
        for (uint256 i = 0; i < holder_arr.length; i++) {
            if (holder_arr[i] == _account) {
                return (true); //找到回傳true
            }
        }
        return (false);
    }

    /////////////////////////

    function get_contract_balance() public view returns (uint256) {
        return address(this).balance; //合約金額
    }

    function getCurrentTimestamp() public view returns (uint256) {
        return block.timestamp;
    }
}
