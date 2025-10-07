import React, { useState, useEffect } from "react";
import {
    CAvatar,
    CButton,
    CFormSelect,

    CCol,

    CRow,

    CFormInput
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import Confirmation from "../../common/Confirmation";
import {validateIntegerOnly} from "../../common/CommonValidation"
import Message from "../../common/SuccessError";
import {
    cilTrash,
    cilPencil,
    cilCheckAlt,
    cilMinus,
    cilClipboard
} from '@coreui/icons'
import Loading from "../../common/Loading"
import ApiPath from "../../common/ApiPath";
import { ApiRequest } from "../../common/ApiRequest";

const ListIndex = () => {
    const [error, setError] = useState([]); // for error message
    const [success, setSuccess] = useState([]); // for success message
    const [name, setName] = useState("");
    const [itemData, setItemData ] = useState([]);
    const [item, setItem ] = useState("");
    const [copyData, setCopyData] = useState([]);
    const [userData, setUserData] = useState([])
    const [meatData, setMeatData ] = useState([]);
    const [deletedID, setDeletedID ] = useState("");
    const [updatedID, setUpdatedID ] = useState("");
    const [show, setShow] = useState(false); // 
    const [content, setContent] = useState(""); // 
    const [type, setType] = useState("save"); //
    const [loading, setLoading] = useState(false);  // for loading
    const [loginID , setLoginID ] = useState(localStorage.getItem('LOGIN_ID'));

    

    useEffect(() => {
        (async () => {
            if(localStorage.getItem("LOGIN_ID") == undefined){
                window.location.href="/login";
            }
            setLoading(true);
            await getMenuType();
            await getMeatType();
            await searchClick();
        })();
    }, []);

    let getMeatType =async ()=>{
        setLoading(true);
        let object = {
            url: ApiPath.MeatTypeSearch,
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
                setMeatData(response.data.data);
            } else {
                setError([response.data.message]); setSuccess([]);
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }
        }
    }

    let getMenuType =async ()=>{
        let object = {
            url: ApiPath.MenuTypeSearch,
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
                setItemData(response.data.data);
            } else {
                setError([response.data.message]); setSuccess([]);
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }
        }
    }
    

    let searchClick =async () => {
        setError([]); setSuccess([]);
        setLoading(true);
        let object = {
            url: ApiPath.MenuSearch,
            method: 'get',
            params: {
                "name": name,
                "type": item,
                "login_id": loginID
            }
        }

        let response = await ApiRequest(object);
        if (response.flag === false) {
            setError([response.message[0]]); setUserData([]); setLoading(false);
        } else {
            if (response.data.status === 'OK') {
                setUserData(response.data.data.data);setCopyData(response.data.data.data);setLoading(false);
                // setDeletedData([]);setDeletedID("");
            } else {
                setError([response.data.message]); setSuccess([]);
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }
        }
    }

    let tempSearchClick =async () => {
        setLoading(true);
        let object = {
            url: ApiPath.MenuSearch,
            method: 'get',
            params: {
                "name": name,
                "type": item,
                "login_id": loginID
            }
        }

        let response = await ApiRequest(object);
        if (response.flag === false) {
            setError([response.message[0]]); setUserData([]); setLoading(false);
        } else {
            if (response.data.status === 'OK') {
                setUserData(response.data.data.data);setCopyData(response.data.data.data);setLoading(false);
                setDeletedID("");setUpdatedID("");
            } else {
                setError([response.data.message]); setSuccess([]);
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }
        }
    }

    let updateClick =async (id) => {
        let temp = userData.filter(data=> data.id == id)
        if(temp[0]['price'] == ""){
            setError(["Please fill price!"]);
            setSuccess([]);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }else{
            setError([]); setSuccess([]);setLoading(false);setType("save");
            setUpdatedID(id);
            setShow(true);setContent("Are you sure want to update?");
        }
    }

    let deleteClick = (id) => {
        setError([]); setSuccess([]);setLoading(false);setType("delete");setDeletedID(id);
        setShow(true);setContent("Are you sure want to delete?");
    }

    
    let editClick = (id) => {
        let temp = copyData.map(data => ({
            ...data,
            edit_flag: data.id === id
        }));
        setUserData(temp);
    };

    let editPriceChange = (id, val)=>{
        let res = userData.filter(data => {
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
        setUserData(res);
    }

    let editMeatChange = (id, val)=>{
        let res = userData.filter(data => {
            if (data.id == id) {
                data.meat_type = val;
                return data;
            }
            return data;
        })
        setUserData(res);
    }


    let saveOK =async ()=>{
        let res = userData.filter(data => data.id == updatedID)
        setError([]);setSuccess([]);setLoading(true);setShow(false);
        let object = {
            url: ApiPath.MenuUpdate,
            method: 'post',
            params: {
                "id": res[0]['id'],
                "price": res[0]['price'],
                "meat_id": res[0]['meat_type'],
                "login_id": loginID
            }
        }
        let response = await ApiRequest(object);
        if (response.flag === false) {
            setError([response.message[0]]); setSuccess([]);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });setLoading(false);
        } else {
            if (response.data.status == "OK") {
                setSuccess([response.data.message]);setError([]);tempSearchClick();
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }else{
                setError([response.data.message]);setSuccess([]);setLoading(false);
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            } 
        }
    }

    let deleteOK =async ()=>{
        setSuccess([]); setError([]); setShow(false);
        let deletedData = userData.find(data=> data.code == deletedID);
        setLoading(true);
        let object = {
            url: ApiPath.MenuDelete,
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
                tempSearchClick();window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            } else {
                setError([response.data.message]); setSuccess([]);
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }
        }
    }
    
    let itemChange = (e) => {
        setItem(e.target.value);
    }


    return (
        <>
            <Loading start={loading} />
            <h3>Menu List</h3>
            <hr />
            <Confirmation
                show={show}
                content={content}
                type={type}
                saveOK={saveOK}
                deleteOK={deleteOK}
                okButton={"Ok"}
                cancel={() => setShow(false)}
                cancelButton={"Cancel"}
            />
            <Message success={success} error={error} />
            <CRow className="mt-5">
                <CCol lg="2" className="text-align-center">
                    <p className="label">Menu Name</p>
                </CCol>
                <CCol lg="3">
                    <CFormInput type="text" aria-label="sm input example"  value={name} onChange={(e) => setName(e.target.value)} />
                </CCol>
                <CCol lg="1"></CCol>
                <CCol lg="2" className="text-align-center">
                    <p className="label" >Menu Type</p>
                </CCol>
                <CCol lg="3">
                    <CFormSelect className="mb-3"   onChange={(e) => itemChange(e)}>
                        <option value=""></option>
                        {itemData.length > 0 &&
                            itemData.map((data, ind) => {
                                return (
                                    <option value={data.id} key={ind}>{data.name}</option>
                                )
                            })
                        }
                    </CFormSelect>
                </CCol>
            </CRow>

            <CRow className="mt-5 mb-5 text-align-center">
                <CCol>
                    <CButton className="login-button" style={{ width: "100px" }} onClick={() => searchClick()}>Search</CButton>
                </CCol>
            </CRow>

          

            {userData.length > 0 &&
                <>
                    <CRow>
                        <CCol>
                            <label className="total-row">Total - {userData.length}  row(s)</label>
                        </CCol>
                    </CRow>
                    <CRow className="mb-4">
                        <CCol>
                            <div className='table-responsive tableFixHead'>
                                <table className='table menu-list-table'>
                                    <thead className="text-center">
                                        <tr>
                                            <th className="bg-body-tertiary" style={{verticalAlign: "middle"}} width="60px" >No</th>
                                            <th className="bg-body-tertiary" style={{verticalAlign: "middle"}} width="260px">Type</th>
                                            <th className="bg-body-tertiary" style={{verticalAlign: "middle"}} width="260px">Name</th>
                                            <th className="bg-body-tertiary" style={{verticalAlign: "middle"}} width="230px">Meat</th>
                                            <th className="bg-body-tertiary" style={{verticalAlign: "middle"}} width="210px">Price</th>
                                            <th className="bg-body-tertiary text-center" colSpan={2} style={{verticalAlign: "middle"}} width="100px">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-center">
                                    {userData.map((item, index) => (
                                        <tr
                                            key={index}
                                            style={{ transition: "0.3s" }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = "#f0fff4")}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                        >
                                            <td>{index + 1}</td>
                                            <td>{item.menu_type_name}</td>
                                            <td>{item.menu_name}</td>
                                            <td>

                                                {item.edit_flag == true ?
                                                     <CFormSelect className="mb-3" value={item.meat_type}   onChange={(e) => editMeatChange(item.id, e.target.value)}>
                                                        {meatData.length > 0 &&
                                                            meatData.map((data, ind) => {
                                                                return (
                                                                    <option value={data.id} key={ind}>{data.name}</option>
                                                                )
                                                            })
                                                        }
                                                    </CFormSelect>
                                                    :
                                                    <label>{item.meat_type_name}</label>
                                                }

                                            </td>
                                            <td className="fw-bold">
                                                {item.edit_flag == true ?
                                                    <CFormInput type="text" aria-label="sm input example" value={item.price} onChange={(e) => editPriceChange(item.id, e.target.value)} /> :
                                                    <label>{item.price}</label>
                                                }
                                            </td>
                                            <td>
                                                {item.edit_flag === true ? (
                                                <CIcon
                                                    icon={cilClipboard}
                                                    title="Update"
                                                    className="plus-button"
                                                    style={{
                                                        cursor: "pointer",
                                                        backgroundColor: "#10B981",
                                                        borderRadius: "50%",
                                                        padding: "5px",
                                                        color: "white",
                                                        borderColor: "#10B981",
                                                    }}
                                                    onClick={() => updateClick(item.id)}
                                                />
                                                ) : (
                                                <CIcon
                                                    icon={cilPencil}
                                                    title="Edit"
                                                    className="plus-button"
                                                    style={{
                                                        cursor: "pointer",
                                                        backgroundColor: "#447ffdff",
                                                        borderRadius: "50%",
                                                        padding: "5px",
                                                        color: "white",
                                                        borderColor: "#447ffdff",
                                                    }}
                                                    onClick={() => editClick(item.id)}
                                                />
                                                )}
                                            </td>
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
            }

        </>
    )
}

export default ListIndex
