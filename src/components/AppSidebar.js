import React,{useState,useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilUser
} from '@coreui/icons'
import { AppSidebarNav } from './AppSidebarNav'

import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
import navigation from '../_nav'
// import navigation2 from '../_nav2'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const [loginType, setLoginType ] = useState(localStorage.getItem("LOGIN_TYPE"));
  const [name , setName ] = useState(localStorage.getItem('NAME'));
  return (
    <CSidebar
      className="border-end sidebar-3d"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader>
        <CSidebarBrand
          to="/"
          className="d-flex flex-column align-items-center justify-content-center text-center w-100"
          style={{ padding: "1.5rem 0" }}
        >
          {/* User Icon with circle gradient background */}
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #38b2ac, #2b6cb0)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
              marginBottom: "10px",
            }}
          >
            <CIcon
              icon={cilUser}
              size="xxl"
              style={{
                width: "45px",
                height: "45px",
                color: "white",
              }}
            />
          </div>

          {/* Name with styled card effect */}
          <div
            style={{
              fontWeight: "bold",
              fontSize: "1.1rem",
              color: "#2c3e50",
              textAlign: "center",
              backgroundColor: "#f7fafc",
              borderRadius: "12px",
              padding: "6px 14px",
              boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
              border: "1px solid #e2e8f0",
            }}
          >
            {name}
          </div>
        </CSidebarBrand>

        {/* Close Button */}
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: "set", sidebarShow: false })}
        />
      </CSidebarHeader>

      {/* <AppSidebarNav items={loginType == 0 ?navigation : navigation2} /> */}
       <AppSidebarNav items={navigation} />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
