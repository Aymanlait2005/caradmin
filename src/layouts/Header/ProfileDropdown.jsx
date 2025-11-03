import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import defaultAvatar from '../../assets/images/users/avatar-1.jpg';
import { Link } from 'react-router-dom';


function ProfileDropdown() {
  const [user, setUser] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false); 

  const toggle = () => setDropdownOpen(prev => !prev); 

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
  }, []);

  return (
<Dropdown isOpen={dropdownOpen} toggle={toggle} direction="down" className="ms-sm-3 header-item topbar-user">
  <DropdownToggle tag="button" type="button" className="btn">
    <span className="d-flex align-items-center">
      <img
        className="rounded-circle header-profile-user"
        src={user.photo_url ?? defaultAvatar}
        alt="Header Avatar"
      />
      <span className="text-start ms-xl-2">
        <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">{user.last_name}</span>
        <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">Founder</span>
      </span>
    </span>
  </DropdownToggle>

  <DropdownMenu className="dropdown-menu-end">
    <h6 className="dropdown-header">Welcome {user.last_name}!</h6>
    <DropdownItem className="p-0">
    {user?.user_type ? (
  <Link
    to={`/${user.user_type.toLowerCase()}/pages-profile-settings`}
    className="dropdown-item"
  >
    <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
    <span className="align-middle">Profile</span>
  </Link>
) : (
  <span className="dropdown-item text-muted">Loading...</span>
)}

    </DropdownItem>
    <div className="dropdown-divider"></div>
    <DropdownItem className="p-0">
      <Link to="/logout" className="dropdown-item">
        <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
        <span className="align-middle" data-key="t-logout">Logout</span>
      </Link>
    </DropdownItem>
  </DropdownMenu>
</Dropdown>

  );
}

export default ProfileDropdown;
