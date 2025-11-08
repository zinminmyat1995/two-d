// StoreRegistrationTabs.jsx
import React, { useState,useEffect } from 'react'
import { CRow, CCol, CForm,CFormInput ,CButton ,CCard,CCardHeader ,CCardBody ,CCardFooter,CFormTextarea   } from '@coreui/react'
import Loading from "../../common/Loading"
import ApiPath from "../../common/ApiPath";
import { ApiRequest } from "../../common/ApiRequest";
import Confirmation from "../../common/Confirmation";
import Message from "../../common/SuccessError";
import CIcon from '@coreui/icons-react'
import {
    cilTrash,
    cilPencil,
    cilCheckAlt,
    cilMinus,
    cilCalendar 
} from '@coreui/icons'
import DatePicker  from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css';
import { dateFormatChange2, dateFormatChange1,dateFormatChange3  } from "../../common/CommonValidation"
import {validateIntegerOnly} from "../../common/CommonValidation"
import axios from "axios";

const pages = Array.from({ length: 3 }, (_, i) => `${i + 1}`)

const RegistrationTabs = () => {
    const [active, setActive] = useState(1)
    const [name, setName] = useState("");
    const [mainData, setMainData ] = useState([]);
    const [error, setError] = useState([]); // for error message
    const [success, setSuccess] = useState([]); // for success message
    const [loading, setLoading] = useState(false);  // for loading
    const [loginID , setLoginID ] = useState(localStorage.getItem('LOGIN_ID'));
    const [show, setShow] = useState(false); // 
    const [content, setContent] = useState(""); // 
    const [type, setType] = useState(""); //
    const [date, setDate] = useState(dateFormatChange2(new Date()));
    const [note, setNote ] = useState("")
    const [amount, setAmount ] = useState("");
    const [rawMaterialData , setRawMaterialData ] = useState([])
    const [copyRawMaterialData, setCopyRawMaterialData ] = useState([])
    const [confirmData, setConfirmData ] = useState([]);


    useEffect(() => {
        (async () => {
            if(localStorage.getItem("LOGIN_ID") == undefined){
                window.location.href="/login";
            }
            setLoading(true);
            await getRawMaterial();
        })();
    }, []);

    let getRawMaterial =async ()=>{
        setLoading(true);
        let object = {
            url: ApiPath.StoreGetRawMaterial,
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
                setRawMaterialData(response.data.data);setCopyRawMaterialData(JSON.parse(JSON.stringify(response.data.data)));
                setLoading(false);
            } else {
                setError([response.data.message]); setSuccess([]);
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }
        }
    }
    let addBtn = () =>{
        if(name == ""){
            setError(["Please fill item name!"]);
            setSuccess([]);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }else{
            let res = mainData.filter(data => data.name == name)
        
            if(res.length > 0){
                setError(["Your item is already exists!"]);
                setSuccess([]);
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }else{
                setMainData([...mainData, { name }]);
                setName("");setError([]);setSuccess([]);
            }
        }
    
    }

  

  let deleteClick = (name) =>{
    setSuccess([]);setError([]);
    let res = mainData.filter(data=>data.name != name)
    setMainData(res)
  }

    let saveClick = () => {
        setError([]); setSuccess([]);setType("save");
		setShow(true);setContent("Are you sure want to save?");
	}

    let saveOK =async ()=>{
        setError([]);setSuccess([]);setLoading(true);setShow(false);
        let object = {
            url: ApiPath.StoreRegister,
            method: 'post',
            params: {
                "data": mainData,
                "login_id": loginID
            }
        }
        let response = await ApiRequest(object);
        if (response.flag === false) {
            setError([response.message[0]]); setSuccess([]);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });setLoading(false);
        } else {
            if (response.data.status == "OK") {
                setSuccess([response.data.message]);setError([]);setMainData([]);getRawMaterial();
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }else{
                setError([response.data.message]);setSuccess([]);setLoading(false);
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            } 
        }
    }

    let activeChange = (idx) =>{
        setActive(idx); setError([]);setSuccess([])
    }

    let amountChange = ( val, id ) =>{
        if(validateIntegerOnly(val) && val != "0"){
           setAmount(val)
        }
        
    }

    let page2Save = ()=>{
        
        let str = [];

        if (date == "" || date == null) {
			str.push("Please select date!")
		}
		if (amount == "") {
			str.push("Please fill amount!")
		}
		if (note == "") {
			str.push("Please select note!")
		}
		
		if (str.length > 0) {
			setError(str);
			setSuccess([]);
			window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
		} else {
			setError([]); setSuccess([]);setType("update");
		    setShow(true);setContent("Are you sure want to save?");
		}

        
    }

    let updateOK =async () =>{
        setError([]);setSuccess([]);setLoading(true);setShow(false);
  
        let object = {
            url: ApiPath.StoreAmountRegister,
            method: 'post',
            params: {
                "amount": amount,
                "date": date,
                "note": note,
                "login_id": loginID
            }
        }
        let response = await ApiRequest(object);
        if (response.flag === false) {
            setError([response.message[0]]); setSuccess([]);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });setLoading(false);
        } else {
            if (response.data.status == "OK") {
                setSuccess([response.data.message]);setError([]);setMainData([]);setLoading(false);setNote("");setDate(dateFormatChange2(new Date()));setAmount("");
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }else{
                setError([response.data.message]);setSuccess([]);setLoading(false);
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            } 
        }
    }

    let checkboxChange = (id)=>{
		let data = rawMaterialData.map(data=>{
			if(data.id == id){
				data.check = !data.check;
				return data;
			}
			return data;
		})
		setRawMaterialData(data)
	}

    let purchaseAmountChange = (id,val)=>{
		let data = rawMaterialData.map(data=>{
			if(data.id == id){
				data.amount = val;
				return data;
			}
			return data;
		})
		setRawMaterialData(data)
	}

    let confirmClick = (id,val)=>{
		let res = rawMaterialData.filter(data => data.check == true)
		setConfirmData(res)
	}

    let purchaseSave = () =>{
        setError([]); setSuccess([]);setType("confirm");
		setShow(true);setContent("Are you sure want to save?");
    }

    let confirmOK =async () =>{
        setError([]);setSuccess([]);setLoading(true);setShow(false);
  
        let object = {
            url: ApiPath.StorePurchaseListSave,
            method: 'post',
            params: {
                "data": confirmData,
                "login_id": loginID
            }
        }
        let response = await ApiRequest(object);
        if (response.flag === false) {
            setError([response.message[0]]); setSuccess([]);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });setLoading(false);
        } else {
            if (response.data.status == "OK") {
                setSuccess([response.data.message]);setError([]);setRawMaterialData(copyRawMaterialData);setConfirmData([])
                setLoading(false);
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }else{
                setError([response.data.message]);setSuccess([]);setLoading(false);
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            } 
        }
    }


  return (
    <CRow>
      <CCol>
        <CForm>
          <h3>Raw Materials</h3>
          <hr />
          <Loading start={loading} />
            <Confirmation
                show={show}
                content={content}
                type={type}
                saveOK={saveOK}
                updateOK={updateOK}
                confirmOK={confirmOK}
                okButton={"Ok"}
                cancel={() => setShow(false)}
                cancelButton={"Cancel"}
            />
            <Message success={success} error={error} />
          <div className="tabs-wrap">
            <nav className="tabs">
              {pages.map((label, i) => {
                const idx = i + 1
                const isActive = idx === active

                return (
                  <button
                    key={label}
                    className={`tab ${isActive ? 'active' : ''}`}
                    onClick={() => activeChange(idx)}
                    style={{width: "50%"}}
                    type="button"
                  >
                    {label == 1? "Registering item" : label == 2 ? "Registering the purchase amount" : "Recording purchases for item"}
                  </button>
                )
              })}
            </nav>
 
            {pages[active-1] == 1 ?
            (
            <>  
                <CRow className="mt-3">
                    <CCol lg="2"></CCol>
                    <CCol lg="8">
                        <CCard className=" border-0 rounded-3">
                            <CCardHeader className="bg-white" style={{borderBottom: "none"}}>
                                <CRow className="mt-5 mb-4">
                                <CCol lg="1"></CCol>
                                <CCol lg="2" className="text-align-center">
                                    <p className="label">Item Name</p>
                                </CCol>
                                <CCol lg="4">
                                    <CFormInput type="text" aria-label="sm input example"  value={name} onChange={(e) => setName(e.target.value)} />
                                </CCol>
                                <CCol lg="1">
                                    <CButton className="login-button" style={{ width: "100px" }} onClick={() => addBtn()}>Add</CButton>
                                </CCol>
                                
                            </CRow>
                            {mainData.length > 0 && 
                                <CRow >
                                    <CCol>
                                        <label className="total-row">Total - {mainData.length}  row(s)</label>
                                    </CCol>
                                </CRow>
                            }
                            </CCardHeader>
                            {mainData.length > 0 && 
                            (
                                <>
                                    <CCardBody style={{marginTop: "-20px"}}>
                                        
                                        <>
                                            <CRow className="">
                                            <CCol>
                                                <div className="table-responsive tableFixHead">
                                                <table className="table  ng-return-list-table align-middle">
                                                    <thead className="text-center">
                                                    <tr>
                                                        <th
                                                            className="bg-body-tertiary"
                                                            style={{ verticalAlign: "middle" }}
                                                            width="60px"
                                                        >No</th>
                                                        <th
                                                            className="bg-body-tertiary"
                                                            style={{ verticalAlign: "middle" }}
                                                            width="180px"
                                                        >
                                                            Name
                                                        </th>
                                                        
                                                        <th
                                                            className="bg-body-tertiary"
                                                            style={{ verticalAlign: "middle" }}
                                                            width="120px"
                                                        >
                                                            Action
                                                        </th>
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
                                                            <td>{index + 1}</td>
                                                            <td>{item.name}</td>
                                                            <td>
                                                                <CIcon
                                                                    icon={cilMinus}
                                                                    className="plus-button"
                                                                    style={{
                                                                        cursor: "pointer",
                                                                        backgroundColor: "#e53e3e",
                                                                        borderRadius: "50%",
                                                                        padding: "5px",
                                                                        color: "white",
                                                                        borderColor: "#e53e3e",
                                                                    }}
                                                                    title="Delete"
                                                                onClick={() => deleteClick(item.name)}
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
                                    
                                    </CCardBody>
                                    <CCardFooter className="bg-white text-center mb-3" style={{borderTop: "none"}}>
                                        <CButton
                                        className="login-button"
                                        onClick={() => saveClick()}
                                        style={{ width: "100px" }}
                                        color="primary"
                                        >
                                        Save
                                        </CButton>
                                    </CCardFooter>
                                </>
                            )
                            }
                        </CCard>
                    </CCol>
                    <CCol lg="2"></CCol>
                </CRow>
                
              
            </>
            )
            : pages[active-1] == 2 ?
            (
                <>  
                    <CRow className="mt-3">
                        <CCol lg="2"></CCol>
                        <CCol lg="8">
                            <CCard className=" border-0 rounded-3">
                                <CCardHeader className="bg-white" style={{borderBottom: "none"}}>
                                    <CRow className="mt-5 ">
                                        <CCol lg="1"></CCol>
                                        <CCol lg="2" className="text-align-center">
                                            <p className="label">Date</p>
                                        </CCol>
                                        <CCol lg="6">
                                            <div className="relative w-full full-datepicker-box" style={{display: "flex"}}>
                                                <DatePicker
                                                    selected={date}
                                                    onChange={(date) => setDate(dateFormatChange2(date))}
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
                                    <CRow className="mt-4 ">
                                        <CCol lg="1"></CCol>
                                        <CCol lg="2" className="text-align-center">
                                            <p className="label">Amount</p>
                                        </CCol>
                                        <CCol lg="5">
                                            <CFormInput type="text" aria-label="sm input example"  value={amount} onChange={(e) => amountChange(e.target.value)} />
                                        </CCol>
                                    </CRow>
                                    <CRow className="mt-4 ">
                                        <CCol lg="1"></CCol>
                                        <CCol lg="2" className="text-align-center">
                                            <p className="label">Note</p>
                                        </CCol>
                                        <CCol lg="5">
                                            <CFormTextarea
                                                feedbackInvalid="Please enter a message in the textarea."
                                                id="note"
                                                required
                                                value={note}
                                                onChange={(e)=>setNote(e.target.value)}
                                            ></CFormTextarea>
                                        </CCol>
                                    </CRow>
                               
                                </CCardHeader>
                                
                            </CCard>
                        </CCol>
                        <CCol lg="2"></CCol>
                    </CRow>
                    <CRow className="mt-5 mb-5">
                        <CCol lg="3"></CCol>
                        <CCol lg="6" className="text-align-center">
                            <CButton className="login-button"  onClick={() => page2Save()} style={{width: "100px"}}>Save</CButton>
                        </CCol>
                        <CCol lg="2"></CCol>
                    </CRow>
                
                </>
            )
            :
            (
                <>  
                    {rawMaterialData.length > 0 && 
                    (
                        <CRow className="mt-3">
                            <CCol lg="2"></CCol>
                            <CCol lg="8">
                                <CCard className=" border-0 rounded-3">
                                    <CCardHeader className="bg-white" style={{borderBottom: "none"}}>
                        
                                
                                        <CRow >
                                            <CCol>
                                                <h5 style={{fontWeight: "bold"}}>Raw materials required for purchase</h5>
                                            </CCol>
                                        </CRow>
                                        <CRow >
                                            <CCol>
                                                <label className="total-row">Total - {rawMaterialData.length}  row(s)</label>
                                            </CCol>
                                        </CRow>
                                    
                                    </CCardHeader>
                                        <CCardBody style={{marginTop: "-20px"}}>
                                            
                                            <>
                                                <CRow className="">
                                                <CCol>
                                                    <div className="table-responsive tableFixHead">
                                                    <table className="table  ng-return-list-table align-middle">
                                                        <thead className="text-center">
                                                        <tr>
                                                            <th
                                                                className="bg-body-tertiary"
                                                                style={{ verticalAlign: "middle" }}
                                                                width="60px"
                                                            ></th>
                                                            <th
                                                                className="bg-body-tertiary"
                                                                style={{ verticalAlign: "middle" }}
                                                                width="180px"
                                                            >
                                                                Name
                                                            </th>
                                                            
                                                            <th
                                                                className="bg-body-tertiary"
                                                                style={{ verticalAlign: "middle" }}
                                                                width="120px"
                                                            >
                                                                Amount
                                                            </th>
                                                        </tr>
                                                        </thead>
                                                        <tbody className="text-center">
                                                        {rawMaterialData.map((item, index) => (
                                                            <tr
                                                                key={index}
                                                                style={{ transition: "0.3s" }}
                                                                onMouseEnter={(e) => (e.currentTarget.style.background = "#f0fff4")}
                                                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                                            >
                                                                <td>
                                                                    <input type="checkbox"  style={{width: "14px", height: "14px"}} value={item.id}   checked={item.check === true} onChange={(e) => checkboxChange(item.id)}/>
                                                                </td>
                                                                <td>{item.name}</td>
                                                                <td>
                                                                    <CFormInput type="text" aria-label="sm input example"  value={item.amount} onChange={(e) => purchaseAmountChange(item.id, e.target.value)} />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        </tbody>
                                                    </table>
                                                    </div>
                                                </CCol>
                                                </CRow>
                                                 <CRow className="mt-5 mb-5">
                                                    <CCol lg="3"></CCol>
                                                    <CCol lg="6" className="text-align-center">
                                                        <CButton className="login-button"  onClick={() => confirmClick()} style={{width: "100px"}}>Confirm</CButton>
                                                    </CCol>
                                                    <CCol lg="2"></CCol>
                                                </CRow>
                                            </>
                                        
                                        </CCardBody>
                                        {confirmData.length > 0 &&
                                        (
                                            <CCardFooter className="bg-white text-center mb-3 shadow-lg border-0 rounded-3" style={{borderTop: "none"}}>
                                                <CRow className="mb-4 mt-2">
                                                    <CCol className="text-center">
                                                        <h4 style={{ fontWeight: "bold", color: "#2c3e50", borderBottom: "2px solid #2c3e50", display: "inline-block", paddingBottom: "4px" }}>
                                                        Purchase Item List
                                                        </h4>
                                                    </CCol>
                                                    </CRow>

                                                
                                                        {confirmData.map((data, ind) => {
                                                            return (
                                                            <CRow key={ind} className="mb-2">
                                                                <CCol lg="3"></CCol>
                                                                <CCol 
                                                                lg="6" 
                                                                style={{ 
                                                                    display: "flex", 
                                                                    textAlign: "start",
                                                                    fontSize: "1rem", 
                                                                    padding: "6px 12px", 
                                                                    borderBottom: "1px dashed #ccc" 
                                                                }}
                                                                >
                                                                <span style={{ fontWeight: "600", color: "#34495e", width: "200px" }}>{data.name}</span>
                                                                <span style={{ fontWeight: "bold", color: "#e74c3c" }}>- {data.amount}</span>
                                                                </CCol>
                                                            </CRow>
                                                            )
                                                        })}
                                                    

                                                    <CRow className="mt-4 mb-3">
                                                        <CCol lg="3"></CCol>
                                                        <CCol lg="6" className="text-align-center">
                                                            <CButton className="login-button"  onClick={() => purchaseSave()} style={{width: "100px"}}>Save</CButton>
                                                        </CCol>
                                                        <CCol lg="2"></CCol>
                                                    </CRow>

                                            </CCardFooter>
                                        )}
                                    
                                </CCard>
                            </CCol>
                            <CCol lg="2"></CCol>
                        </CRow>
                        
                    )} 
                </>
            )
            }

            {/* <div className="tabs-bottom-line" />
            
            <div className="tab-content"></div> */}
          </div>
        </CForm>
      </CCol>

    </CRow>
  )
}

export default RegistrationTabs
