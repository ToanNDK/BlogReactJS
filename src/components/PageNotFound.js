import React from 'react'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
  return (
    <div className='text-center'>
        <img src={'../assests/images/404.png'}/>
        <Link className='mt-2 d-block' to='/'><i className="fas fa-arrow-left me-1"></i>Về trang chủ</Link>
    </div>
  )
}

export default PageNotFound