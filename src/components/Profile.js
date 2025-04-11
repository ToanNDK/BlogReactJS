import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as actions from '../redux/actions';
import requestApi from '../helpers/api';
import { toast } from 'react-toastify';

const Profile = () => {
  const dispatch = useDispatch();
  const [profileData, setProfileData] = useState({});
  const [isSelectedFile, setIsSelectedFile] = useState(false);

  useEffect(() => {
    dispatch(actions.controlLoading(true));
    requestApi('/users/profile', 'GET')
      .then(res => {
        console.log('Avatar path from backend:', res.data.avatar);
  
        
        const avatarPath = res.data.avatar?.startsWith('uploads/')
          ? res.data.avatar
          : `uploads/${res.data.avatar}`;
  
        const avatarUrl = avatarPath ? `${process.env.REACT_APP_API_URL}/${avatarPath}` : '';
        setProfileData({ ...res.data, avatar: avatarUrl });
        dispatch(actions.controlLoading(false));
      })
      .catch(err => {
        console.error("err=>", err);
        dispatch(actions.controlLoading(false));
      });
  }, []);

  const onImageChange = (event) => {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setProfileData(prev => ({ ...prev, avatar: reader.result, file }));
        setIsSelectedFile(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateAvatar = () => {
    const formData = new FormData();
    formData.append('avatar', profileData.file);
    dispatch(actions.controlLoading(true));
    requestApi('/users/upload-avatar', 'POST', formData, 'json', 'multipart/form-data')
      .then(() => {
        dispatch(actions.controlLoading(false));
        toast.success('Thay đổi Avatar thành công', { position: 'top-right', autoClose: 2000 });
        setIsSelectedFile(false);
      })
      .catch(err => {
        console.error("err", err);
        dispatch(actions.controlLoading(false));
        toast.error("Thay đổi Avatar thất bại", { position: 'top-right', autoClose: 2000 });
      });
  };

  const handleUpdateProfile = () => {
    const updateData = {
      first_name: profileData.first_name,
      last_name: profileData.last_name
    };
    dispatch(actions.controlLoading(true));
    requestApi('/users/update-profile', 'PATCH', updateData)
      .then(() => {
        dispatch(actions.controlLoading(false));
        toast.success('Cập nhật thông tin thành công', { position: 'top-right', autoClose: 2000 });
      })
      .catch(err => {
        console.error("err", err);
        dispatch(actions.controlLoading(false));
        toast.error("Cập nhật thất bại", { position: 'top-right', autoClose: 2000 });
      });
  };

  return (
    <div id="layoutSidenav_content">
      <main>
        <div className="container-fluid px-4">
          <h1 className="mt-4">Hồ sơ cá nhân</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
            <li className="breadcrumb-item active">Thông tin tài khoản</li>
          </ol>

          <div className="card mb-4">
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-4">
                  <img
                    src={profileData.avatar || '../assets/images/default-avatar.png'}
                    className="img-thumbnail rounded mb-2"
                    alt="Avatar"
                  />
                  <div className="input-file">
                    <label htmlFor="file" className="btn btn-sm btn-primary">
                      Chọn ảnh
                    </label>
                    <input
                      id="file"
                      type="file"
                      accept="image/*"
                      onChange={onImageChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                  {isSelectedFile && (
                    <button className="btn btn-sm btn-success mt-2" onClick={handleUpdateAvatar}>
                      Cập nhật ảnh đại diện
                    </button>
                  )}
                </div>

                <div className="col-md-8">
                  <div className="mb-3">
                    <label className="form-label">Họ:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profileData.first_name || ''}
                      onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Tên:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profileData.last_name || ''}
                      onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email:</label>
                    <input
                      type="email"
                      className="form-control"
                      value={profileData.email || ''}
                      readOnly
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Quyền:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profileData.roles || ''}
                      readOnly
                    />
                  </div>

                  <button className="btn btn-sm btn-primary float-end" onClick={handleUpdateProfile}>
                    Cập nhật thông tin
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
