// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NoneMoney2 {
    event give_money(bool success_holder);
    event return_money(bool success_donor);

    struct Donor {
        uint256 donate_money;
    }

    struct DonateProject {
        string name;
        string description;
        bool state; // 0:donate中 1:審核中 2:結束
        uint256 start_date;
        uint256 deadline;
        uint256 target_money;
        uint256 get_money;
        address holder_account;
        mapping(address => Donor) donor_map; //donor data
        address[] donor_arr; //donor id
    }

    address owner;
    ///
    uint256[] donateProject_arr;
    mapping(uint256 => DonateProject) donateProject_map;
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

    function addProject(
        address _holder_account,
        string memory _name,
        string memory _description,
        uint256 _start_date,
        uint256 _deadline,
        uint256 _target_money
    ) public {
        require(
            _holder_account != address(0),
            "Holder account cannot be zero address"
        );
        require(bytes(_name).length > 0, "Project name is required");
        require(_target_money > 0, "Set _target_money must be greater than 0");
        require(_deadline > 0, "Set _target_money must be greater than 0");

        uint256 _id = donateProject_arr.length;

        DonateProject storage p = donateProject_map[_id];

        p.holder_account = _holder_account;
        p.name = _name;
        p.description = _description;
        p.state = false;
        p.start_date = _start_date;
        p.deadline = _deadline;
        p.get_money = 0;
        p.target_money = _target_money;
        p.get_money = 0;

        donateProject_arr.push(_id);

        if (!_is_holder(_holder_account)) {
            holder_arr.push(_holder_account);
        }
    }

    function addProjectDonor(uint256 _project_id) public payable {
        require(msg.value > 0, "Donation must be greater than 0");
        address payable _donor_account = payable(msg.sender);

        uint256 input_money = msg.value;

        DonateProject storage project = donateProject_map[_project_id];

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

    function searchProjectByID_with_HolderAccount(
        uint256 _id
    )
        public
        view
        returns (
            string memory description,
            string memory name,
            address holder_account,
            bool state,
            uint256 target_money,
            uint256 get_money
        )
    {
        return (
            donateProject_map[_id].name,
            donateProject_map[_id].description,
            donateProject_map[_id].holder_account,
            donateProject_map[_id].state,
            donateProject_map[_id].target_money,
            donateProject_map[_id].get_money
        );
    }

    function searchProject_ByID_without_HolderAccount(
        uint256 _id
    )
        public
        view
        returns (
            string memory description,
            string memory name,
            bool state,
            uint256 start_date,
            uint256 deadline,
            uint256 target_money,
            uint256 get_money
        )
    {
        return (
            donateProject_map[_id].name,
            donateProject_map[_id].description,
            donateProject_map[_id].state,
            donateProject_map[_id].start_date,
            donateProject_map[_id].deadline,
            donateProject_map[_id].target_money,
            donateProject_map[_id].get_money
        );
    }

    ///////show all/////////

    function showDonateProjectsID()
        public
        view
        returns (uint256[] memory _DonateProjects_arr)
    {
        return (donateProject_arr);
    }

    function showHoldersAccount()
        public
        view
        returns (address[] memory _holder_arr)
    {
        return (holder_arr);
    }

    
    function showProjectByID_filterDeadline()
        public
        view
        returns (
            uint256[] memory _DonateProjects_arr
        )
    {
        uint256 length = donateProject_arr.length;
        uint256[] memory filter_arr = new uint256[](length);
        uint256 k = 0;
        uint256 now_time = block.timestamp; 

        for (uint256 i = 0;i<length;i++){

            if(now_time <  donateProject_map[i].deadline){
                filter_arr[k] = i;
                k+=1;
            }
        }
        
        uint256[] memory result = new uint256[](k);
        for (uint256 j = 0; j < k; j++) {
            result[j] = filter_arr[j];
        }

        return (result);
    }

    
    function showProjectsAfterDeadline()
        public
        view
        returns (
            uint256[] memory _DonateProjects_arr
        )
    {
        uint256 length = donateProject_arr.length;
        uint256[] memory filter_arr = new uint256[](length);
        uint256 k = 0;
        uint256 now_time = block.timestamp; 

        for (uint256 i = 0;i<length;i++){

            if(now_time  >  donateProject_map[i].deadline){
                filter_arr[k] = i;
                k+=1;
            }
        }
        
        uint256[] memory result = new uint256[](k);
        for (uint256 j = 0; j < k; j++) {
            result[j] = filter_arr[j];
        }

        return (result);
    }

   //////////////////////////

    
    function sortProjectDonorByDonateMoney(uint256 _project_id)
        public
        view
        returns (
            address[] memory sorted_donor_arr,
            uint256[] memory sorted_donate_money_arr
        )
    {
        
        require(
            _project_id < donateProject_arr.length,
            "Project does not exist"
        );

        require(
            donateProject_arr.length > 0,
            "Project does not have donor"
        );

        DonateProject storage project = donateProject_map[_project_id];
        uint256 donor_count = project.donor_arr.length;

        // 用來存儲捐款者地址和捐款金額的陣列
        address[] memory donor_arr = new address[](donor_count);
        uint256[] memory donate_money_arr = new uint256[](donor_count);

        // 填充陣列
        for (uint256 i = 0; i < donor_count; i++) {
            address donor = project.donor_arr[i];
            donor_arr[i] = donor;
            donate_money_arr[i] = project.donor_map[donor].donate_money;
        }

        // 排序捐款金額及其對應的捐款者地址
        for (uint256 i = 0; i < donor_count - 1; i++) {
            for (uint256 j = 0; j < donor_count - 1 - i; j++) {
                if (donate_money_arr[j] < donate_money_arr[j + 1]) {
                    // 交換金額
                    uint256 temp_money = donate_money_arr[j];
                    donate_money_arr[j] = donate_money_arr[j + 1];
                    donate_money_arr[j + 1] = temp_money;

                    // 交換地址
                    address temp_donor = donor_arr[j];
                    donor_arr[j] = donor_arr[j + 1];
                    donor_arr[j + 1] = temp_donor;
                }
            }
        }

        return (donor_arr, donate_money_arr);
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

    function getContractBalance() public view returns (uint256) {
        return address(this).balance; //合約金額
    }

    function getCurrentTimestamp() public view returns (uint256) {
        return block.timestamp;
    }
}
