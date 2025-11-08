import React, { useState, useEffect } from "react";
import {
  CButton,
  CCard,
  CCol,
  CCardBody ,
  CFormSelect,
  CForm,
  CFormSwitch  ,
  CFormInput,
  CRow,
  CCardFooter ,
  CCardHeader 
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilMinus, cilPlus } from '@coreui/icons'
import Message from "../../common/SuccessError";
import Confirmation from "../../common/Confirmation";
import Loading from "../../common/Loading"
import {validateIntegerOnly} from "../../common/CommonValidation"
// import PlusCategoryModal from "./PlusCategoryModal"
// import PlusMeatModal from "./PlusMeatModal"
// import MinusCategoryModal from "./MinusCategoryModal";
import ApiPath from "../../common/ApiPath";
import { ApiRequest } from "../../common/ApiRequest";
import addImg from '../../../assets/images/add.png';
import deleteImg from '../../../assets/images/delete.png';
import updateImg from '../../../assets/images/update.png';
import editImg from '../../../assets/images/edit.png';
import noDataImg from '../../../assets/images/no-data.png';

const pages = Array.from({ length: 2 }, (_, i) => `${i + 1}`)

const DailyMenuIndex  = () => {
    const [error, setError] = useState([]); // for error message
    const [success, setSuccess] = useState([]); // for success message
    const [loginID , setLoginID ] = useState(localStorage.getItem('LOGIN_ID'));
    const [loading, setLoading] = useState(false);  // for loading
    const [name, setName ] = useState("");
    const [price, setPrice ] = useState("");
    const [isMain, setIsMain] = useState(false)
    const [show, setShow] = useState(false); 
    const [content, setContent] = useState(""); 
    const [type, setType] = useState(""); 
    const [ menuList, setMenuList ] = useState([]);
    const [ copyData, setCopyData ] = useState([]);
    const [ updatedID, setUpdatedID ] = useState("")
    const [ deletedID, setDeletedID ] = useState("")
    const [active, setActive] = useState(2)
    const [allCheck, setAllCheck ] = useState(false)

    useEffect(() => {
        (async () => {
            if(localStorage.getItem("LOGIN_ID") == undefined){
                window.location.href="/login";
            }
            setLoading(true);
            await getData();
        })();
    }, []);

    let getData =async ()=>{
        setLoading(true);
        let object = {
            url: ApiPath.DailyMenuSearch,
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
                setMenuList(response.data.data);setCopyData(response.data.data);setLoading(false);
            } else {
                setError([response.data.message]); setSuccess([]);
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }
        }
    }


    let tempGetData =async ()=>{
        let object = {
            url: ApiPath.DailyMenuSearch,
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
                setMenuList(response.data.data);setCopyData(response.data.data);setLoading(false);
            } else {
                setError([response.data.message]); setSuccess([]);
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }
        }
    }
    
    let priceChange = ( val) =>{
        if(validateIntegerOnly(val) && val != "0"){
            setPrice(val);
        }
        
    }

    const handleToggle = () => {
        setIsMain(!isMain)
    }

    let saveClick = ()=>{
        editClick();
        let str = [];
        if (name == "") {
            str.push("Please fill menu name!")
        }
        if (price == "") {
            str.push("Please fill price!")
        }
    
        if (str.length > 0) {
            setError(str);
            setSuccess([]);setLoading(false);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        } else {
            setError([]); setSuccess([]);setType("save");
            setShow(true);setContent("Are you sure want to save?");
        }
    }

    let saveOK = async()=>{
        setError([]);setSuccess([]);setShow(false);setLoading(true);
        let obj = {
            method: "post",
            url: ApiPath.DailyMenuRegister,
            params: {
                "dish_type": isMain == true? 1 : 0,
                "menu_name": name,
                "price": price,
                "login_id": loginID,
            },
            };
            let response = await ApiRequest(obj);
            
            if (response.flag === false) {
                setSuccess([]);setLoading(false);
                setError(response.message);
            } else {
            if (response.data.status == "OK") {
                setSuccess([response.data.message]);setError([]);setPrice("");setIsMain(false);setName("");tempGetData();
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }else{
                setError([response.data.message]);setSuccess([]);setLoading(false);
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            } 
        }
    }

    let editPriceChange = (id, val)=>{
        let res = menuList.filter(data => {
            if (data.id == id) {
                if(val == ""){
                    data.price = "";
                }else{
                    if(validateIntegerOnly(val) == true && val.charAt(0) != 0 ){
                        data.price = val;
                    }
                }
                return data;
            }
            return data;
        })
        setMenuList(res);
    }
    
    let editDishChange = (id, val) =>{
        let res = menuList.filter(data => {
            if (data.id == id) {
                data.type = val;
                return data;
            }
            return data;
        })
        setMenuList(res);
    }

    let editNameChange = (id, val) =>{
        let res = menuList.filter(data => {
            if (data.id == id) {
                data.name = val;
                return data;
            }
            return data;
        })
        setMenuList(res);
    }

    

    let updateClick =async (id) => {
        let temp = menuList.filter(data=> data.id == id);
        let str = [];
        if(temp[0]['name'] == ""){
            str.push("Please fill name!")
        }
        if(temp[0]['price'] == ""){
            str.push("Please fill price!")
        }


        if(str.length > 0 ){
            setError(str);
            setSuccess([]);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }else{
            setError([]); setSuccess([]);setLoading(false);setType("update");
            setUpdatedID(id);
            setShow(true);setContent("Are you sure want to update?");
        }
    }

    let deleteClick = (id) => {
        setError([]); setSuccess([]);setLoading(false);setType("delete");setDeletedID(id);
        setShow(true);setContent("Are you sure want to delete?");
    }

    
    let editClick = (id) => {
        setError([]);setSuccess([]);
        let temp = copyData.map(data => ({
            ...data,
            edit_flag: data.id === id
        }));
        setMenuList(temp);
    };

    let updateOK = async () =>{
        let res = menuList.filter(data => data.id == updatedID)
        setError([]);setSuccess([]);setLoading(true);setShow(false);
        let object = {
            url: ApiPath.DailyMenuUpdate,
            method: 'post',
            params: {
                "id": res[0]['id'],
                "price": res[0]['price'],
                "dish_type": res[0]['type'],
                "menu_name": res[0]['name'],
                "login_id": loginID
            }
        }
        let response = await ApiRequest(object);
        if (response.flag === false) {
            setError([response.message[0]]); setSuccess([]);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });setLoading(false);
        } else {
            if (response.data.status == "OK") {
                setSuccess([response.data.message]);setError([]);tempGetData();
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }else{
                setError([response.data.message]);setSuccess([]);setLoading(false);
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            } 
        }
    }

    let deleteOK =async ()=>{
        setSuccess([]); setError([]); setShow(false);
        setLoading(true);
        let object = {
            url: ApiPath.DailyMenuDelete,
            method: 'delete',
            params: {
                "login_id": loginID,
                "menu_id": deletedID
            }
        }

        let response = await ApiRequest(object);
        if (response.flag === false) {
            setError([response.message[0]]); setUserData([]); setLoading(false);
        } else {
            if (response.data.status === 'OK') {
                setSuccess([response.data.message]);setError([]);
                tempGetData();window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            } else {
                setError([response.data.message]); setSuccess([]);
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }
        }
    }

    
    let activeChange = (idx) =>{
        setActive(idx); setError([]);setSuccess([])
    }
    
    let checkboxChange = (id)=>{
		let data = menuList.map(data=>{
			if(data.id == id){
				data.check = !data.check;
				return data;
			}
			return data;
		})
		setMenuList(data)
	}

    let activeBtn = ()=>{
        let flg = false;
         menuList.map(data=>{
			if(data.check == true){
				flg= true;
			}
		})

        if(flg ==  false){
            setError(["Please select a menu to activate!"]); setSuccess([]);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });setLoading(false);
        }else{
            setError([]); setSuccess([]);setLoading(false);setType("active");
            setShow(true);setContent("Are you sure want to activate?");
        }
    }
    let inactiveBtn =async ()=>{
        let flg = false;
         menuList.map(data=>{
			if(data.check == true){
				flg= true;
			}
		})

        if(flg ==  false){
            setError(["Please select a menu to inactivate!"]); setSuccess([]);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });setLoading(false);
        }else{
            setError([]); setSuccess([]);setLoading(false);setType("inactive");
            setShow(true);setContent("Are you sure want to inactivate?");
        }
    }
    let clearBtn = ()=>{
        let data = menuList.map(data=>{
            data.check = false;
            return data;
		})
		setMenuList(data)
        setAllCheck(false)
    }

    let allCheckboxChange = ()=>{
        let data = menuList.map(data=>{
            data.check = !allCheck;
            return data;
		})
		setMenuList(data)
        setAllCheck(!allCheck)
    }
    let activeOK = async () =>{
        let res = menuList.filter(data => data.check == true)
        setError([]);setSuccess([]);setLoading(true);setShow(false);
        let object = {
            url: ApiPath.DailyMenuActive,
            method: 'post',
            params: {
                "data": res,
                "login_id": loginID
            }
        }
        let response = await ApiRequest(object);
        if (response.flag === false) {
            setError([response.message[0]]); setSuccess([]);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });setLoading(false);
        } else {
            if (response.data.status == "OK") {
                setSuccess([response.data.message]);setError([]);tempGetData();setAllCheck(false);
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }else{
                setError([response.data.message]);setSuccess([]);setLoading(false);
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            } 
        }
    }

    let inactiveOK = async () =>{
        let res = menuList.filter(data => data.check == true)
        setError([]);setSuccess([]);setLoading(true);setShow(false);
        let object = {
            url: ApiPath.DailyMenuInactive,
            method: 'post',
            params: {
                "data": res,
                "login_id": loginID
            }
        }
        let response = await ApiRequest(object);
        if (response.flag === false) {
            setError([response.message[0]]); setSuccess([]);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });setLoading(false);
        } else {
            if (response.data.status == "OK") {
                setSuccess([response.data.message]);setError([]);tempGetData();setAllCheck(false);
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
          <h3>Daily Menu Plan</h3>
          <hr />
          <Loading start={loading} />
            <Confirmation
                show={show}
                content={content}
                type={type}
                saveOK={saveOK}
                deleteOK={deleteOK}
                updateOK={updateOK}
                activeOK={activeOK}
                inactiveOK={inactiveOK}
                okButton={"Ok"}
                cancel={()=>setShow(false)}
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
                    {label == 1? "Create Daily Menu Items" : "Select Today's Dishes"}
                  </button>
                )
              })}
            </nav>
 
            {pages[active-1] == 1 ?
            (
                <>
                    
                <CRow className="mt-5">
                    <CCol lg="2"></CCol>
                    <CCol lg="2" className="text-align-center">
                            <p className="label">Menu Name</p>
                    </CCol>
                    <CCol lg="4">
                        <CFormInput type="text"   aria-label="sm input example" value={name}  onChange={(e)=>setName(e.target.value)} />
                    </CCol>
                    <CCol lg="4"></CCol>
                </CRow>


                <CRow className="mt-3">
                    <CCol lg="2"></CCol>
                    <CCol lg="2" className="text-align-center">
                            <p className="label">Price</p>
                    </CCol>
                    <CCol lg="4">
                        <CFormInput type="text"   aria-label="sm input example" value={price}  onChange={(e)=>priceChange(e.target.value)} />
                    </CCol>
                    <CCol lg="4"></CCol>
                </CRow>

                <CRow className="mt-3">
                    <CCol lg="2"></CCol>
                    <CCol lg="2" className="text-align-center">
                            <p className="label">Dish Type</p>
                    </CCol>
               
                        <CCol lg="4" className="d-flex align-items-center justify-content-start">
                            {/* Left label */}
                            <span style={{ marginRight: '10px', fontWeight: '600', color: isMain ? '#6c757d' : '#198754' }}>
                                Side Dish
                            </span>

                            {/* Switch */}
                            <CFormSwitch
                                size="lg"
                                id="dishToggle"
                                checked={isMain}
                                onChange={handleToggle}
                                color="success"
                            />

                            {/* Right label */}
                            <span style={{ marginLeft: '10px', fontWeight: '600', color: isMain ? '#198754' : '#6c757d' }}>
                                Main Dish
                            </span>
                        </CCol>
                    <CCol lg="4"></CCol>
                </CRow>
                <CRow className="mt-5 mb-5 text-align-center">
                    <CCol>
                        <CButton className="login-button" style={{ width: "100px" }} onClick={() => saveClick()}>Save</CButton>
                    </CCol>
                </CRow>
                
                {menuList.length > 0 && (
                   <CRow className="mt-3">
                        <CCol lg="2"></CCol>
                        <CCol lg="8">
                            <CCard className="shadow-lg border-0 rounded-3">
                                <CCardHeader className="bg-white">
                                    <CRow>
                                        <CCol className="d-flex align-items-center">
                                            <h5 style={{ fontFamily: "serif", marginTop:"4px", marginRight: "4px" }}>Daily Menu List</h5>
                                        </CCol>
                                    </CRow>
                                </CCardHeader>
                                    <>
                                        <CCardBody>                     
                                            <>
                                                <CRow className="">
                                                <CCol>
                                                    <div className="table-responsive tableFixHead">
                                                    {/* ⬇️ အစောင့်အစပ်မရှိ အဲ့ထဲက table code အ 그대로 ထားပေးထားတယ် */}
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
                                                            Menu Name
                                                            </th>
                                                            <th
                                                                className="bg-body-tertiary"
                                                                style={{ verticalAlign: "middle" }}
                                                                width="180px"
                                                            >
                                                            Dish Type
                                                            </th>
                                                            <th
                                                                className="bg-body-tertiary"
                                                                style={{ verticalAlign: "middle" }}
                                                                width="180px"
                                                            >
                                                            Price
                                                            </th>
                                                            <th
                                                                className="bg-body-tertiary"
                                                                style={{ verticalAlign: "middle" }}
                                                                width="120px"
                                                                colSpan={2} 
                                                            >
                                                            Action
                                                            </th>
                                                        </tr>
                                                        </thead>
                                                        <tbody className="text-center">
                                                        {menuList.map((item, index) => (
                                                            <tr
                                                                key={index}
                                                                style={{ transition: "0.3s" }}
                                                                onMouseEnter={(e) => (e.currentTarget.style.background = "#f0fff4")}
                                                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                                            >
                                                                <td>{index + 1}</td>
                                                                <td> 
                                                                    {item.edit_flag == true ?
                                                                        <CFormInput type="text" aria-label="sm input example" value={item.name} onChange={(e) => editNameChange(item.id, e.target.value)} />
                                                                        :
                                                                        <label>{item.name}</label>
                                                                    }</td>
                                                                <td>
                                                                   {item.edit_flag == true ?
                                                                        <CFormSelect className="" value={item.type} onChange={(e)=>editDishChange(item.id, e.target.value)}>
                                                                            <option  value="0">Side Dish</option>
                                                                            <option  value="1">Main Dish</option>
                        
                                                                        </CFormSelect>
                                                                        :
                                                                        <label>{item.type == 1? "Main Dish" : "Side Dish"}</label>
                                                                    }
                                                                </td>
                                                                <td>
                                                                    
                                                                    {item.edit_flag == true ?
                                                                        <CFormInput type="text" aria-label="sm input example" value={item.price} onChange={(e) => editPriceChange(item.id, e.target.value)} />
                                                                        :
                                                                        <label>฿{item.price}</label>
                                                                    }
                                                                </td>
                                                                
                                                                <td>
                                                                    {item.edit_flag === true ? (
                                                                        <img src={updateImg} alt="Girl Headphones" width={"30"} 
                                                                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                                                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                                                            onClick={() => updateClick(item.id)}
                                                                        />
                                                                    
                                                                    ) : (
                    
                                                                        <img src={editImg} alt="Girl Headphones" width={"30"} 
                                                                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                                                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                                                            onClick={() => editClick(item.id)}
                                                                        />
                                                                    
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    <img src={deleteImg} alt="Girl Headphones" width={"30"} 
                                                                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                                                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                                                        onClick={() => deleteClick(item.id)}
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
                                    </>
                                
                               
                            </CCard>
                        </CCol>
                        <CCol lg="2"></CCol>
                    </CRow>
                )}
                
                </>
            )
            : 
            (
               <>
               
                {menuList.length > 0 ? (
                   <CRow className="mt-5">
                        <CCol lg="2"></CCol>
                        <CCol lg="8">
                            <CCard className=" border-0 rounded-3">
                                <CCardHeader className="bg-white">
                                    <CRow>
                                        <CCol className="d-flex align-items-center">
                                            <h5 style={{ fontFamily: "serif", marginTop:"4px", marginRight: "4px" }}>Daily Menu List</h5>
                                        </CCol>
                                    </CRow>
                                </CCardHeader>
                                    <>
                                        <CCardBody>                     
                                            <>
                                                <CRow className="">
                                                <CCol>
                                                    <div className="table-responsive tableFixHead">
                                                    {/* ⬇️ အစောင့်အစပ်မရှိ အဲ့ထဲက table code အ 그대로 ထားပေးထားတယ် */}
                                                    <table className="table  ng-return-list-table align-middle">
                                                        <thead className="text-center">
                                                        <tr>
                                                            <th
                                                                className="bg-body-tertiary"
                                                                style={{ verticalAlign: "middle" }}
                                                                width="60px"
                                                            >
                                                                 <input
                                                                        type="checkbox"
                                                                        style={{ width: "14px", height: "14px" }}
                                                                        value={allCheck}
                                                                        checked={allCheck === true}
                                                                        onChange={() => allCheckboxChange()}
                                                                    />
                                                            </th>
                                                            <th
                                                                className="bg-body-tertiary"
                                                                style={{ verticalAlign: "middle" }}
                                                                width="180px"
                                                            >
                                                            Menu Name
                                                            </th>
                                                            <th
                                                                className="bg-body-tertiary"
                                                                style={{ verticalAlign: "middle" }}
                                                                width="180px"
                                                            >
                                                            Dish Type
                                                            </th>
                                                            <th
                                                                className="bg-body-tertiary"
                                                                style={{ verticalAlign: "middle" }}
                                                                width="180px"
                                                            >
                                                            Price
                                                            </th>
                                                            <th
                                                                className="bg-body-tertiary"
                                                                style={{ verticalAlign: "middle" }}
                                                                width="80px"
                                                            >
                                                            Status
                                                            </th>
                                                            
                                                        </tr>
                                                        </thead>
                                                        <tbody className="text-center">
                                                        {menuList.map((item, index) => (
                                                            <tr
                                                                key={index}
                                                                style={{ transition: "0.3s" }}
                                                                onMouseEnter={(e) => (e.currentTarget.style.background = "#f0fff4")}
                                                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                                            >
                                                                <td style={{paddingTop: "12px", paddingBottom: "12px"}}>
                                                                    <input
                                                                        type="checkbox"
                                                                        style={{ width: "14px", height: "14px" }}
                                                                        value={item.id}
                                                                        checked={item.check === true}
                                                                        onChange={() => checkboxChange(item.id)}
                                                                    />
                                                                </td>
                                                                <td> 
                                                                    {item.edit_flag == true ?
                                                                        <CFormInput type="text" aria-label="sm input example" value={item.name} onChange={(e) => editNameChange(item.id, e.target.value)} />
                                                                        :
                                                                        <label>{item.name}</label>
                                                                    }</td>
                                                                <td>
                                                                   {item.edit_flag == true ?
                                                                        <CFormSelect className="" value={item.type} onChange={(e)=>editDishChange(item.id, e.target.value)}>
                                                                            <option  value="0">Side Dish</option>
                                                                            <option  value="1">Main Dish</option>
                        
                                                                        </CFormSelect>
                                                                        :
                                                                        <label>{item.type == 1? "Main Dish" : "Side Dish"}</label>
                                                                    }
                                                                </td>
                                                                <td>
                                                                    
                                                                    {item.edit_flag == true ?
                                                                        <CFormInput type="text" aria-label="sm input example" value={item.price} onChange={(e) => editPriceChange(item.id, e.target.value)} />
                                                                        :
                                                                        <label>฿{item.price}</label>
                                                                    }
                                                                </td>
                                                                
                                                                <td>
                                                                   {item.active == 1 ? <span class="badge bg-success">Active</span> : <span class="badge bg-secondary">Inactive</span>}
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
                                        <CCardFooter className="bg-white text-end mb-3" style={{borderTop: "none"}}>
                                            <CButton
                                                className="login-button"
                                                onClick={() => activeBtn()}
                                                style={{ width: "100px", marginLeft: "5px", marginRight: "5px" }}
                                                color="primary"
                                            >
                                                Active
                                            </CButton>
                                            <CButton
                                                className="login-button"
                                                onClick={() => inactiveBtn()}
                                                style={{ width: "100px", marginLeft: "5px", marginRight: "5px"  }}
                                                color="primary"
                                            >
                                                Inactive
                                            </CButton>
                                             <CButton
                                                className="login-button"
                                                onClick={() => clearBtn()}
                                                style={{ width: "100px", marginLeft: "5px", marginRight: "5px"  }}
                                                color="primary"
                                            >
                                                Clear
                                            </CButton>
                                        </CCardFooter>

                                       {menuList.length > 0 && (
                                        <CCardFooter className="bg-white text-center mb-3 mt-3 shadow-lg border-0 rounded-3" style={{ borderTop: "none" }}>
                                            <CRow className="mb-4 mt-2">
                                            <CCol className="text-center">
                                                <h4
                                                style={{
                                                    fontWeight: "bold",
                                                    color: "#2c3e50",
                                                    borderBottom: "2px solid #2c3e50",
                                                    display: "inline-block",
                                                    paddingBottom: "4px",
                                                }}
                                                >
                                                Today’s Active Menu
                                                </h4>
                                            </CCol>
                                            </CRow>

                                            {menuList.filter(data => data.active === 1).length > 0 ? (
                                                menuList
                                                    .filter(data => data.active === 1)
                                                    .map((data, ind) => (
                                                    <CRow key={ind} className="mb-4">
                                                        <CCol lg="3"></CCol>
                                                        <CCol
                                                        lg="6"
                                                        style={{
                                                            display: "flex",
                                                            textAlign: "start",
                                                            fontSize: "1rem",
                                                            padding: "6px 12px",
                                                            borderBottom: "1px dashed #ccc",
                                                        }}
                                                        >
                                                        <span style={{ fontWeight: "600", color: "#34495e", width: "200px" }}>
                                                            {data.name}
                                                        </span>
                                                        <span style={{ fontWeight: "bold", color: "#e74c3c" }}>
                                                            - ฿{data.price}
                                                        </span>
                                                        </CCol>
                                                    </CRow>
                                                    ))
                                            ) : (
                                            <CRow className="mt-3 mb-4">
                                                <CCol>
                                                <p
                                                    style={{
                                                    fontSize: "1.1rem",
                                                    color: "#7f8c8d",
                                                    fontStyle: "italic",
                                                    }}
                                                >
                                                    🍽️ No active menu for today
                                                </p>
                                                </CCol>
                                            </CRow>
                                            )}
                                        </CCardFooter>
                                        )}

                                    </>
                                
                               
                            </CCard>
                        </CCol>
                        <CCol lg="2"></CCol>
                    </CRow>
                ):
                (
                      <div
                        style={{
                        textAlign: "center",
                        padding: "60px 20px",
                        color: "#6c757d",
                        
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
                )
                }
                
               
               </>
            )}
            
            

            {/* <div className="tabs-bottom-line" />
            
            <div className="tab-content"></div> */}
          </div>
        </CForm>
      </CCol>

    </CRow>
  )
}

export default DailyMenuIndex
