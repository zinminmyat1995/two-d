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
  CListGroupItem,
  CCol,
  CListGroup ,
  CRow,
  CSidebar,
  CSidebarHeader,
  CSidebarBrand,
  CSidebarNav,
  CNavItem,
  CNavLink,
  CFormCheck ,
  CAlert,
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
import Loading from "../../common/Loading"
import ErrorModal from './ErrorModal'
import SuccessModal from './SuccessModal'
import ConfirmModal from './ConfirmModal'
const OrderIndex = () => {

    const dispatch = useDispatch()
    const notiID = useSelector((state) => state.notifications)
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
    const [ tableData, setTableData ] = useState([]);	
    const [ tableNo, setTableNo ] = useState("")
    const [showError, setShowError] = useState(false)
    const [errorText1, setErrorText1 ] = useState("");
    const [errorText2, setErrorText2 ] = useState("");
    const [showSuccess, setShowSuccess] = useState(false)
    const [successText1, setSuccessText1 ] = useState("");
    const [successText2, setSuccessText2 ] = useState("");
    const [showConfirm, setShowConfirm] = useState(false)


    useEffect(() => {
      (async () => {
        if(localStorage.getItem("LOGIN_ID") == undefined){
          window.location.href="/login";
        }
      if(location.pathname == "/order/register"){
        setLoading(true)
        await getTable();
        await getMenuData();
        
      }
      })();
    }, []);

    useEffect(() => {
        if (notiID) {
         getMenuDataById(notiID);
        }
    }, [notiID])

    let getMenuDataById =async (notiID)=>{
        setLoading(true)
        let object = {
          url: ApiPath.OrderMenuDataByID,
          method: 'get',
          params: {
            "menu_id": notiID,
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

          let arrData = Object.entries(response.data.order_list).map(([key, item]) => ({
              id: item.meat_id,
              name: item.menu_name,
              price: item.price,
              count: item.count,
              meat: item.meat_name,
              menu_id: item.menu_type_id,
              menu_sub_id: item.menu_id,
            }));

            setOrderList(arrData); 
            setMenu(arr); setTableNo(response.data.table_id);
            setSelectedMenu(res[0]['name']);setMain(res);
            setMenuData(res[0]['data']);
            setLoading(false);
          } else {
            setError([response.data.message]); setSuccess([]);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          }
        }
      }

    let getTable =async () => {
        let object = {
          url: ApiPath.SettingTableSearch,
          method: 'get',
          params: {
            "login_id": loginID
          }
        }
      
        let response = await ApiRequest(object);
        if (response.flag === false) {
          setError([]); setSuccess([]); setLoading(false);
        } else {
          if (response.data.status === 'OK') {
            setTableData(response.data.data);
          } else {
            setError([response.data.message]); setSuccess([]);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          }
        }
        
      }

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
      
  const navItem = (item, index, indent = false) => {
    const { component, name, badge, icon, ...rest } = item
    const Component = component
    return (
      <Component as="div" key={index} >
        {rest.to || rest.href ? (
          <CNavLink
            className={item.name === selectedMenu ? "active" : ""}
            onClick={()=>menuClick(item.name)}
            style={{background: "#ffffff54", color: "black", boxShadow: "var(--cui-box-shadow-sm)",borderRadius: "5px", marginTop: "5px"}}
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

  const plusBtn = (SubId,Id,id) => {
      const updatedMenu = menuData.map(d => {
        if (d.menu_id !== Id) return d;

        
        const updatedMeats = d.meats.map(meat => {
          if (d.menu_sub_id === SubId && meat.id === id) {
            return { ...meat, count: meat.count + 1 };
          }
          return meat;
        });

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
        const found = menu.meats.find(m => m.id === id && menu.menu_sub_id === SubId);
        if (found) {
          selected = { ...found, price: menu.price, name: menu.name, meat: found.name };
          return true; // stop looping
        }
        return false;
      });
      if (!selected) return;

      setOrderList(prev => {
        const exists = prev.find(item => item.id === id && item.menu_id == Id && item.menu_sub_id === SubId);

        if (exists) {
          return prev.map(item =>
            item.id === id && item.menu_id == Id && item.menu_sub_id === SubId ? { ...item, count: selected.count } : item
          );
        } else {
          return [
            ...prev,
            {
              id: selected.id,
              name: selected.name,
              price: selected.price,
              count: selected.count,
              meat: selected.meat,
              menu_id: Id,
              menu_sub_id: SubId,
            }
          ];
        }
      });

      setMain(prev => {
        return prev.map(item =>
          item.name === selectedMenu
            ? { ...item, data: updatedMenu }
            : item
        );
      });
  };


  const minusBtn = (SubId,Id,id) => {
    const updatedMenu = menuData.map(d => {
        if (d.menu_id !== Id) return d;

        // menu ထဲမှာ meats update
        const updatedMeats = d.meats.map(meat =>
          meat.id === id && d.menu_id === Id && d.menu_sub_id === SubId? { ...meat, count: Math.max(0, meat.count - 1)  } : meat
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
          item.id === id && item.menu_id === Id && item.menu_sub_id === SubId
            ? { ...item, count: Math.max(0, item.count - 1) }
            : item
        )
        .filter(item => item.count > 0) 
    );
  };


  let cancelModal = (name)=>{
    let data = menuData.map(d => d.name === name ? { ...d, show: !d.show } : d);
     setMain(prev => {
      return prev.map(item =>
        item.name === selectedMenu
          ? { ...item, data: data }
          : item
      );
    });
	  setMenuData(data);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
	}

  const confirmClick = () => {
    if (tableNo == '' || tableNo == undefined) {
      setShowError(true)
      setErrorText2("Please select a table number before confirming your order.")
      setErrorText1("Table Missing")
      setTimeout(() => setShowError(false), 2000) 
      return
    }else{
      setShowConfirm(true)
    }
  }

  let saveOK =async ()=>{
    setShowConfirm(false);setLoading(true);let obj = "";
    if(notiID == ""){
      obj = {
        method: "post",
        url: ApiPath.OrderRegister,
        params: {

          "table_id": tableNo,
          "data": orderList,
          "total_amount": totalPrice,
          "login_id": loginID,
        },
      };
    }else{
      obj = {
        method: "post",
        url: ApiPath.OrderUpdate,
        params: {
          "order_id": notiID,
          "table_id": tableNo,
          "data": orderList,
          "total_amount": totalPrice,
          "login_id": loginID,
        },
      };
    }
      let response = await ApiRequest(obj);
      setLoading(false)
      if (response.flag === false) {
        setLoading(false);
        setShowError(true)
        setErrorText2(response.message[0])
        setErrorText1("Fail to save!");setTimeout(() => setShowError(false), 2000)
      } else {
        if (response.data.status == "OK") {
          setLoading(false)
          setShowSuccess(true)
          setSuccessText2([response.data.message]);
          setSuccessText1("Success!");setOrderList([]);getMenuData();setTableNo("")
          dispatch({ type: 'NOTIFICATION_CLICK', payload: notiID });dispatch({ type: 'CLEAR_NOTIFICATIONS' })
          setTimeout(() => setShowSuccess(false), 3000);
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }else{
            setErrorText1("Fail to save!");setShowError(true);setErrorText2([response.data.message]);setLoading(false);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });setTimeout(() => setShowError(false), 2000)
        } 
      }
  }

  const totalPrice = orderList.reduce((sum, i) => sum + i.count * i.price, 0);


  return (
    <>
        <Loading start={loading} />
        <ErrorModal  
          showError={showError}
          errorText1={errorText1}
          errorText2={errorText2}
        />
        <SuccessModal
            showSuccess={showSuccess}
            successText1={successText1}
            successText2={successText2}
        />

        <ConfirmModal
          showConfirm={showConfirm}
          onOk={() =>saveOK()}
          onCancel={() => setShowConfirm(false)}
        />


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
              <CSidebarNav as={SimpleBar}>
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
                              className="shadow-sm border-0 text-center d-flex flex-column justify-content-between"
                              style={{
                                width: '180px',
                                height: '120px',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                              onClick={() => cardClick(item.name)}
                            >
                              <CCardBody className="d-flex flex-column justify-content-between">
                                <div
                                  className="fw-semibold"
                                  style={{
                                    flexGrow: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '16px',
                                  }}
                                >
                                  {item.name}
                                </div>
                                <div
                                  style={{
                                    fontFamily: 'math',
                                    color: '#dc3545',
                                    fontWeight: '500',
                                    fontSize: '15px',
                                    marginTop: 'auto',
                                  }}
                                >
                                  ฿{item.price}
                                </div>
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
                                              paddingBottom: '5px',
                                              marginRight: '5px'
                                            }}
                                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                            onClick={() => minusBtn(item.menu_sub_id, item.menu_id,data.id)}
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
                                              paddingBottom: '5px',
                                              marginLeft: '5px',
                                            }}
                                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                            onClick={() => plusBtn(item.menu_sub_id, item.menu_id,data.id)}
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
                   
                    <div className="border-start p-3 bg-white shadow-sm" style={{ width: '350px' }}>
                        <h5 className="fw-bold mb-3 text-center">🧾 Order List</h5>
                         <div className="mb-3">
                          <label htmlFor="tableSelect" className="fw-semibold mb-1">
                            Table No
                          </label>
                          <select
                            id="tableSelect"
                            className="form-select shadow-sm"
                            style={{ borderRadius: '8px' }}
                            onChange={(e) => setTableNo(e.target.value)}
                            value={tableNo || ""} 
                          >
                            <option value="">-- Choose Table --</option>
                            {tableData.length> 0 &&
                              tableData.map((data,ind)=>{
                                return(
                                  <option value={data.id} key={ind}>{data.name}</option>
                                )
                              })
                            }
                          </select>
                        </div>
                        <CListGroup flush>
                          {orderList.length === 0 && (
                            <div className="text-center text-muted">No items selected</div>
                          )}
                          {orderList.map((o, i) => (
                            <CListGroupItem key={i} className="d-flex justify-content-between align-items-center">
                              <div>
                                <div className="fw-bold">{o.name}</div>
                                <div className="small text-muted">{o.meat}</div>
                              </div>
                              <div className="text-end">
                                <div>{o.count}x</div>
                                <div className="" style={{fontStyle: "italic"}}>฿{o.price}</div>
                              </div>
                            </CListGroupItem>
                          ))}
                        </CListGroup>

                        {orderList.length > 0 && (
                          <div className="border-top mt-3 pt-3">
                            <div className="d-flex justify-content-between">
                              <span className='fw-bold'>Total</span>
                              <span className="" style={{color: "rgb(227 53 69)"}}> 
                                ฿{totalPrice}</span>
                            </div>
                            <CButton color="success" className="w-100 mt-3 text-white" onClick={confirmClick}>
                              Confirm Order
                            </CButton>
                          </div>
                        )}
                      </div>
                  </CCol>

                </CRow>
              </div>
            </div>
        </>
  )
}

export default OrderIndex
