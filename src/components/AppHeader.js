import React, { useEffect, useRef, useState } from 'react'
import { useLocation   } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  CCard,
  CCardHeader,
  CBadge,
  CButton,
  CCardBody
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilClipboard
} from '@coreui/icons'
import { AppHeaderDropdown } from './header/index'
import ApiPath from "../views/common/ApiPath";
import { ApiRequest } from "../views/common/ApiRequest";

const AppHeader = () => {
  const headerRef = useRef()
  const dispatch = useDispatch()
  const location = useLocation();
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const notifications = useSelector((state) => state.notifications)
  const [loginID , setLoginID ] = useState(localStorage.getItem('LOGIN_ID'));   
  const [showBox, setShowBox] = useState(false)
  const [notiMessage, setNotiMessage] = useState([])
  const boxRef = useRef(null)

  const handleBellClick = () => {
    setShowBox(true)
  }

  useEffect(() => {
    if (location.pathname.includes('/order/register') && notifications) {
      notiData();
    }
  }, [notifications, location.pathname]);

  let notiData = async ()=>{
    let object = {
          url: ApiPath.OrderNotiData,
          method: 'get',
          params: {
            "login_id": loginID
          }
        }
      
        let response = await ApiRequest(object);
        if (response.flag === false) {

        } else {
          if (response.data.status === 'OK') {
            setNotiMessage(response.data.data);
          } else {
           
          }
        }
  }

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  const handleNotiClick = (tableID) => {
    setShowBox(false)
    dispatch({ type: 'CLEAR_NOTIFICATIONS' })
    dispatch({ type: 'NOTIFICATION_CLICK', payload: tableID })
  };


  // ✅ Detect outside click to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setShowBox(false)
      }
    }

    if (showBox) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showBox])

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>

        <CHeaderNav className="ms-auto">
          {location.pathname.includes('/order/register') && (
            <CNavItem>
                <div style={{ position: 'relative' }} ref={boxRef}>
                  {/* 🔔 Notification Bell */}
                  <CNavLink
                    href="#"
                    style={{ position: 'relative', display: 'inline-block' }}
                    onClick={handleBellClick}
                  >
                    <CIcon icon={cilClipboard} size="lg" style={{ color: '3c658c' }} />
                    {notiMessage.length > 0 && (
                      <CBadge
                        color="danger"
                        shape="rounded-pill"
                        style={{
                          position: 'absolute',
                          top: '-5px',
                          right: '-5px',
                          fontSize: '0.7rem',
                          padding: '2px 6px',
                        }}
                      >
                        {notiMessage.length}
                      </CBadge>
                    )}
                  </CNavLink>

                  {/* 📦 Modern Notification Box */}
                  {showBox && (
                    <CCard
                      className="shadow border-0 animate__animated animate__fadeInDown"
                      style={{
                        position: 'absolute',
                        top: '45px',
                        right: '0',
                        width: '340px',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        zIndex: 1000,
                      }}
                    >
                      {/* Header */}
                      <CCardHeader
                        className="d-flex justify-content-between align-items-center"
                        style={{
                          background: 'linear-gradient(135deg, #00b09b, #96c93d)',
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '16px',
                          borderBottom: 'none',
                          padding: '10px 15px',
                        }}
                      >
                        🔔 Notifications
                      
                      </CCardHeader>

                      {/* Body */}
                      <CCardBody
                        style={{
                          maxHeight: '260px',
                          overflowY: 'auto', 
                          overflowX: 'hidden',  
                          backgroundColor: '#fff',
                          padding: '0',
                        }}
                      >
                        {notiMessage.length > 0 ? (
                          notiMessage.map((msg, index) => (
                            <div
                              key={index}
                              style={{
                                padding: '12px 16px',
                                borderBottom: '1px solid #f0f0f0',
                                transition: 'background 0.2s ease, transform 0.2s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#f8f9fa';
                                e.currentTarget.style.transform = 'translateX(4px)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.transform = 'translateX(0px)';
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                handleNotiClick(msg.id);
                              }}
                            >
                              <span  style={{ fontSize: '12px', color: '#888'}}>
                                {index + 1} )
                              </span>
                              <a
                                href={`#/table/${msg.table_name}`}
                                style={{
                                  color: '#007bff',
                                  textDecoration: 'none',
                                  fontWeight: '500',
                                  fontSize: '15px',
                                  marginLeft: "5px"
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                              >
                                {msg.table_name}
                              </a>
                              {/* <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
                                Notification #{index + 1}
                              </div> */}
                            </div>
                          ))
                        ) : (
                          <div
                            style={{
                              textAlign: 'center',
                              padding: '20px',
                              color: '#888',
                            }}
                          >
                            No new notifications
                          </div>
                        )}
                      </CCardBody>
                    </CCard>
                  )}
                </div>
            </CNavItem>
          )}


          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilList} size="lg" style={{ color: '#3c658c' }} />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilEnvelopeOpen} size="lg" style={{ color: '#3c658c' }} />
            </CNavLink>
          </CNavItem>
        </CHeaderNav>

        <CHeaderNav>
          {/* <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75 white-color"></div>
          </li> */}
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
