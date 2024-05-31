// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./func_info.sol";

contract NoneMoney is func_info {
    event give_money(bool success_holder);
    event return_money(bool success_donor);

    struct Donor {
        uint256 donate_money;
        uint256 handling_fee;
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

    function addProjectDonor(uint256 _project_id)
        public
        payable
        returns (bool pay_success, uint256 pay_money)
    {
        require(msg.value > 20, "Donation+fee must be greater than 20");

        require(_project_id >= 0, "Project ID is not exist");
        require(
            _project_id < donateProject_arr.length,
            "Project ID is not exist"
        );

        uint256 input_money = (msg.value * 95) / 100;
        address payable _donor_account = payable(msg.sender);

        DonateProject storage project = donateProject_map[_project_id];

        uint256 temp_money = project.get_money + input_money;
        uint256 target_money = project.target_money;

        if (project.donor_map[_donor_account].donate_money == 0) {
            project.donor_arr.push(_donor_account);
        }

        if ((temp_money < target_money) && (!project.state)) {
            project.donor_map[_donor_account].donate_money += input_money;
            project.donor_map[_donor_account].handling_fee +=
                (msg.value * 5) /
                100;
            project.get_money = temp_money;

            return (true, input_money);
        } else if (!project.state) {
            address holder_account = project.holder_account;
            address payable payable_holder_account = payable(holder_account);

            input_money =
                ((msg.value - (temp_money - target_money)) * 95) /
                100;
            temp_money = project.get_money + input_money;

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

            project.donor_map[_donor_account].donate_money +=
                input_money -
                (temp_money - target_money);
            project.donor_map[_donor_account].handling_fee +=
                (msg.value * 5) /
                100;
        }
    }

    function transSettleProject(uint256 _project_id)
        public
        payable
        returns (bool clear_success, uint256 addtional_money)
    {
        require(_project_id >= 0, "Project ID is not exist");
        require(
            _project_id < donateProject_arr.length,
            "Project ID is not exist"
        );

        uint256 before_gas = gasleft();

        DonateProject storage project = donateProject_map[_project_id];

        uint256 length = project.donor_arr.length;

        for (uint256 i = 0; i < length; i++) {
            address _donor_account = project.donor_arr[i];
            address payable _payable_donor_account = payable(
                project.donor_arr[i]
            );

            (bool success_donor, ) = _payable_donor_account.call{
                value: project.donor_map[_donor_account].donate_money
            }("");

            emit return_money(success_donor);

            if (!success_donor) {   
                revert("error return to donor");
            }
        }

        uint256 after_gas = gasleft();

        uint256 pay_gas = before_gas - after_gas;
        uint256 all_return = pay_gas + project.donor_map[msg.sender].handling_fee/10;

        address payable clear_donor = payable(msg.sender);
        (bool success_return, ) = clear_donor.call{
            value: (all_return)
        }("");
        
        emit return_money(success_return);
        if(!success_return){
            
            revert("error return , contract balance not enough to pay");
        }

        return (true, all_return);
    }

    //////////////get///////////////

    function getProjectsettledNumberAndReturnFee(address _donor_account)
        public
        view
        returns (
            bool have_settled_project,
            uint256 project_number,
            uint256 sum_return_handing_fee
        )
    {
        uint256[] memory _filterDeadline_id_arr = _showProjectsAfterDeadline();
        uint256 k = _filterDeadline_id_arr.length;

        uint256 _project_number = 0;
        uint256 _sum_return_handing_fee = 0;

        for (uint256 i = 0; i < k; i++) {
            (bool flag, uint256 fee) = _is_donor(
                _filterDeadline_id_arr[i],
                _donor_account
            );

            if (flag) {
                _sum_return_handing_fee += fee;
                _project_number += 1;
                have_settled_project = true;
            }
        }

        return (have_settled_project, _project_number, _sum_return_handing_fee);
    }

    function getSettledProjectByDonor(address _donor_account)
        public
        view
        returns (
            uint256[] memory project_id_arr,
            string[] memory name_arr,
            uint256[] memory start_date_arr,
            uint256[] memory deadline_arr,
            uint256[] memory already_donate_money,
            uint256[] memory additional_money
        )
    {
        uint256[] memory _filterDeadline_id_arr = _showProjectsAfterDeadline();
        uint256 length = _filterDeadline_id_arr.length;

        uint256[] memory _tmp_project_id = new uint256[](length);
        uint256 k = 0;

        for (uint256 i = 0; i < length; i++) {
            (bool flag, ) = _is_donor(
                _filterDeadline_id_arr[i],
                _donor_account
            );

            if (flag) {
                _tmp_project_id[k] = _filterDeadline_id_arr[i];
                k += 1;
            }
        }

        getSettledProjectByDonor_info memory info;

        info._project_id_arr = new uint256[](k);
        info._name_arr = new string[](k);
        info._start_date_arr = new uint256[](k);
        info._deadline_arr = new uint256[](k);
        info._donate_money = new uint256[](k);
        info._get_money = new uint256[](k);

        for (uint256 i = 0; i < k; i++) {
            uint256 _project_id = _tmp_project_id[i];
            info._project_id_arr[i] = _project_id;
            info._name_arr[i] = donateProject_map[_project_id].name;
            info._start_date_arr[i] = donateProject_map[_project_id].start_date;
            info._deadline_arr[i] = donateProject_map[_project_id].deadline;
            info._donate_money[i] = _get_donate_money(
                _project_id,
                _donor_account
            );
            info._get_money[i] = _get_handling_fee(_project_id, _donor_account);
            info._get_money[i] = info._get_money[i] /10;
        }

        return (
            info._project_id_arr,
            info._name_arr,
            info._start_date_arr,
            info._deadline_arr,
            info._donate_money,
            info._get_money
        );
    }

    ///////search/////////

    function serchProjectAllDonorByID(uint256 _project_id)
        public
        view
        returns (address[] memory project_donor_arr)
    {
        require(_project_id >= 0, "Project ID is not exist");
        require(
            _project_id < donateProject_arr.length,
            "Project ID is not exist"
        );

        return (donateProject_map[_project_id].donor_arr);
    }

    function serchProjectDonorByID(uint256 _project_id, address _donor_account)
        public
        view
        returns (uint256 donate_money, uint256 handling_fee)
    {
        require(_project_id >= 0, "Project ID is not exist");
        require(
            _project_id < donateProject_arr.length,
            "Project ID is not exist"
        );
        DonateProject storage project = donateProject_map[_project_id];
        return (
            project.donor_map[_donor_account].donate_money,
            project.donor_map[_donor_account].handling_fee
        );
    }

    function searchProjectByID(uint256 _project_id)
        public
        view
        returns (
            string memory description,
            string memory name,
            address holder_account,
            bool state,
            uint256 start_date,
            uint256 deadline,
            uint256 target_money,
            uint256 get_money,
            address[] memory donor_arr
        )
    {
        DonateProject storage project = donateProject_map[_project_id];

        return (
            project.name,
            project.description,
            project.holder_account,
            project.state,
            project.start_date,
            project.deadline,
            project.target_money,
            project.get_money,
            project.donor_arr
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

    function showHoldersProjectArr(address _account)
        public
        view
        returns (uint256[] memory _holdd_pj_arr)
    {
        address holder = _account;

        uint256 length = donateProject_arr.length;
        uint256[] memory hold_pj_arr = new uint256[](length);

        uint256 k = 0;

        for (uint256 i = 0; i < length; i++) {
            if (
                holder == donateProject_map[donateProject_arr[i]].holder_account
            ) {
                hold_pj_arr[k] = donateProject_arr[i];
                k += 1;
            }
        }

        uint256[] memory new_hold_pj_arr = new uint256[](k);

        for (uint256 j = 0; j < k; j++) {
            new_hold_pj_arr[j] = hold_pj_arr[j];
        }

        return (new_hold_pj_arr);
    }

    /////////////// show on page ////////////////////

    function showProjectFilterDeadline()
        public
        view
        returns (
            uint256[] memory filterDeadline_id_arr,
            string[] memory name_arr,
            uint256[] memory start_date_arr,
            uint256[] memory deadline_arr,
            uint256[] memory target_money_arr,
            uint256[] memory get_money_arr
        )
    {
        uint256[]
            memory _filterDeadline_id_arr = _showProjectByIDFilterDeadline();
        uint256 k = _filterDeadline_id_arr.length;

        string[] memory _name_arr = new string[](k);
        uint256[] memory _start_date_arr = new uint256[](k);
        uint256[] memory _deadline_arr = new uint256[](k);
        uint256[] memory _target_money_arr = new uint256[](k);
        uint256[] memory _get_money_arr = new uint256[](k);

        for (uint256 j = 0; j < k; j++) {
            _name_arr[j] = donateProject_map[_filterDeadline_id_arr[j]].name;
            _start_date_arr[j] = donateProject_map[_filterDeadline_id_arr[j]]
                .start_date;
            _deadline_arr[j] = donateProject_map[_filterDeadline_id_arr[j]]
                .deadline;
            _target_money_arr[j] = donateProject_map[_filterDeadline_id_arr[j]]
                .target_money;
            _get_money_arr[j] = donateProject_map[_filterDeadline_id_arr[j]]
                .get_money;
        }

        return (
            _filterDeadline_id_arr,
            _name_arr,
            _start_date_arr,
            _deadline_arr,
            _target_money_arr,
            _get_money_arr
        );
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

        require(donateProject_arr.length > 0, "Project does not have donor");

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

    function _is_donor(uint256 _project_id, address _account)
        private
        view
        returns (bool, uint256)
    {
        require(_project_id >= 0, "_project_id not exist");
        require(
            _project_id < donateProject_arr.length,
            "_project_id not exist"
        );

        DonateProject storage project = donateProject_map[_project_id];
        Donor storage donor = project.donor_map[_account];
        if (donor.donate_money == 0) {
            return (false, 0);
        }

        return (true, donor.handling_fee);
    }

    function _showProjectByIDFilterDeadline()
        private
        view
        returns (uint256[] memory _DonateProjects_arr)
    {
        uint256 length = donateProject_arr.length;
        uint256[] memory filter_arr = new uint256[](length);
        uint256 k = 0;
        uint256 now_time = block.timestamp;

        for (uint256 i = 0; i < length; i++) {
            if (now_time < donateProject_map[i].deadline) {
                filter_arr[k] = i;
                k += 1;
            }
        }

        uint256[] memory result = new uint256[](k);
        for (uint256 j = 0; j < k; j++) {
            result[j] = filter_arr[j];
        }

        return (result);
    }

    function _showProjectsAfterDeadline()
        private
        view
        returns (uint256[] memory _DonateProjects_arr)
    {
        uint256 length = donateProject_arr.length;
        uint256[] memory filter_arr = new uint256[](length);
        uint256 k = 0;
        uint256 now_time = block.timestamp;

        for (uint256 i = 0; i < length; i++) {
            if (now_time > donateProject_map[i].deadline) {
                filter_arr[k] = i;
                k += 1;
            }
        }

        uint256[] memory result = new uint256[](k);
        for (uint256 j = 0; j < k; j++) {
            result[j] = filter_arr[j];
        }

        return (result);
    }

    function _get_donate_money(uint256 _project_id, address _donor_account)
        private
        view
        returns (uint256)
    {
        return (
            donateProject_map[_project_id]
                .donor_map[_donor_account]
                .donate_money
        );
    }

    function _get_handling_fee(uint256 _project_id, address _donor_account)
        private
        view
        returns (uint256)
    {
        return (
            donateProject_map[_project_id]
                .donor_map[_donor_account]
                .handling_fee
        );
    }

    /////////////////////////

    function getContractBalance() public view returns (uint256) {
        return address(this).balance; //合約金額
    }

    function getCurrentTimestamp() public view returns (uint256) {
        return block.timestamp; //合約時間
    }

    //////////////////////////
}
