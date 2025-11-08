import React,{useState,useRef ,useEffect, Fragment } from 'react'
import {
  CButton,
  CCard,
  CCardBody,

  CListGroupItem,
  CCol,
  CListGroup ,
  CRow,

} from '@coreui/react'

import ApiPath from "../../common/ApiPath";
import { ApiRequest } from "../../common/ApiRequest";
import Loading from "../../common/Loading"
import ErrorModal from './ErrorModal'
import SuccessModal from './SuccessModal'
import ConfirmModal from './ConfirmModal'
import { Edit2, Minus, Plus, X } from 'lucide-react'
import noDataImg from '../../../assets/images/no-data.png';

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


const RegistrationIndex = () => {

    const headerRef = useRef()
    const [loginID , setLoginID ] = useState(localStorage.getItem('LOGIN_ID'));   
    const [loading, setLoading] = useState(false);  // for loading
    const [main, setMain ] = useState([])
    const [selectedTable, setSelectedTable ] = useState("");
    const [ orderListID, setOrderListID ] = useState("");
    const [orderList, setOrderList ] = useState([]);
    const [showError, setShowError] = useState(false)
    const [errorText1, setErrorText1 ] = useState("");
    const [errorText2, setErrorText2 ] = useState("");
    const [showSuccess, setShowSuccess] = useState(false)
    const [successText1, setSuccessText1 ] = useState("");
    const [successText2, setSuccessText2 ] = useState("");
    const [showConfirm, setShowConfirm] = useState(false)
    const [ paymentData, setPaymentData ] = useState([]);
    const [ payment, setPayment ] = useState("");
    const [tab, setTab] = useState('')
    const [tax, setTax ] = useState("");
    const [discount, setDiscount] = useState("");

    useEffect(() => {
      (async () => {
        if(localStorage.getItem("LOGIN_ID") == undefined){
          window.location.href="/login";
        }
        await getPayment();
        await getData();
        await getSettingData();
      })();
    }, []);

   let getPayment =async () => {
      let object = {
        url: ApiPath.SettingPaymentSearch,
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
          setPaymentData(response.data.data);setPayment(response.data.data[0]['id'])
        } else {
          setError([response.data.message]); setSuccess([]);
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }
      }
      
    }

    let getSettingData =async () => {
        let object = {
          url: ApiPath.SettingGetData,
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
            setTax(response.data.data[0]['tax']);
            setDiscount(response.data.data[0]['discount']);
          } else {
            setError([response.data.message]); setSuccess([]);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          }
        }
        
      }

    useEffect(() => {
      document.addEventListener('scroll', () => {
          headerRef.current &&
          headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
      })
    }, [])

    let getData =async ()=>{
        setLoading(true)
        let object = {
          url: ApiPath.BillingGetData,
          method: 'get',
          params: {
            "login_id": loginID
          }
        }
      
        let response = await ApiRequest(object);
        if (response.flag === false) {
          setLoading(false);setMain([])
        } else {
          if (response.data.status === 'OK') {
            let res = response.data.data; let arr = []
            setMain(res);
            setLoading(false);
          } else {
            setError([response.data.message]); setSuccess([]);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          }
        }
      }
      

  
    let cardClick = (id,name) =>{
      if(orderListID == id){
        setSelectedTable("")
        setOrderList([]); setOrderListID("");
      }else{
        let res = main.filter(data=> data.order_id == id)
        setSelectedTable(res[0]['table_name'])
        setTab(res[0]['order_type'])
        setOrderList(res[0]['details'])
        setOrderListID(id)
      }  
    }

    const totalPrice = orderList.reduce((sum, i) => sum + i.count * i.price, 0);

    
    // calculate tax amount
    const taxAmount = (totalPrice * tax) / 100;

    // calculate discount amount
    const discountAmount = (totalPrice * discount) / 100;

    // calculate final total
    const total = totalPrice + taxAmount - discountAmount;

    const confirmClick = () => {
      setShowConfirm(true)
    }


     let saveOK =async ()=>{
        setShowConfirm(false);setLoading(true);
          let obj = {
            method: "post",
            url: ApiPath.BillingPayment,
            params: {
              "order_id": orderListID,
              "payment": payment,
              "amount": total,
              "order_type": tab,
              "login_id": loginID,
            },
          };
          let response = await ApiRequest(obj);
          
          if (response.flag === false) {
            setLoading(false);
            setShowError(true)
            setErrorText2(response.message[0])
            setErrorText1("Fail to save!");setTimeout(() => setShowError(false), 2000)
          } else {
            if (response.data.status == "OK") {
              setLoading(false);getData();
              setShowSuccess(true)
              setSuccessText2([response.data.message]);
              setSuccessText1("Success!");setOrderList([]);setSelectedTable("");setOrderListID("");
              setTimeout(() => setShowSuccess(false), 3000);
              window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }else{
                setErrorText1("Fail to save!");setShowError(true);setErrorText2([response.data.message]);setLoading(false);
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });setTimeout(() => setShowError(false), 2000)
            } 
          }
      }
console.log("orderList",orderList)

  return (
    <>
        <Loading start={loading} />
        <ConfirmModal
          showConfirm={showConfirm}
          onOk={() =>saveOK()}
          onCancel={() => setShowConfirm(false)}
        />
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

            <div className="flex-grow-1 d-flex flex-column"  >
              <div className="flex-grow-1 p-4">
                <CRow className="g-4">
                  {/* ===== Menu Column (75%) ===== */}
                  <CCol xs={12} md={8} className="pe-3">
                    <h5 className="fw-bold mb-4 text-dark">
                      💳 Tables Awaiting Payment
                    </h5>

                    {main.length > 0 ? (
                      <div className="d-flex flex-wrap gap-3">
                        {main.map((item, index) => (
                          <Fragment key={index}>
                            <CCard
                              key={index}
                              className="border-0 text-center d-flex flex-column justify-content-between"
                              style={{
                                width: '180px',
                                height: '120px',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                backgroundColor: orderListID === item.order_id ? 'rgb(109 142 191)' : 'white',
                                border: orderListID === item.order_id ? '2px solid rgb(109 142 191)' : '1px solid #dee2e6',
                                color: orderListID === item.order_id ? 'white' : 'black',
                                boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 8px 2px',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                              onClick={() => cardClick(item.order_id, item.table_name)}
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
                                  {item.table_name}
                                </div>
                                <span
                                  className="fw-bold px-3 py-1 rounded-pill shadow-sm"
                                  style={{
                                    backgroundColor: '#fff0f0',
                                    color: '#dc3545',
                                    fontSize: '14px',
                                    border: '1px solid #f5c2c7',
                                  }}
                                >
                                  Pending
                                </span>
                              </CCardBody>
                            </CCard>
                          </Fragment>
                        ))}
                      </div>
                    ) : (
                      // ✅ No Data Section
                      <div
                        className="d-flex flex-column align-items-center justify-content-center text-center rounded-4 shadow-sm"
                        style={{
                          height: '220px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #ECEEF3',
                          color: '#6B7280',
                        }}
                      >
                        {/* icon */}
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle mb-3"
                          style={{
                            width: '60px',
                            height: '60px',
                            background: '#F5F6FA',
                            border: '1px solid #E6E8EF',
                          }}
                        >
                          <span style={{ fontSize: '26px' }}>🪑</span>
                        </div>

                        {/* title */}
                        <div
                          className="fw-semibold"
                          style={{
                            fontSize: '16px',
                            color: '#2B2D33',
                          }}
                        >
                          No Unpaid Orders
                        </div>

                        {/* subtitle */}
                        <div
                          className="mt-1"
                          style={{
                            fontSize: '13px',
                            color: '#9CA3AF',
                          }}
                        >
                          All tables are settled — ready for new orders ✅
                        </div>
                      </div>

                    )}
                </CCol>


                  {/* ===== Order List Column (25%) ===== */}
                  <CCol xs={12} md={4}>
                    <div className="border-start rounded-2 p-3 shadow-sm" style={{ width: '350px',background: "rgb(221 234 245)" }}>
                        <div className="pb-2 border-b" style={{ borderColor: '#ECEEF3' }}>
                            <div className="flex items-start justify-between">
                              <div className="text-[15px] font-semibold text-[#2B2D33]">
                                {selectedTable ? (
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
                                      {selectedTable}
                                    </span>
                                  </div>
                                ) : (
                                  ""
                                )} 
                              </div>
                            </div>

                          {orderList.length === 0 && (
                              <div
                                style={{
                                textAlign: "center",
                                padding: "60px 20px",
                                color: "#6c757d",
                                border: "2px dashed #dee2e6",
                                borderRadius: "12px",
                                backgroundColor: "#f8f9fa",
                                boxShadow: "inset 0 0 10px rgba(0,0,0,0.03)",
                                }}
                            >
                                <img
                                    src={noDataImg}
                                    alt="No Data"
                                    width="50"
                                    className="mb-3"
                                    style={{ opacity: 0.8 }}
                                />
                                <h5 style={{ fontWeight: "600" }}>No items selected</h5>
                                <p style={{ fontSize: "14px", color: "#999" }}>
                                    Pick a table or add a menu item to start.
                                </p>
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
                                          {it.menu_name}
                                        </div>
                                        <div className="text-[14px] font-semibold text-[#2E2E36] leading-5 truncate small text-muted">
                                          {it.meat_name}
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
                                <div className="rounded-xl p-3 " style={{ background: "white", border: `1px solid ${colors.divider}`}}>
                                  <div className="display-flex  items-center justify-between py-1" style={{borderBottom: "1px dashed #b1b1b1"}}>
                                    <div className={`text-[13px] font-semibold text-[#A0A3AD]`} style={{width: "65%"}}>Subtotal</div>
                                    <div className={`text-[13px] font-semibold text-[#A0A3AD] text-muted`} style={{width: "35%", textAlign: "end"}}>
                                      ฿{totalPrice}
                                    </div>
                                  </div>
                                  <div className="display-flex  items-center justify-between py-1" style={{borderBottom: "1px dashed #b1b1b1"}}>
                                    <div className={`text-[13px] font-semibold text-[#A0A3AD]`} style={{width: "65%"}}>Tax {tax}%</div>
                                    <div className={`text-[13px] font-semibold text-[#A0A3AD] text-muted`} style={{width: "35%", textAlign: "end"}}>
                                      ฿{taxAmount}
                                    </div>
                                  </div>
                                  <div className="display-flex  items-center justify-between py-1" style={{borderBottom: "1px dashed #b1b1b1"}}>
                                    <div className={`text-[13px] font-semibold text-[#A0A3AD]`} style={{width: "65%"}}>Discount {discount}%</div>
                                    <div className={`text-[13px] font-semibold text-[#A0A3AD] text-muted`} style={{width: "35%", textAlign: "end"}}>
                                      -฿{discountAmount}
                                    </div>
                                  </div>
                                  <div className="display-flex  items-center justify-between py-1" >
                                    <div className={`text-[13px] font-semibold text-[#A0A3AD] fw-bold`} style={{width: "65%"}}>Total</div>
                                    <div className={`text-[13px] font-semibold text-[#A0A3AD] fw-bold`} style={{width: "35%", textAlign: "end"}}>
                                      ฿{total}
                                    </div>
                                  </div>
                                
                                </div>
                              </div>

                              <div className=" mt-2">
                                  <div className="display-flex  items-center justify-between py-1 fw-bold">
                                    Payment Method
                                  </div>
                                  <CRow>
                                    <CCol>
                                      {paymentData.length > 0 &&
                                        paymentData.map((data,i)=>{
                                          return(
                                            <button key={i} type="button" className={`btn rounded-pill ${payment == data.id? "payment-select": ""}`} value={data.id} style={{marginLeft: "3px", marginRight: "3px",color: "black",border: "1px solid rgb(109, 142, 191)",background: "white"}} onClick={(e)=>setPayment(e.target.value)} >{data.name}</button>
                                          )
                                        })
                                      }
                                      {/* <button type="button" className="btn rounded-pill" style={{marginLeft: "3px", marginRight: "3px",background: "#6D8EBF", color: "white"}} >Cash</button>
                                      <button type="button" className="btn rounded-pill" style={{marginLeft: "3px", marginRight: "3px",background: "white", color: "black",border: "1px solid rgb(109, 142, 191)"}} >KPay</button>
                                      <button type="button" className="btn rounded-pill" style={{marginLeft: "3px", marginRight: "3px",background: "white", color: "black",border: "1px solid rgb(109, 142, 191)"}} >CB Pay</button> */}
                                    </CCol> 
                                  </CRow>    
                              </div>
                              <div className="border-top mt-3 pt-3">
                                <CButton className="btn w-100 mt-3 text-white" style={{background: "#6D8EBF"}} onClick={confirmClick}>
                                  Pay Bills
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



export default RegistrationIndex
