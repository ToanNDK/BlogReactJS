import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Sidebar = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <div id="layoutSidenav_nav">
            <nav className="sb-sidenav accordion sb-sidenav-dark custom-sidebar" id="sidenavAccordion">
                <div className="sb-sidenav-menu">
                    <div className="nav">
                        <div className="sb-sidenav-menu-heading">Core</div>
                        <Link to="/" className={`nav-link ${isActive('/') && 'active'}`}>
                            <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                            Dashboard
                        </Link>

                        <div className="sb-sidenav-menu-heading">Interface</div>

                        {/* Users */}
                        <a className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseLayouts" aria-expanded="false">
                            <div className="sb-nav-link-icon"><i className="fas fa-user"></i></div>
                            Users
                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </a>
                        <div className="collapse" id="collapseLayouts" data-bs-parent="#sidenavAccordion">
                            <nav className="sb-sidenav-menu-nested nav">
                                <Link to='/user/add' className={`nav-link ${isActive('/user/add') && 'active'}`}>Add User</Link>
                                <Link to='/users' className={`nav-link ${isActive('/users') && 'active'}`}>List Users</Link>
                            </nav>
                        </div>

                        {/* Posts */}
                        <a className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapsePost" aria-expanded="false">
                            <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                            Posts
                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </a>
                        <div className="collapse" id="collapsePost" data-bs-parent="#sidenavAccordion">
                            <nav className="sb-sidenav-menu-nested nav">
                                <Link to='/post/add' className={`nav-link ${isActive('/post/add') && 'active'}`}>Add Post</Link>
                                <Link to='/posts' className={`nav-link ${isActive('/posts') && 'active'}`}>List Posts</Link>
                            </nav>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Sidebar;
