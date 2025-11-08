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
import { count } from 'rsuite/esm/internals/utils/ReactChildren'


const colors = {
  bg: '#F6F6FA',
  card: 'rgb(247 247 247 / 50%)',
  softCard: '#F5F6FA',
  text: '#1E1E24',
  subtext: '#8B8E97',
  divider: '#ECEEF3',
  grayBtn: '#F5F6FA',
  grayBtnBorder: '#E6E8EF',
  // pink→purple gradient used on active tab and primary button
  gradFrom: '#E91F63', // pink
  gradTo: '#7C3AED',   // purple
  accent: '#E13545',   // hot pink price
}


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
    const [tab, setTab] = useState('0')

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
        notiID != ""? setLoading(true) : "";
        let object = {
          url: ApiPath.OrderMenuDataByID,
          method: 'get',
          params: {
            "menu_id": notiID,
            "login_id": loginID
          }
        }
  
        let response = await ApiRequest(object);
        if (response.flag == false) {
          setLoading(false);
        } else {
          if (response.data.status == 'OK') {
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

            setOrderList(arrData);setTab(response.data.order_type == null? '0': response.data.order_type)
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
        if (response.flag == false) {
          setError([]); setSuccess([]); setLoading(false);
        } else {
          if (response.data.status == 'OK') {
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
        if (response.flag == false) {
          setLoading(false);
        } else {
          if (response.data.status == 'OK') {
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
            className={item.name == selectedMenu ? "active" : ""}
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
    const res = main.find(item => item.name == name)
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

  let cardClick = (name,meats) =>{

    if(meats != null && meats.length > 0){
      setMenuData(menuData.map(d => d.name == name ? { ...d, show: !d.show } : d));
    }
    
  }

  const plusBtn = (SubId,Id,id) => {
      const updatedMenu = menuData.map(d => {
        if (d.menu_id !== Id) return d;

        
        const updatedMeats = d.meats.map(meat => {
          if (meat.menu_sub_id == SubId && meat.id == id) {
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
        const found = menu.meats.find(m => m.id == id && m.menu_sub_id == SubId);
        if (found) {
          selected = { ...found, price: menu.price, name: menu.name, meat: found.name };
          return true; // stop looping
        }
        return false;
      });
      if (!selected) return;

      setOrderList(prev => {
               console.log("prev",prev)
        console.log("SubId",SubId)
        console.log("Id",Id)
        console.log("id",id)
        const exists = prev.find(item => item.id == id && item.menu_id == Id && item.menu_sub_id == SubId);

        if (exists) {
          return prev.map(item =>
            item.id == id && item.menu_id == Id && item.menu_sub_id == SubId ? { ...item, count: selected.count } : item
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
          item.name == selectedMenu
            ? { ...item, data: updatedMenu }
            : item
        );
      });
  };

  const plusDailyBtn = (SubId,Id) => {

      const updatedMenu = menuData.map(d => {
        if (d.menu_id == Id && d.menu_sub_id == SubId){
          return {
            ...d,
            meats: null,
            count: d.count + 1,
          };
        }else{
          return d;
        } 
      });

      setMenuData(updatedMenu);
      
      let selected;

      updatedMenu.some(menu => {
        if (menu.menu_sub_id == SubId && menu.menu_id == Id) {
          selected = { 
            ...menu, 
            price: menu.price, 
            name: menu.name,
            meat: null,
            id: menu.menu_sub_id
          };
          return true; 
        }
        return false;
      });
      if (!selected) return;


      setOrderList(prev => {
        const exists = prev.find(item => item.menu_id == Id && item.menu_sub_id == SubId); 
        if (exists) {
          return prev.map(item =>
             item.menu_id == Id && item.menu_sub_id == SubId ? { ...item, count: selected.count } : item
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
          item.name == selectedMenu
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
          meat.id == id && d.menu_id == Id && meat.menu_sub_id == SubId? { ...meat, count: Math.max(0, meat.count - 1)  } : meat
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
          item.id == id && item.menu_id == Id && item.menu_sub_id == SubId
            ? { ...item, count: Math.max(0, item.count - 1) }
            : item
        )
        .filter(item => item.count > 0) 
    );
  };

  const minusDailyBtn = (SubId,Id) => {
            
   const updatedMenu = menuData.map(d => {
        if (d.menu_id == Id && d.menu_sub_id == SubId){
          return {
            ...d,
            count: Math.max(0, d.count - 1),
          };
        }else{
          return d;
        }   
      });

      setMenuData(updatedMenu);

    setOrderList(prev =>
      prev
        .map(item =>
           item.menu_id == Id && item.menu_sub_id == SubId
            ? { ...item, count: Math.max(0, item.count - 1) }
            : item
        )
        .filter(item => item.count > 0) 
    );
  };

  

  let cancelModal = (name)=>{
    let data = menuData.map(d => d.name == name ? { ...d, show: !d.show } : d);
     setMain(prev => {
      return prev.map(item =>
        item.name == selectedMenu
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
          "order_type": tab,
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
          "order_type": tab,
          "total_amount": totalPrice,
          "login_id": loginID,
        },
      };
    }

    let response = await ApiRequest(obj);
    
    if (response.flag == false) {
      setLoading(false);
      setShowError(true)
      setErrorText2(response.message[0])
      setErrorText1("Fail to save!");setTimeout(() => setShowError(false), 2000)
    } else {
      if (response.data.status == "OK") {
        setLoading(false)
        setShowSuccess(true)
        setSuccessText2([response.data.message]);
        setSuccessText1("Success!");setOrderList([]);getMenuData();setTableNo("");setTab('0')
        dispatch({ type: 'NOTIFICATION_CLICK', payload: notiID });dispatch({ type: 'CLEAR_NOTIFICATIONS' })
        setTimeout(() => setShowSuccess(false), 3000);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }else{
          setErrorText1("Fail to save!");setShowError(true);setErrorText2([response.data.message]);setLoading(false);
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });setTimeout(() => setShowError(false), 2000)
      } 
    }
  }
  console.log("order List",orderList)

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
                  {/* ==== Menu Column (75%) ==== */}
                  <CCol xs={12} md={8} className="pe-3">
                    <h5 className="fw-bold mb-3">Available Menus</h5>
                    <div className="d-flex flex-wrap gap-3">
                      {menuData.length > 0 &&
                        menuData.map((item, index) => (
                          <Fragment key={index}>
                        <CCard
                          key={index}
                          className="shadow-lg border-0 text-center d-flex flex-column justify-content-between align-items-center rounded-4"
                          style={{
                            width: '190px',
                            height: '150px',
                            cursor: 'pointer',
                            background: 'linear-gradient(135deg, #fffdf7 0%, #fff5e6 100%)',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)'
                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)'
                          }}
                          onClick={() => cardClick(item.name,item.meats)}
                        >
                          <CCardBody className="d-flex flex-column justify-content-between align-items-center p-3">
                            <div
                              className="fw-semibold text-dark mb-2"
                              style={{
                                flexGrow: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '17px',
                                fontWeight: 600,
                                textTransform: 'capitalize',
                              }}
                            >
                              {item.name}
                            </div>

                            <div
                              className="w-100 text-center"
                              style={{
                                fontFamily: 'Poppins, sans-serif',
                                color: '#dc3545',
                                fontWeight: '600',
                                fontSize: '16px',
                              }}
                            >
                              ฿{item.price}
                            </div>
                            {(item.meats === null || item.meats.length === 0) && (
                              <CCol className="d-flex align-items-center justify-content-center mt-2">
                                <CButton
                                  color="warning"
                                  size="sm"
                                  className="text-white rounded-circle shadow-sm border-0"
                                  style={{
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '22px',
                                    fontWeight: 'bold',
                                    transition: 'all 0.25s ease',
                                  }}
                                  onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.15)')}
                                  onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                  onClick={() => minusDailyBtn(item.menu_sub_id, item.menu_id)}
                                >
                                  –
                                </CButton>

                                <span
                                  className="fw-bold px-3"
                                  style={{
                                    fontSize: '18px',
                                    color: '#333',
                                    userSelect: 'none',
                                  }}
                                >
                                  {item.count}
                                </span>

                                <CButton
                                  color="warning"
                                  size="sm"
                                  className="text-white rounded-circle shadow-sm border-0"
                                  style={{
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '22px',
                                    fontWeight: 'bold',
                                    transition: 'all 0.25s ease',
                                  }}
                                  onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.15)')}
                                  onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                  onClick={() => plusDailyBtn(item.menu_sub_id, item.menu_id)}
                                >
                                  +
                                </CButton>
                              </CCol>
                            )}
                            
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
                                  {item.meats != null && item.meats.length > 0 &&
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
                                            onClick={() => minusBtn(data.menu_sub_id, item.menu_id,data.id)}
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
                                            onClick={() => plusBtn(data.menu_sub_id, item.menu_id,data.id)}
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

                  {/* ==== Order List Column (25%) ==== */}
                  <CCol xs={12} md={4}>
                      <div className="border-start rounded-2 p-3 shadow-sm" style={{ width: '350px',background: "rgb(221 234 245)" }}>
                          <div className="pb-2 border-b" style={{ borderColor: '#ECEEF3' }}>
                              <div className="flex items-start justify-between">
                                <div className="text-[15px] font-semibold text-[#2B2D33]">

                                    <div className="d-flex align-items-center gap-2">
                                      <span
                                        className="fw-semibold"
                                        style={{
                                          color: '#6c757d', // muted gray
                                          fontSize: '15px',
                                          letterSpacing: '0.3px',
                                        }}
                                      >
                                        Table:
                                      </span>
                                      <span
                                        className="fw-bold px-3 py-1 rounded-pill shadow-sm"
                                        style={{
                                          backgroundColor: 'white', // light green background
                                          color: '#6D8EBF', // green text
                                          fontSize: '15px',
                                          border: '1px solid #19875440',
                                        }}
                                      >
                                         <select
                                          id="tableSelect"
                                          className="form-select "
                                          style={{ borderRadius: '8px',border: "none", boxShadow: "none" }}
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
                                      </span>
                                    </div>
                                </div>
                              </div>
  
                            {orderList.length === 0 && (
                                  <div
                                    style={{
                                    textAlign: "center",
                                    padding: "60px 20px",
                                    color: "#6c757d",
                                  
                                    }}
                                >
                                    {/* <img
                                        src={noDataImg}
                                        alt="No Data"
                                        width="50"
                                        className="mb-3"
                                        style={{ opacity: 0.8 }}
                                    /> */}
                                    <h5 style={{ fontWeight: "600" }}>No items selected</h5>
                                    {/* <p style={{ fontSize: "14px", color: "#999" }}>
                                        Pick a table or add a menu item to start.
                                    </p> */}
                                </div>
                            )}
  
                              {orderList.length > 0 && (
                                <div
                                  className="mt-3 p-1 rounded-xl flex gap-2"
                                  style={{ background: 'rgb(241 241 241)' }} // light pink track
                                >
                                  <button
                                    onClick={(e) => setTab(e.target.value)}
                                    value="0"
                                    type="button"
                                    className={`h-10 w-full rounded-lg text-sm font-medium transition-all
                                                focus:outline-none focus:ring-2 focus:ring-[#F8B4CF]
                                                appearance-none border-0
                                                ${tab == 0 ? 'text-white shadow-sm' : 'text-[#C14C7F]'}`}
                                    style={
                                      tab == 0
                                        ? { background: '#6D8EBF',width: "50%", borderTopLeftRadius: "4px",borderBottomLeftRadius: "4px" } // active gradient
                                        : { background: '#FFFFFF',width: "50%", borderTopLeftRadius: "4px",borderBottomLeftRadius: "4px" } // inactive white pill
                                    }
                                  >
                                    Dine In
                                  </button>
  
                                  <button
                                    onClick={(e) => setTab(e.target.value)}
                                    value="1"
                                    type="button"
                                    className={`h-10 w-full rounded-lg text-sm font-medium transition-all
                                                focus:outline-none focus:ring-2 focus:ring-[#F8B4CF]
                                                appearance-none border-0
                                                ${tab == 1 ? 'text-white shadow-sm' : 'text-[#C14C7F]'}`}
                                    style={
                                      tab == 1
                                        ? { background: '#6D8EBF',width: "50%", borderTopRightRadius: "4px",borderBottomRightRadius: "4px" }
                                        : { background: '#FFFFFF',width: "50%", borderTopRightRadius: "4px",borderBottomRightRadius: "4px"  } // inactive soft-pink
                                    }
                                  >
                                    Take Away
                                  </button>
                                </div>
                              )}
                            
                            </div>
  
                              {orderList.length > 0 && (
                                <>
                                  <div className="space-y-3">
                                    {orderList.map((it,ind) => (
                                      <div
                                        key={ind}
                                        className="rounded-xl px-4 py-3 shadow-sm mt-1 mb-1"
                                        style={{ background: "white", border: `1px solid ${colors.divider}`, borderRadius: "5px" }}
                                      >
                                        <div className="display-flex items-center w-full gap-2">  
                                          <div style={{width: "65%"}}>
                                            <div className="text-[14px] font-semibold text-[#2E2E36] leading-5 truncate fw-bold">
                                              {it.name}
                                            </div>
                                            <div className="text-[14px] font-semibold text-[#2E2E36] leading-5 truncate small text-muted">
                                              {it.meat}
                                            </div>
                                          </div>
    
                                          <div style={{width: "35%", textAlign: "end"}}>
                                            <div className='text-muted'>{it.count}x</div>
                                            <div className="text-muted" style={{fontStyle: "italic",color: colors.accent }}>฿{ (it.price) }</div>
                                          </div>
                                        </div>
    
                                      
                                      </div>
                                    ))}
                                  </div>
    
                                  <div className=" mt-2">
                                    <div className="rounded-xl px-4 py-2 ">
                                      
                                      <div className="display-flex  items-center justify-between" >
                                        <div className={`font-semibold text-[#A0A3AD] fw-semibold`} style={{width: "65%",fontSize: "18px"}}>Total</div>
                                        <div className={`font-semibold text-[#A0A3AD] fw-semibold`} style={{width: "35%", textAlign: "end",fontSize: "18px"}}>
                                          ฿{totalPrice}
                                        </div>
                                      </div>
                                    
                                    </div>
                                  </div>
    
                                  <div className="">
                                    <CButton className="btn w-100 mt-3 text-white" style={{background: "#6D8EBF"}} onClick={confirmClick}>
                                      Confirm Order
                                    </CButton>
                                  
                                  </div>
                                </>
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
