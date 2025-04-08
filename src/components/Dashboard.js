import React, { useEffect, useState } from 'react';
import requestApi from '../helpers/api';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as actions from '../redux/actions';

const Dashboard = () => {
    const dispatch = useDispatch();
    const [dashboardData, setDashboardData] = useState({});

    useEffect(() => {
        const promiseUser = requestApi('/users', 'GET');
        const promisePost = requestApi('/posts', 'GET');
        dispatch(actions.controlLoading(true));
        Promise.all([promiseUser, promisePost])
            .then((res) => {
                setDashboardData({
                    totalUser: res[0].data.total,
                    totalPost: res[1].data.total,
                });
                dispatch(actions.controlLoading(false));
            })
            .catch((error) => {
                console.log("error=>", error);
                dispatch(actions.controlLoading(false));
            });
    }, []);

    return (
        <div id="layoutSidenav_content">
            <main>
                <div className="container-fluid px-4">
                    <h1 className="mt-4">Dashboard</h1>
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item active">Overview of your system</li>
                    </ol>

                    <div className="row g-4">
                        <div className="col-xl-3 col-md-6">
                            <div className="card text-white bg-primary h-100 position-relative overflow-hidden">
                                <div className="card-body d-flex flex-column justify-content-center">
                                    <h5>Total Users</h5>
                                    <h2>{dashboardData.totalUser || 0}</h2>
                                </div>
                                <div className="card-footer bg-transparent border-top-0 d-flex justify-content-between align-items-center">
                                    <Link to="/users" className="text-white stretched-link">View Details</Link>
                                    <i className="fas fa-users fs-4"></i>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-3 col-md-6">
                            <div className="card text-white bg-warning h-100 position-relative overflow-hidden">
                                <div className="card-body d-flex flex-column justify-content-center">
                                    <h5>Total Posts</h5>
                                    <h2>{dashboardData.totalPost || 0}</h2>
                                </div>
                                <div className="card-footer bg-transparent border-top-0 d-flex justify-content-between align-items-center">
                                    <Link to="/posts" className="text-white stretched-link">View Details</Link>
                                    <i className="fas fa-file-alt fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Thêm phần này nếu bạn muốn biểu đồ, hoặc widget khác */}
                    {/* <div className="row mt-4">
                        <div className="col">
                            <div className="card">
                                <div className="card-header">Analytics (Coming soon)</div>
                                <div className="card-body">Chart or stats here</div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
