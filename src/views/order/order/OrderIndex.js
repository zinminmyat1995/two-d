import React,{useState,useRef ,useEffect, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CModal,
  CModalBody,
  CButtonToolbar,
  CCardFooter,
  CCol,
  CFormInput,
  CRow,
  CSidebar,
  CSidebarHeader,
  CSidebarBrand,
  CSidebarNav,
  CNavItem,
  CNavLink,
  CFormCheck ,
  CAvatar,
  CBadge,
  CCloseButton
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilHandPointRight, cilFastfood, cilDrink } from '@coreui/icons'
import {
    cilUser
} from '@coreui/icons'
import AppHeader from '../../../components/AppHeader'
import ApiPath from "../../common/ApiPath";
import { ApiRequest } from "../../common/ApiRequest";
import { AppSidebarNav } from '../../../components/AppSidebarNav'
import SimpleBar from 'simplebar-react'

const OrderIndex = () => {

    const dispatch = useDispatch()
    const unfoldable = useSelector((state) => state.sidebarUnfoldable)
    const sidebarShow = useSelector((state) => state.sidebarShow)
    const [loginType, setLoginType ] = useState(localStorage.getItem("LOGIN_TYPE"));
    const [name , setName ] = useState(localStorage.getItem('NAME'));

    const headerRef = useRef()
    const { colorMode, setColorMode } = useState('light')
    const [notifications, setNotifications] = useState([]);
    const [showBox, setShowBox] = useState(false);
    const [menuData, setMenuData ] = useState([]);
    const [menu, setMenu] = useState([])
    const [loginID , setLoginID ] = useState(localStorage.getItem('LOGIN_ID'));   
    const [loading, setLoading] = useState(false);  // for loading
    const [selectedMenu, setSelectedMenu ] = useState("")
    const [main, setMain ] = useState([])
    const [orderList, setOrderList ] = useState([]);

    useEffect(() => {
      (async () => {
        if(localStorage.getItem("LOGIN_ID") == undefined){
          window.location.href="/login";
        }
      if(location.pathname == "/order/register"){
        setLoading(true)
        await getMenuData();
      }
      })();
    }, []);

    const handleBellClick = () => {
        setShowBox(true); // Show the message box
        };
    
        const handleCloseBox = () => {
        setShowBox(false);
        setNotifications([]); // Clear notifications when closing
        };
    

    useEffect(() => {
      document.addEventListener('scroll', () => {
          headerRef.current &&
          headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
      })
    }, [])

    let getMenuData =async ()=>{
        setLoading(true);
        let object = {
          url: ApiPath.OrderMenuData,
          method: 'get',
          params: {
            "login_id": loginID
          }
        }
      
        let response = await ApiRequest(object);
        if (response.flag === false) {
          setLoading(false);
        } else {
          if (response.data.status === 'OK') {
            let res = response.data.data; let arr = []
            res.forEach(data => {
              arr.push({
                component: CNavItem,
                name: data.name,
                to: `/order/register`
              })
            });
            setMenu(arr)
            setSelectedMenu(res[0]['name']);setMain(res);
            setMenuData(res[0]['data']);setLoading(false);
          } else {
            setError([response.data.message]); setSuccess([]);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          }
        }
      }


   console.log(menuData)
      
      
  const orderItems = [
    { name: 'Burger', qty: 2, price: 11.0 },
    { name: 'Juice', qty: 1, price: 3.5 },
  ]

  const navItem = (item, index, indent = false) => {
    const { component, name, badge, icon, ...rest } = item
    const Component = component
    return (
      <Component as="div" key={index} >
        {rest.to || rest.href ? (
          <CNavLink
            className={item.name === selectedMenu ? "active" : ""}
            onClick={()=>menuClick(item.name)}
          >
            {navLink(name, icon, badge, indent)}
          </CNavLink>
        ) : (
          navLink(name, icon, badge, indent)
        )}
      </Component>
    )
  }
  
  let menuClick = (name) => {
    setSelectedMenu(name)
    const res = main.find(item => item.name === name)
    setMenuData(res ? res.data : []) 
  }

  console.log(selectedMenu)
  
   const navLink = (name, icon, badge, indent = false) => {
      return (
        <>
          {icon
            ? icon
            : indent && (
                <span className="nav-icon">
                  <span className="nav-icon-bullet"></span>
                </span>
              )}
          {name && name}
          {badge && (
            <CBadge color={badge.color} className="ms-auto">
              {badge.text}
            </CBadge>
          )}
        </>
      )
    }

  let cardClick = (name) =>{
    setMenuData(menuData.map(d => d.name === name ? { ...d, show: !d.show } : d));
  }

  const plusBtn = (Id,id) => {
      const updatedMenu = menuData.map(d => {
        if (d.menu_id !== Id) return d;

        // menu ထဲမှာ meats update
        const updatedMeats = d.meats.map(meat =>
          meat.id === id ? { ...meat, count: meat.count + 1 } : meat
        );

        // menu.count = meats.count အပေါင်း
        const totalCount = updatedMeats.reduce((acc, m) => acc + m.count, 0);

        return {
          ...d,
          meats: updatedMeats,
          count: totalCount
        };
      });

      setMenuData(updatedMenu);

      // find selected meat
      let selected;
      updatedMenu.some(menu => {
        const found = menu.meats.find(m => m.id === id);
        if (found) {
          selected = { ...found, price: menu.price, name: menu.name, meat: found.name };
          return true; // stop looping
        }
        return false;
      });

      if (!selected) return;

      console.log("order",orderList)
      // orderList update
      setOrderList(prev => {
        const exists = prev.find(item => item.id === id && item.menu_id == Id);
        
        if (exists) {
          // update existing meat
          return prev.map(item =>
            item.id === id ? { ...item, count: selected.count } : item
          );
        } else {
          // add new meat
          return [
            ...prev,
            {
              id: selected.id,
              name: selected.name,
              price: selected.price,
              count: selected.count,
              meat: selected.meat,
              menu_id: Id
            }
          ];
        }
      });


  };
      console.log("sss",orderList)

  const minusBtn = (Id,id) => {

    const updatedMenu = menuData.map(d => {
        if (d.menu_id !== Id) return d;

        // menu ထဲမှာ meats update
        const updatedMeats = d.meats.map(meat =>
          meat.id === id ? { ...meat, count: Math.max(0, meat.count - 1)  } : meat
        );

        return {
          ...d,
          meats: updatedMeats,
        };
      });

      setMenuData(updatedMenu);


    setOrderList(prev =>
      prev
        .map(item =>
          item.id === id
            ? { ...item, count: Math.max(0, item.count - 1) }
            : item
        )
        .filter(item => item.count > 0) 
    );
  };


  let cancelModal = (name)=>{
	  setMenuData(menuData.map(d => d.name === name ? { ...d, show: !d.show } : d));
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
	}

  return (
    <>
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
                        {/* <div
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
                        </div> */}
                
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
                 <CSidebarNav as={SimpleBar} >
                  {menu.length >0 &&
                    menu.map((item, index) => navItem(item, index))}
                </CSidebarNav>
            </CSidebar>


            <div className="flex-grow-1 d-flex flex-column"  >
              <div className="flex-grow-1 p-4">
                <CRow className="g-4">
                  {/* ===== Menu Column (75%) ===== */}
                  <CCol xs={12} md={8} className="pe-3">
                    <h5 className="fw-bold mb-3">Available Menus</h5>
                    <div className="d-flex flex-wrap gap-3">
                      {menuData.length > 0 &&
                        menuData.map((item, index) => (
                          <Fragment key={index}>
                            <CCard
                              key={index}
                              className="shadow-sm border-0 text-center"
                              style={{
                                width: '180px',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                              onClick={()=>cardClick(item.name)}
                            >
                              <CCardBody>
                                <div className="fw-semibold">{item.name}</div>
                                <div className=" mt-1" style={{fontFamily: "math",color: "#dc3545"}}>฿{item.price}</div>
                                
                              </CCardBody>
                            </CCard>
                            <CModal
                              alignment="center"
                              visible={item.show}
                              
                              onClose={()=>cancelModal(item.name)}
                              aria-labelledby="VerticallyCenteredExample"
                            >
                              <CModalBody className="m-body">
                                  <h5 className="modal-p" style={{fontSize: "20px",fontWeight: "bold"}}>{item.name}</h5>
                                <hr/>
                                
                              
                                <CButtonToolbar className="confirm-body mt-4" style={{ width: '100%' }}>
                                  {item.meats.length > 0 &&
                                    item.meats.map((data, ind) => (
                                      <CRow key={ind} className="align-items-center mb-2" style={{ width: '100%' }}>
                                        {/* Left: Checkbox + menu name */}
                                        <CCol className="d-flex align-items-center" xs={8}>
                                          <CIcon
                                              icon={cilHandPointRight}
                                              className=""
                                              style={{
                                                  cursor: "pointer",
                                                  marginTop: "8px",
                                                  marginRight: "8px"

                                              }}
                                              title="Delete"
                                          />
                                          <label htmlFor={`check-${data.id}`}>
                                            {data.name}
                                          </label>
                                        </CCol>

                                        {/* Right: Minus, Count, Plus */}
                                        <CCol className="d-flex align-items-center justify-content-end" xs={4}>
                                          <CButton
                                            color="warning"
                                            size="sm"
                                            className="text-white rounded-circle shadow-sm"
                                            style={{
                                              width: '30px',
                                              height: '30px',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              transition: 'all 0.2s',
                                              fontSize: '25px',
                                              paddingBottom: '9px',
                                              marginRight: '5px'
                                            }}
                                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                            onClick={() => minusBtn(item.menu_id,data.id)}
                                          >
                                            -
                                          </CButton>

                                          <span className="fw-bold fs-5 px-2">{data.count}</span>

                                          <CButton
                                            color="warning"
                                            size="sm"
                                            className="text-white rounded-circle shadow-sm"
                                            style={{
                                              width: '30px',
                                              height: '30px',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              transition: 'all 0.2s',
                                              fontSize: '25px',
                                              paddingBottom: '9px',
                                              marginLeft: '5px'
                                            }}
                                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                            onClick={() => plusBtn(item.menu_id,data.id)}
                                          >
                                            +
                                          </CButton>
                                        </CCol>
                                      </CRow>
                                    ))
                                  }
                                </CButtonToolbar>


                              </CModalBody>
                            </CModal>
                          </Fragment>
                      ))}
                    </div>
                  </CCol>

                  {/* ===== Order List Column (25%) ===== */}
                  <CCol xs={12} md={4}>
                    <h5 className="fw-bold mb-3">Your Order</h5>
                    <CCard className="shadow-sm border-0 rounded-4">
                      <CCardBody>
                        {orderList.length > 0 ? (
                          <>
                            {orderList.map((item, i) => (
                              <div
                                key={i}
                                className="d-flex align-items-center justify-content-between py-2 "
                                style={{ fontSize: "14px" }}
                              >
                                {/* Name column */}
                                <div className="flex-grow-1">
                                  <span className="text-dark">
                                    {item.name}
                                  </span>
                                  <span className="text-muted ms-1">
                                    ({item.meat})
                                  </span>
                                </div>

                                {/* × Count column */}
                                <div
                                  className="text-center"
                                  style={{
                                    minWidth: "60px",
                                    fontWeight: "500",
                                    color: "#555",
                                  }}
                                >
                                  × {item.count}
                                </div>

                                {/* Price column */}
                                <div
                                  className="text-end fw-semibold"
                                  style={{
                                    minWidth: "70px",
                                    color: "#dc3545",
                                  }}
                                >
                                  ฿{(item.count * item.price).toFixed(2)}
                                </div>
                              </div>
                            ))}

                            <hr className="my-3" />

                            {/* Total */}
                            <div className="d-flex justify-content-between fw-bold fs-6">
                              <span>Total</span>
                              <span className="text-danger">
                                ฿
                                {orderList
                                  .reduce((sum, i) => sum + i.count * i.price, 0)
                                  .toFixed(2)}
                              </span>
                            </div>

                            {/* Confirm Button */}
                            <CButton
                              color="danger"
                              className="w-100 mt-3 text-white fw-semibold rounded-3 py-2"
                              style={{
                                background: "linear-gradient(90deg, #dc3545, #ff5b5b)",
                                border: "none",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                transition: "all 0.2s ease-in-out",
                              }}
                            >
                              Confirm Order
                            </CButton>
                          </>
                        ) : (
                          <div className="text-center text-muted py-4">No items selected</div>
                        )}
                      </CCardBody>
                    </CCard>
                  </CCol>

                </CRow>
              </div>
            </div>
        </>
  )
}

export default OrderIndex
