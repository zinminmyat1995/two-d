import React, { useState, useEffect } from "react";
import {
    CButton,
    CCol,
    CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import Message from "../../common/SuccessError";
import {

    cilCalendar,
} from '@coreui/icons'
import Loading from "../../common/Loading"
import ApiPath from "../../common/ApiPath";
import { ApiRequest } from "../../common/ApiRequest";
import DatePicker  from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css'
import { dateFormatChange2, dateFormatChange1,dateFormatChange3  } from "../../common/CommonValidation"
import OrderDetailModal from "./OrderDetailModal";
import searchImg from '../../../assets/images/search.png';
import noDataImg from '../../../assets/images/no-data.png';

const ListIndex = () => {
    const [error, setError] = useState([]); // for error message
    const [success, setSuccess] = useState([]); // for success message
    const [fromDate, setFromDate] = useState(dateFormatChange2(new Date()));
    const [toDate, setToDate] = useState(dateFormatChange2(new Date()));
    const [mainData, setMainData ] = useState([])
    const [orderDetail, setOrderDetail ] = useState([]);
    const [show, setShow] = useState(false); // 
    const [loading, setLoading] = useState(false);  // for loading
    const [loginID , setLoginID ] = useState(localStorage.getItem('LOGIN_ID'));
    const [tax, setTax ] = useState(0);
    const [discount, setDiscount ] = useState(0)
    

    useEffect(() => {
        (async () => {
            if(localStorage.getItem("LOGIN_ID") == undefined){
                window.location.href="/login";
            }
            setLoading(true);
            await getData();
        })();
    }, []);


    let getData =async () => {
        setError([]); setSuccess([]);
        setLoading(true);
        let object = {
            url: ApiPath.BillingSearch,
            method: 'get',
            params: {
                "from_date": fromDate,
                "to_date": toDate,
                "login_id": loginID
            }
        }

        let response = await ApiRequest(object);
        if (response.flag === false) {
            setMainData([]); setLoading(false);
        } else {
            if (response.data.status === 'OK') {
                setMainData(response.data.data);setLoading(false);
            } else {
                setError([response.data.message]); setSuccess([]);
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }
        }
    }

    let detailClick =async(id)=>{
        setError([]); setSuccess([]);
        setLoading(true);
        let object = {
            url: ApiPath.BillingSearchId,
            method: 'get',
            params: {
                "order_id": id,
                "login_id": loginID
            }
        }

        let response = await ApiRequest(object);
        if (response.flag === false) {
            setError([response.message[0]]);  setLoading(false);
        } else {
            if (response.data.status === 'OK') {
                setOrderDetail(response.data.data);setTax(response.data.tax);setDiscount(response.data.discount)
                setLoading(false);setShow(true)
            } else {
                setError([response.data.message]); setSuccess([]);
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }
        }
    }


    return (
        <>
            <Loading start={loading} />
            <h3>Order List</h3>
            <hr />
            <OrderDetailModal
                show={show}
                onClose={() => setShow(false)}
                orderList={orderDetail}
                tax={tax}
                discount={discount}
            />

            <Message success={success} error={error} />
            <CRow className="mt-5">
                
                <CCol lg="1"></CCol>
                <CCol lg="2" className="text-align-center">
                    <p className="label">From Date</p>
                </CCol>
                <CCol lg="3">
                     <div className="relative w-full full-datepicker-box" style={{display: "flex"}}>
                        <DatePicker
                            selected={fromDate}
                            onChange={(date) => setFromDate(dateFormatChange2(date))}
                            dateFormat="dd-MM-yyyy"
                            placeholderText="Select a date"
                            className="w-full border rounded-lg p-2 pr-10 datepicker-box"
                        />
                        {/* CoreUI calendar icon inside input */}
                        <CIcon
                            icon={cilCalendar}
                            title="Edit"
                            style={{
                                marginTop: "12px"
                            }}
                        />
                    </div>
                </CCol>
                <CCol lg="2" className="text-align-center">
                    <p className="label" >To Date</p>
                </CCol>
                <CCol lg="3">
                    <div className="relative w-full full-datepicker-box" style={{display: "flex"}}>
                        <DatePicker
                            selected={toDate}
                            onChange={(date) => setToDate(dateFormatChange2(date))}
                            dateFormat="dd-MM-yyyy"
                            placeholderText="Select a date"
                            className="w-full border rounded-lg p-2 pr-10 datepicker-box"
                        />
                        {/* CoreUI calendar icon inside input */}
                        <CIcon
                            icon={cilCalendar}
                            title="Edit"
                            style={{
                                marginTop: "12px"
                            }}
                        />
                    </div>
                </CCol>
            </CRow>

            <CRow className="mt-5 mb-5 text-align-center">
                <CCol>
                    <CButton className="login-button" style={{ width: "100px" }} onClick={() => getData()}>Search</CButton>
                </CCol>
            </CRow>

          

            {mainData.length > 0 ? (
                <>
                    <CRow>
                        <CCol>
                            <label className="total-row">Total - {mainData.length}  row(s)</label>
                        </CCol>
                    </CRow>
                    <CRow className="mb-4">
                        <CCol>
                            <div className='table-responsive tableFixHead'>
                                <table className='table billing-list-table'>
                                    <thead className="text-center">
                                        <tr>
                                            <th className="bg-body-tertiary" style={{verticalAlign: "middle"}} width="120px" >Order No</th>
                                            <th className="bg-body-tertiary" style={{verticalAlign: "middle"}} width="260px">Table No</th>
                                            <th className="bg-body-tertiary" style={{verticalAlign: "middle"}} width="200px">Amount</th>
                                            <th className="bg-body-tertiary" style={{verticalAlign: "middle"}} width="180px">status</th>
                                            <th className="bg-body-tertiary text-center" style={{verticalAlign: "middle"}} width="100px">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-center">
                                    {mainData.map((item, index) => (
                                        <tr
                                            key={index}
                                            style={{ transition: "0.3s" }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = "#f0fff4")}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                        >
                                            <td style={{paddingTop: "10px"}}>{item.order_id}</td>
                                            <td style={{paddingTop: "10px"}}>{item.table_name}</td>
                                            <td style={{paddingTop: "10px"}}>{item.amount}</td>
                                            <td style={{paddingTop: "10px"}}>
                                                <span
                                                    className="fw-bold px-3 py-1 rounded-pill shadow-sm"
                                                    style={{
                                                        backgroundColor: `${item.status == 1? "rgb(242 8 8 / 14%)" : "#1987541a"}`,
                                                        color: `${item.status == 1? "rgb(255 57 57)" : "#198754"}`,
                                                        fontSize: '15px',
                                                        border: `${item.status == 1? "1px solid rgb(255 0 0 / 25%)" : "1px solid #19875440"}`,
                                                    }}
                                                >
                                                    {item.status == 1? "Pending": "Paid"}
                                                </span>
                                                
                                            </td>
                                            <td>
                                              <img src={searchImg} alt="Girl Headphones" width={"30"} 
                                                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                                    onClick={() => detailClick(item.order_id)}
                                              />
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>

                            </div>
                        </CCol>
                    </CRow>
                </>
            ) : (
                // ❌ Data not found UI
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
                        width="90"
                        className="mb-3"
                        style={{ opacity: 0.8 }}
                    />
                    <h5 style={{ fontWeight: "600" }}>No Data Found</h5>
                    <p style={{ fontSize: "14px", color: "#999" }}>
                        There are currently no records to display.
                    </p>
                </div>
                )}


        </>
    )
}

export default ListIndex
