// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

enum State {
    CAN_DONATE,
    FINISH,
    EXPIRED_SETTLED_FINISH
}

contract FunctionInfo {
    struct ReturnProject {
        uint256 id;
        string name;
        string description;
        State state;
        uint256 start_date;
        uint256 deadline;
        uint256 target_money;
        uint256 get_money;
        address holder_account;
        address[] donor_arr;
    }
}

contract INoneMoney {
    event give_money(bool success_holder);
    event return_money(bool success_donor);

    struct Donor {
        uint256 donate_money;
        bool is_return;
    }

    struct DonateProject {
        string name;
        string description;
        State state;
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

    function _is_holder(address _account) internal view returns (bool) {
        for (uint256 i = 0; i < holder_arr.length; i++) {
            if (holder_arr[i] == _account) {
                return (true); //找到回傳true
            }
        }
        return (false);
    }

    function _is_holder(
        uint256 _project_id,
        address _account
    ) internal view returns (bool) {
        require(_project_id >= 0, "_project_id not exist");
        require(
            _project_id < donateProject_arr.length,
            "_project_id not exist"
        );
        DonateProject storage project = donateProject_map[_project_id];

        if (project.holder_account != _account) {
            return (false);
        }

        return (true);
    }

    function _is_settled(uint256 _project_id) internal view returns (bool) {
        require(_project_id >= 0, "_project_id not exist");
        require(
            _project_id < donateProject_arr.length,
            "_project_id not exist"
        );

        DonateProject storage project = donateProject_map[_project_id];
        uint256 length = project.donor_arr.length;

        for (uint256 i = 0; i < length; i++) {
            address _account = project.donor_arr[i];
            if (!project.donor_map[_account].is_return) {
                return (false);
            }
        }
        return (true);
    }

    function _is_donor(
        uint256 _project_id,
        address _account
    ) internal view returns (bool) {
        require(_project_id >= 0, "_project_id not exist");
        require(
            _project_id < donateProject_arr.length,
            "_project_id not exist"
        );

        DonateProject storage project = donateProject_map[_project_id];
        Donor storage donor = project.donor_map[_account];
        if (donor.donate_money == 0) {
            return (false);
        }

        return (true);
    }

    function _get_donate_money(
        uint256 _project_id,
        address _donor_account
    ) internal view returns (uint256) {
        return (
            donateProject_map[_project_id]
                .donor_map[_donor_account]
                .donate_money
        );
    }

    function _showProjectByIDFilterDeadline(
        uint256 now_time
    ) internal view returns (uint256[] memory _DonateProjects_arr) {
        uint256 length = donateProject_arr.length;
        uint256[] memory filter_arr = new uint256[](length);
        uint256 k = 0;

        for (uint256 i = 0; i < length; i++) {
            if (
                (now_time < donateProject_map[i].deadline) &&
                (donateProject_map[i].state == State.CAN_DONATE)
            ) {
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

    function _showProjectsAfterDeadline(
        uint256 now_time
    ) internal view returns (uint256[] memory _DonateProjects_arr) {
        uint256 length = donateProject_arr.length;
        uint256[] memory filter_arr = new uint256[](length);
        uint256 k = 0;

        for (uint256 i = 0; i < length; i++) {
            if (
                (now_time > donateProject_map[i].deadline) &&
                (donateProject_map[i].state == State.CAN_DONATE)
            ) {
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

    function _showDonateProjectsID()
        internal
        view
        returns (uint256[] memory _DonateProjects_arr)
    {
        return (donateProject_arr);
    }

    function _showProjectByHolders(
        address _account
    ) internal view returns (uint256[] memory _hold_project_arr) {
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

    function _showHolders()
        internal
        view
        returns (address[] memory _holder_arr)
    {
        return (holder_arr);
    }
}
